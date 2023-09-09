import express from "express";
import path from "path";
const router = express.Router();

import {upload} from "../multer.js";
import User from "../model/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";

router.post("/create-user", upload.single("file"), async (req, res, next) => {
    const {name, email, password} = req.body;

    const userEmail = await User.findOne({email});

    if (userEmail) {
        return next(new ErrorHandler("user already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = {
        name: name,
        email: email,
        password: password,
        avatar: fileUrl,
    }

    console.log(user);
});

export default router;