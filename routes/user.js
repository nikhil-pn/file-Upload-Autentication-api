const express = require("express");
console.log("reached here");
const brcypt = require("bcrypt");
const router = express.Router();
const User = require("../models/userModels");
const {
  validatName,
  validatEmail,
  validatePassword,
  validateEmail,
  validateName,
} = require("../utlis/validators");

router.post("/signup", async (req, res) => {
  try {
    console.log("made to try");
    const { name, email, password, isSeller } = req.body;

    const existigUser = await User.findOne({
      where: { email: email },
    });
    if (existigUser) {
      return res.status(403).json({ err: "User already Exits" });
    }
    if (!validateName(name)) {
      return res.status(400).json({ err: "Name validate fails" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ err: "email validate fails" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ err: "Password validate fails" });
    }
    const hashedPassword = await brcypt.hash(password, (saltOrRounds = 10));

    const user = {
      email,
      name,
      password: hashedPassword,
      isSeller: isSeller || false,
    };

    const createdUser = await User.create(user);

    console.log(createdUser);
    return res.status(201).json({
      message: `welcome ${createdUser.name}`,
    });
  } catch (error) {
    console.log("made to catch");
    return res.status(500).send(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { name } = req.body;
    return res.status(200).json({ result: name });
  } catch (error) {
    console.log("kdjfka");
    return res.status(500).send(error);
  }
});

module.exports = router;
