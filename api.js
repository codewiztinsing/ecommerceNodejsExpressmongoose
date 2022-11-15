var products = require("./models/products")
var Users = require("./models/users")
var Order = require('./models/orders')

async function listProducts(req, res, next) {


    try {
        const { limit, offset, tag } = req.query;
        const data = await products.list(
            {
                limit: Number(limit),
                offset: Number(offset),
                tag
            }
        )

        res.json(data)

    }
    catch (error) {
        next(error)
    }

}


async function getProduct(req, res, next) {


    try {
        const { id } = req.params
        const product = await products.get(id)
        if (!product) next();
        res.json(product)

    }
    catch (error) {
        next(error)
    }

}


async function createProduct(req, res, next) {
    var data = req.body
    try {
        if(!req.isAdmin) return forbidden(next)
        const product = await products.create(data)
        res.json(product)
    }
    catch (error) {
        res.status(500).json({ error: error })
    }


}



function forbidden(next){
    const err = new Error('Forbidden')
    err.statusCode = 403
    return next(err)
}

async function editProduct(req, res, next) {
    try {
        if(!req.isAdmin) return forbidden(next)

        const change = req.body;
        const _id = req.params.id
        const product = await products.edit(_id, change)
        return product;
    }
    catch (error) {
        next(error)
    }


}


async function deleteProduct(req, res, next) {
    try {
        if(!req.isAdmin) return forbidden(next)

        await products.remove(req.params.id)
        res.json({ success: true })
    } catch (error) {
        next(error)
    }


}

// route handler to create order
async function createOrder(req, res, next) {
    try {
        const fields = req.body
        if(!req.isAdmin) fields.username = req.user.username;

        const order = await Order.create(fields)
        res.json(order)

    }
    catch (error) {
        next(error)
    }

}



// route handler to fetch all orders
async function getOrders(req, res, next) {
    try {
        const { offset = 0, limit = 25, productId, status } = req.query;
        const opts = {
            offset:Number(offset),
            limit:Number(limit),
            productId,
            status

        }

        if(!req.isAdmin) opts.username = req.user.username;

        const orders = await Order.list(opts)
        
        res.json(orders)

    }
    catch (error) {
        next(error)
    }


}

//rounte handler to create users

async function createUser(req,res,next){
    try {
        const user = await Users.create(req.body)
        const {username,email} = user
        return res.json({username,email});
    } catch (error) {
        next(error)
    }

}


module.exports = {
    listProducts,
    getProduct,
    createProduct,
    editProduct,
    deleteProduct,
    createOrder,
    getOrders,
    createUser
}