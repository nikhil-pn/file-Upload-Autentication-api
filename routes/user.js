const express = require("express")

const router = express.Router()
const {
    validatName,
    validatEmail,
    validatePassword
} = require("../utlis/validators")

router.post("/signup", async(req, res)=>{
    try {
        const {name, email, password, isSeller} = req.body;

        const existigUser = await 
    } catch (error) {
        return res.status(500).send(error)
    }
})

module.exports = router;