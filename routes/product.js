const express = require("express");
const upload = require("../utlis/fileUpload");

const router = express.Router();
const { isAuthenticated, isSeller, isBuyer } = require("../middlewares/auth");
const product = require("../models/productModels");
const stripeKey = require("../config/credentials")
const stripe = require("stripe")(stripeKey)
const {WebhookClient} = require("discord.js")

const webhook = new WebhookClient({
  url: "https://discord.com/api/webhooks/1058049928405979296/wuhaUnSdEsdlh-RTKjih594qgG-FE8rt2CQYXIAGBWYjwnPtuBILr9etetaBIhDs3Vne"
})

const { NUMBER } = require("sequelize");
const Product = require("../models/productModels");
const Order = require("../models/orderModels");
const { RoleSelectMenuBuilder } = require("@discordjs/builders");
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

router.get("/get/all", async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({ err: error });
  }
});

router.post("/buy/:productID",  async (req, res) => {
  try {
    console.log(">>>>>>.made here");
    const productFind = await Product.findOne({
      where: { id: req.params.productID },
    });
    
    const product = productFind.dataValues;
    console.log("product", product);

    // if (!product) {
    //   return res.status(404).json({ err: "No product found" });
    // }

    // const orderDetails = {
    //   productID,
    //   buyerId: req.user.id,
    // };

    // console.log("orderDetails", orderDetails);


    // let paymentMethod = await stripe.paymentMethod.create({
    //   type: "card",
    //   card: {
    //     number : "5465464545645645646545",
    //     exp_month : 9,
    //     exp_year : 2023,
    //     cvc : "314"
    //   }
    // })
    
    // let paymentIntent = await stripe.paymentIntent.create({
    //   amount: product.price,
    //   currency: "inr",
    //   payment_method_types : ["card"],
    //   payment_method: paymentMethod.id,
    //   comfirm : true
    // })

    // if(paymentIntent){
    //   const createOrder = await Order.create(orderDetails);
      
    //   webhook.send({
    //     content : `I am sending it from day 10 for order id :${createOrder}`,
    //     username: "order-keeper",
    //     avatarURL : 'https://i.imgur.com/AfFp7pu.png'
    //   })
      
    //   return res.status(200).json({
    //     createOrder
    //   })
    // }else{
    //   return res.status(400).json({
    //     err: "payment failed"
    //   })
    // }
    webhook.send({
      content : `I am sending it from day 10 for order id ${JSON.stringify(product)}`,
      username: "development-testing",
    })
    console.log("made it to here last line");


    return res.status(200).json({
      product
    })

  } catch (error) {
    res.status(500).json({ err: error });
  }

});

module.exports = router;
