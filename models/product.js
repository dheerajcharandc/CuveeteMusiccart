const mongoose = require("mongoose");

const product = mongoose.model("product", {
    company:{
        type: String,
        required: true,
    },
    headphoneName:{
        type: String,
        required: true,
    },
    color:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    headphoneType:{
        type: String,
        required: true,
    },
    imgUrl1:{
        type: String,
        required: true,
    },
    imgUrl2:{
        type: String,
        required: true,
    },
    imgUrl3:{
        type: String,
        required: true,
    },
    imgUrl4:{
        type: String,
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
    desc1:{
        type: Array,
        required:true,
    }

});
module.exports = product;