const express=require("express");
const app=express()
const cors=require("cors")

app.use(cors)
app.use(express.json())


const userRouter=require('./routes/user')

app.user('/api/user',userRouter)