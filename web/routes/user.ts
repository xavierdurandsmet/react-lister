import * as express from "express";
import * as crypto from "crypto";
import * as aws from "aws-sdk";
import * as async from "async";
import * as passport from "passport";
import { User, UserInterface, accessTokenMiddleware } from "../models/user";
import { Email } from "../models/email";
import { autoHubAvailableInZipCode } from "../models/zipcode"

let router = express.Router();

router.get("/login", (req, res) => {    
  res.render('user/login')
}); 

router.post("/login", passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true 
}));

router.get('/register', (req, res) => {
  res.render('user/register', {
    user: req.user
  });
});

router.post('/register', (req, res) =>  {
  var user = new User(req.body);
  user.save((err) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Please complete all fields');
      res.redirect('/register');
    }
    else req.logIn(user, (err) => {
      res.redirect('/');
    });
  });
});

// The phone logs in without a password.
// The access_token is automatically generated
// and saved in the app. The token is activated
// upon email token validation.
router.post('/api/authenticate', (req, res) => {
  async.waterfall([
    (done: { (err: Error, user: UserInterface): void }) => {
      User.findOne({ email: req.body.email }, (err, user) => {
        console.log(req.body);
        if (!user) {
          user = new User(req.body);
        }
        user.accessToken = crypto.randomBytes(20).toString('hex');
        user.emailToken = crypto.randomBytes(8).toString('hex');
        user.emailTokenExpires = new Date(Date.now() + 1000*60*60);
        user.accessTokenEnabled = false;
        user.zipCode = req.body['zipCode'];
        user.save((err) => {
          done(err, user);
        });
      });
    },
    (user: UserInterface, done: { (err: Error, User: UserInterface): void }) => {
      autoHubAvailableInZipCode(user.zipCode, (available) => {
        if (available) {
          done(null, user);
        } else {
          done(Error("Sorry - autohub is not available in your area yet. " +
          "To guarantee a great experience to our users we currently " +
          "serve the San Francisco bay area only."), null);
        }
      })
    },
    (user: UserInterface, done: { (err: Error): void }) => {
      new Email(
        user.email,
        'Welcome to autohub',
          'Please click on the following link, or paste this into your browser to complete your sign-in to the autohub app:\n\n' +
          'http://' + req.headers['host'] + '/activate/' + user.emailToken + '\n\n',
        'autohub <hello@autohub.io>'
      ).send((err: Error) => {
        if (err) throw err;
        res.send(user.accessToken);
        done(err);
      })
    }]
    , (err: Error) => {
      if (err) {
        res.status(500).send(err.message);
      }
    }
  );
});

router.get('/api/zipCode/:zipCode', (req, res) => {
  autoHubAvailableInZipCode(req.params['zipCode'], (available) => {
    if (available) {
      res.send({ available: true })
    } else {
      res.send({
        available: false,
        error: "Sorry - autohub is not available in your area yet. " +
      "To guarantee a great experience to our users we currently " +
      "serve the San Francisco bay area only."
      })
    }
  })
})

router.get('/api/authenticate/', accessTokenMiddleware, (req, res) => {
  res.sendStatus(200);
});

router.get('/activate/:token', (req, res) => {
  User.findOne({ emailToken: req.params.token, emailTokenExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      req.flash('error', 'Token is invalid or has expired. Please try to sign-in again.');
      return res.redirect('/');
    }
    user.accessTokenEnabled = true
    user.emailToken = undefined;
    user.emailTokenExpires = undefined;
    user.save(err => {
      if (err) {
        req.flash('error', 'An unknwown error has occured. Please try to sign-in again.');
        res.redirect('/');
      } else {
        res.render('user/activate', {
          iPhone: /iPhone/.test(req.headers['user-agent']),
          user: req.user
        });
      }
    });
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/forgot', (req, res) => {
   res.render('user/forgot', {
     user: req.user
   });
});

router.post('/forgot', (req, res, next) => {
  async.waterfall([
    (done: { (err: Error, token: string): void }) => {
      crypto.randomBytes(20, (err, buf) => {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    (token: string, done: { (err: Error, token: string, user: UserInterface): void }) => {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.emailToken = token;
        user.emailTokenExpires = new Date(Date.now() + 1000*60*60);
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    (token: String, user: UserInterface, done: { (err: Error): void }) => {
      new Email(
        user.email,
        'autohub password reset',
        'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers['host'] + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        'autohub <password@autohub.io>'
      ).send((err: Error) => {
        if (err) throw err;
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err);
      })
    }
  ], (err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

router.get('/reset/:token', (req, res) => {
  User.findOne({ emailToken: req.params.token, emailTokenExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('user/reset', {
      user: req.user
    });
  });
});

router.post('/reset/:token', (req, res) => {
  async.waterfall([
    (done: { (error: Error, user: UserInterface): void }) => {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.emailToken = undefined;
        user.emailTokenExpires = undefined;

        user.save(err => {
          req.logIn(user, (err) => {
            if (err) {
              req.flash('error', 'Oops, something bad happened. Please try again later.');
            } else {
              req.flash('success', 'Your password has successfully been updated.');
            }
            done(err, user);
          });
        });
      });
    },
  ], (err) => {
    res.redirect('/');
  });
});

export = router;