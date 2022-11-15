var path = require('path')
var db = require('../db')
var cuid = require('cuid')
var { isURL } = require("validator");



function urlSchema(opts = {}) {
    const { required } = opts;

    return {
        type: String,
        required: !!required,
        validate: {
            validator: isURL,
            message: props => `${props.value} is not a valid url `
        }
    }
}



const Product = db.model('Product', {
    _id: { type: String, default: cuid },
    description: { type: String, required: true },
    imgThumb: urlSchema({ required: true }),
    img: urlSchema({ required: true }),
    link: urlSchema(),
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userLink: urlSchema(),
    tags: { type: [String], index: true }
})



async function list(opts = {}) {
    const { limit, offset, tag } = opts;
    const query = tag ? { tags: tag } : {}
    console.log(offset, limit);
    const products = await Product
        .find(query)
        .sort({ _id: 1 })
        .skip(offset)
        .limit(limit)

    return products;

}

async function get(_id) {
    var product = await Product.findById(_id)
    return product;
}



async function create(fields) {

    const product = await new Product(fields).save();
    return product;

}



async function edit(_id, change) {
    var product = await get(_id)
    Object.keys(change).forEach(function (key) {
        product[key] = change[key]
    })
    await product.save()
    return product
}

async function remove(_id) {
    console.log(_id);
    const product = await Product.deleteOne({ _id })
    return {}

}




module.exports = {
    list,
    get,
    create,
    remove,
    edit
}
