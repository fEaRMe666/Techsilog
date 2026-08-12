const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const auth = require("./auth");

require("dotenv").config();

const app = express();

app.use(express.json());

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "https://techsilog.romhert.dev"
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.send({
        message: "Techsilog API is running"
    });
});

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.use(auth.errorHandler);

if (require.main === module) {

    mongoose.connect(process.env.MONGO_STRING)
    .then(() => {

        console.log("Now connected to MongoDB Atlas.");

        app.listen(process.env.PORT || 4000, () => {
            console.log(
                `Techsilog API is now online on port ${process.env.PORT || 4000}`
            );
        });
    })
    .catch((error) => {

        console.log("MongoDB connection failed.");
        console.log(error.message);
    });
}

module.exports = { app, mongoose };
