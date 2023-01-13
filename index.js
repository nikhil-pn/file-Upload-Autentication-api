const express = require("express")

const app = express()
const PORT = 3001;

//middleware
app.use(express.json())
app.use(express.static("content"))

app.listen(PORT, ()=>{
    console.log("server is running at", PORT);
})