import express from "express";
import ErrorHandler from "./middleware/error.js";
const app = express();
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({extended: true}));


// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config();
}

// import routes
import user from "./controller/user.js";

app.use("/api/v2/user", user);

//It's for Error Handling
app.use(ErrorHandler);

export default app;