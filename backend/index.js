require('dotenv').config
const express=require("express");
const app=express()
const cors=require("cors")

app.use(cors())
app.use(express.json())

const storeRouter=require('./routes/store')
const userRouter=require('./routes/user')

app.use('/api/user',userRouter)
app.use('/api/stores',storeRouter)


app.listen(3000)