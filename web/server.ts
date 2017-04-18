import * as express from "express";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as passport from "passport";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as favicon from "serve-favicon";
import * as indexRoute from "./routes/index";
import * as vehicleRoute from "./routes/vehicle";
import * as userRoute from "./routes/user";
import * as env from "dotenv";
import * as aws from "aws-sdk";
import * as path from 'path';
var flash = require('express-flash');

import { configurePassportAuth } from "./models/user";

var app = express();

env.config();

aws.config.update({
	region: 'us-west-2'
});

mongoose.connect(process.env.DB_URI);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
(mongoose as any).Promise = global.Promise;

configurePassportAuth();

app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 5000));

// Middlewares
app.use(express.static("/public"));
app.use('/js', express.static("dist"));
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended:true } ));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({ secret: process.env.COOKIE_SECRET, resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(indexRoute);
app.use(vehicleRoute);
app.use(userRoute);

app.listen(app.get('port'), () => {
	console.log('react-lister server is running on port: ', app.get('port'));
});
