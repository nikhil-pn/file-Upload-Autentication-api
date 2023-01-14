const express = require("express");

const app = express();
const PORT = 3001;
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/user")
const productRoutes = require("./routes/product")

connectDB();
//middleware
app.use(express.json())
app.use(express.static("content"))
app.use(express.urlencoded({extended: false}))


app.use("/api/v1/user", userRoutes)
app.use('/api/v1/product', productRoutes)
app.listen(PORT, () => {
  console.log("server is running at", PORT);
});
