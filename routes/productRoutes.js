const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../auth");
const user = require("../models/user");
const product = require("../models/product");
const router = express.Router();
const bodyParser=require('body-parser');

router.post("/addproduct",async (req, res) => {
    let { company, headphoneName, color, price, headphoneType,imgUrl1,imgUrl2,imgUrl3,imgUrl4, desc ,desc1} = req.body;
  
    if (!company || !headphoneName || !color || !price || !headphoneType || !imgUrl1 || !imgUrl2 || !imgUrl3 || !imgUrl4 || !desc || !desc1) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    try {
      const result = await product.create({
        company:company,
        headphoneName: headphoneName,
        color:color,
        price:price,
        headphoneType: headphoneType,
        imgUrl1:imgUrl1,
        imgUrl2:imgUrl2,
        imgUrl3:imgUrl3,
        imgUrl4:imgUrl4,
        desc:desc,
        desc1:desc1,
      });
  
      return res.status(201).json({ product: result });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong !" });
    }
  });
  router.get('/getproducts',bodyParser.json(),  async (req, res) => {
    try {
      const products = await product.find();
      res.status(200).send({ status: 'SUCCESS', products: products });
    } catch (error) {
      console.error('Error while fetching products:', error);
      res.status(500).send({ status: 'FAILED', message: 'Failed to fetch products' });
    }
   
  });
  router.post("/search", bodyParser.json(), async (req, res) => {
    console.log("search");
    const searchString = req.body.searchString.toLowerCase();
    console.log(searchString);
    try {
      const filteredProducts = await product.find({
        $or: [
          { company: { $regex: searchString, $options: "i" } }, 
          { headphoneName: { $regex: searchString, $options: "i" } },
        ],
      });
  
      res.status(201).json(filteredProducts);
    } catch (error) {
      res.status(500).json({ msg: error });
    }});

router.post("/filter", async (req, res) => {
 
  const { company, headphoneType, color, minPrice, maxPrice, sortBy } 
  = req.body;
 
  try {
   
    const filter = [];
    let filteredProducts;
    if (!company && !color && !headphoneType) {
      if (!minPrice && !maxPrice) {
        filteredProducts = await product.find();
      } else {
        filteredProducts = await product.find({
          price: { $gte: minPrice, $lte: maxPrice },
        });
      }
    } else {
      if (company && company.length > 0) {
        filter.push({ company: company });
      }

      if (color) {
        filter.push({ color: color });
      }

      if (headphoneType) {
        filter.push({ headphoneType: headphoneType });
      }

      if (minPrice || maxPrice) {
        filter.push({ price: { $gte: minPrice, $lte: maxPrice } });
      }

      filteredProducts = await product.find({ $and: filter });
    }

    switch (sortBy) {
      case "featured":
        console.log(sortBy);
        break;
      case "lowest":
        console.log(sortBy);
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "highest":
        console.log(sortBy);
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "A-Z":
        console.log(sortBy);
        filteredProducts.sort((a, b) =>
          a.headphoneName.localeCompare(b.headphoneName)
        );
        break;
      case "Z-A":
        console.log(sortBy);
        filteredProducts.sort((a, b) =>
          b.headphoneName.localeCompare(a.headphoneName)
        );
        break;
    }

    res.status(201).json(filteredProducts);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

module.exports = router;


 
  