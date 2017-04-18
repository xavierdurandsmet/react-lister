import * as bcrypt from "bcrypt";
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as passportLocal from "passport-local";
import * as express from "express";

export interface UserInterface extends mongoose.Document {
    email: string,
    password: string,
    accessToken: string,
    accessTokenEnabled: boolean,
    emailToken: string,
    emailTokenExpires: Date,
    created: Date,
    updated: Date,
    isDealer: boolean,
    dealerName: string,
    dealerAddress: string,
    dealerVerified: boolean,
    zipCode: number,
    comparePassword: (candidatePassword: String, cb:((error:Error, isMatch: Boolean) => void)) => void
};

export const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    accessToken: { type: String },
    accessTokenEnabled: { type: Boolean, default: false },
    emailToken: { type: String },
    emailTokenExpires: { type: Date },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    isDealer: { type: Boolean, default: false},
    dealerName: { type: String },
    dealerAddress: { type: String },
    dealerVerified: { type: Boolean, default: false },
    zipCode: { type: Number }
});

UserSchema.methods.comparePassword = function (candidatePassword: String, cb:((error:Error, isMatch: Boolean) => void)) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err, false);
        cb(null, isMatch);
    });
};

UserSchema.pre('save', function(next) {

    var user = this;
    
    user.updated = new Date();

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(5, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

export const User = mongoose.model<UserInterface>('User', UserSchema);

export function accessTokenMiddleware(req: express.Request, res: express.Response, next: Function) {
    let accessToken = req.headers["access-token"];
    User.findOne({ accessToken: accessToken }, (err, user) => {
        if (!user) {
            res.sendStatus(403);
        } else if (!user.accessTokenEnabled) {
            res.sendStatus(401);
        } else {
            req.logIn(user, (err: Error) => {
                next();
            });
        }
    });
}

export function configurePassportAuth() {

    passport.use(new passportLocal.Strategy({ usernameField : "email" }, (email, password, done) => {
	    User.findOne({ email: email }, (err, user) => {
		    if (err) return done(err);
		    if (!user) return done(null, false, { message: 'Unknown email.' });
		    user.comparePassword(password, (err, isMatch) => {
			    if (isMatch) {
			    	return done(null, user);
			    } else {
			    	return done(null, false, { message: 'Incorrect password.' });
			    }
		    });
	    })
    }));

    passport.serializeUser((user, done) => {
	    done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
	    User.findById(id, (err, user) => {
		    done(err, user);
	    });
    }); 
}