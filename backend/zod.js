const z=require("zod")

const userCheck=z.object({
    username:z.string().min(3).max(50),
    email:z.string().email(),
    password:z.string().min(6),
    phone:z.string().optional(),
    role:z.enum(["buyer","seller","admin"]).default("buyer")
})

const storeCheck=z.object({
    ownerId:z.string().min(1),
    storename:z.string().min(2),
    description:z.string().optional(),
    logoUrl:z.string().url("Invalid image url layout").optional()
})

const productCheck=z.object({
    storeId:z.string().min(1),
    title:z.string(),
    description:z.string().optional(),
    price:z.number().positive(),
    stochQuantity:z.number().int().nonnegative(),
    images:z.array(z.string().url()).default([])
})

const orderCheck=z.object({
    userId:z.string().min(1),
    totalAmount:z.number(),
    items:z.array(z.object({
        productId:z.string().min(1),
        title:z.string(),
        quantity:z.number(),
        priceAtPurchase:z.number()
    })).min(1),
    orderStatus:z.enum(["Pending","Shipped","Delivered","Cancelled"]).default("Pending"),
    shippingAddress:z.object({
        street:z.string().min(1),
        city:z.string().min(1),
        state:z.string().min(1),
        zipCode:z.string().min(1),
        country:z.string().min(1)
    })
})


module.exports={
    userCheck,
    storeCheck,
    productCheck,
    orderCheck
}