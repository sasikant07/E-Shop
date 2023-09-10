import express from "express";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
const router = express.Router();

import {upload} from "../multer.js";
import User from "../model/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import sendMail from "../utils/sendMail.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import sendToken from "../utils/jwtToken.js";

router.post("/create-user", upload.single("file"), async (req, res, next) => {
    const {name, email, password} = req.body;

    const userEmail = await User.findOne({email});

    if (userEmail) {
        const fileName = req.file.filename;
        const filePath = `./uploads/${fileName}`;
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({message: "Error deleting file"});
            } else {
                res.json({message: "File Deleted Successfully"});
            }
        })
        return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = {
        name: name,
        email: email,
        password: password,
        avatar: fileUrl,
    }

    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
        await sendMail({
            email: user.email,
            subject: "activate your account", 
            message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`
        })
        res.status(201).json({
            success: true,
            message: `Please check your email:- ${user.email} to activate your account!`
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
    
});

// Create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    })
}

// Activate user
router.post("/activation", catchAsyncErrors(async (req, res, nect) => {
    try {
        const {activation_token} = req.body;

        const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

        if (!newUser) {
            return next(new ErrorHandler("Invalid token", 400));
        }

        const {name, email, password, avatar} = newUser;

        User.create(({
            name,
            email,
            password,
            avatar,
        }));

        sendToken(newUser, 201, res);
    } catch (error) {
        
    }
}))
export default router;