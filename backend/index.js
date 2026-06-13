require('dotenv').config()
const express=require("express");
const app=express()
const cors=require("cors")
app.use(cors())
app.use(express.json())
const userRouter=require('./routes/user');
app.use('/api/user',userRouter)

app.listen(3000, () => console.log("Server running on port:3000"));