const express = require("express");
const upload = require("../utlis/fileUpload");

const router = express.Router();
const { isAuthenticated, isSeller, isBuyer } = require("../middlewares/auth");
const product = require("../models/productModels");

const { NUMBER } = require("sequelize");
const Product = require("../models/productModels");
router.post("/create", isAuthenticated, isSeller, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log("comming in err", err);
      return res.status(500).send(err);
    }
    const { name, price } = req.body;
    if (!name || !price || !req.file) {
      return res.status(400).json({
        err: "we require all 3",
      });
    }
    if (Number.isNaN(price)) {
      return res.status(400).json({
        err: "price should be number ",
      });
    }

    let productDetails = {
      name,
      price,
      content: req.file.path,
    };

    const savedProduct = await Product.create(productDetails);

    return res.status(200).json({
      status: "ok",
      productDetails: savedProduct,
    });
  });
});

router.get("/get/all", isAuthenticated, async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({ err: error });
  }
});

router.post("/buy/:productID", isAuthenticated, isBuyer, async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.productID },
    });

    if (!product) {
      return res.status(404).json({ err: "No product found" });
    }

    const orderDetails = {
      productID,
      buyerId: req.user.id,
    };
  } catch (error) {
    res.status(500).json({ err: error });
  }
});

module.exports = router;
