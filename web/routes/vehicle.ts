import * as express from "express";
import * as multer from "multer";
import * as aws from "aws-sdk";
import * as async from "async";
import * as crypto from "crypto";
import { accessTokenMiddleware } from "../models/user"
import { Vehicle } from "../models/vehicle";

let router = express.Router();
let s3 = new aws.S3();

let multerMiddleware = multer().fields([{ name: "photo", maxCount: 10 }]);

router.post("/api/vehicle", accessTokenMiddleware, multerMiddleware, (req, res) => {    

    var vehicle = new Vehicle(req.body)
    vehicle.ownerID = req.user._id

    async.series([
        // Model validation
        (callback) => {
            vehicle.validate(callback);
        },
        // Upload photos to Amazon S3
        (callback) => {
            async.each(req.files["photo"], (photo, cb) => {
                s3.upload({
                    Bucket: "autohub-io",
                    ACL: "public-read",                 
                    Body: photo.buffer, 
                    Key: "vehicle/" + vehicle.id + "/" + photo.originalname,
                    ContentType: "image/jpeg"
                }, cb);
            }, callback);
        },
        // Save to MongoDB
        (callback) => {
            vehicle.save(callback);
        }
    ], (error: Error) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.send({
                "id" : vehicle.id
            });
        }
    })
});

export = router;