
require('dotenv').config();
console.log(process.env.MONGODB_URL);
require('./db/db');

const express=require("express");
const app=express()
const cors=require("cors")
const PORT = process.env.PORT;

app.use(cors())
app.use(express.json())

const storeRouter=require('./routes/store')
const userRouter=require('./routes/user')
const orderRouter=require('./routes/order')
const productRouter=require('./routes/product')
const homeRouter=require('./routes/home')
const paymentRouter=require('./routes/payment')
const uploadRouter=require('./routes/upload')
const adminRouter=require('./routes/admin')


app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/stores',storeRouter)
app.use('/api/orders',orderRouter)
app.use('/api/products',productRouter)
app.use('/api/home',homeRouter)
app.use('/api/payment',paymentRouter)
app.use('/api/upload',uploadRouter)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});