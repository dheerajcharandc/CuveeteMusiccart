const mongoose = require("mongoose");
const validator = require("validator");
const user = mongoose.model("user", {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  mobile: {
    type: String,
    required:true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Validate mobile number format (10 digits)
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = user;