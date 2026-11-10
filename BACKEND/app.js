const express = require("express");
const cors = require("cors");
let mongoose= require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/db').then(()=>{
    console.log("serverrr....");
    
})

const app = express();
app.use(
  cors()
);

app.use(express.json());


const authRoutes = require('./routes/authRoutes')

app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("Server is running");
});



app.listen(4000, () => {
  console.log(`Server running on port `);
});