const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const auth = require("./auth");
const user = require("./models/user");
const bodyParser = require("body-parser");
const app = express();
const product = require("./models/product");

dotenv.config();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const corsOptions = {
    Credential:true,
    origin: 'https://651876da83a64051266758f7--inquisitive-sable-6343a3.netlify.app/', 
  
  };
  app.use(cors(corsOptions));



app.get("/", (req, res) => {
  res.json({
    message: "Success is the only option",
  });
});

const signupRoute = require("./routes/signupRoute");
const loginRoute = require("./routes/loginRoute");
const productRoutes = require("./routes/productRoutes");


// Use route files
app.use(loginRoute);
app.use(signupRoute);
app.use(productRoutes);

app.use((req, res, next) => {
  const err = new Error("token not found");
  err.status = 404;
  next(err);
});

// Error handler middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// *** Connection with Database ***
app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(`Example app listening on port 4000`);
    })
    .catch((error) => {
      console.log("connection Failed :- ", error);
    });
});