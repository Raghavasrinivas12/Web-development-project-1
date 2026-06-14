
require('dotenv').config();
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


app.use('/api/user',userRouter)
app.use('/api/stores',storeRouter)
app.use('/api/orders',orderRouter)
app.use('/api/products',productRouter)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});