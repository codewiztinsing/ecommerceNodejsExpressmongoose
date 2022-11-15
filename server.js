const express = require("express");
const api  = require("./api")
const auth  = require("./auth")
const middleware  = require("./middleware")
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 1337


var app = express();

// auth.setMiddleWare(app) 

app.use(middleware.cors)
app.use(bodyParser.json())
app.use(cookieParser());


//login passport.authenticate('local')
app.post('/login',auth.authenticate,auth.login)
//fetching products data api endpoints
app.get("/products",api.listProducts)
app.get("/products/:id",api.getProduct)

//posting products data api endpoints
app.post("/products",auth.ensureUser,api.createProduct)
app.put('/products/:id',auth.ensureUser,api.editProduct)

app.delete('/products/:id',auth.ensureUser,api.deleteProduct)

//fetching orders d ata api endpoints

app.get('/orders',auth.ensureUser,api.getOrders)

//posting orders data api endpoints

app.post('/orders',auth.ensureUser,api.createOrder)
// user creation
app.post('/users',api.createUser)

app.use(middleware.handleError)
app.use(middleware.notFound)
app.listen(PORT,() => console.log(`server started at ${PORT}`))
