var db = require('../db')
var cuid = require('cuid')
const {isEmail} = require('validator');


function emailSchema(opts = {}) {
    const { required } = opts;

    return {
        type: String,
        required: !!required,
        validate: {
            validator: isEmail,
            message: props => `${props.value} is not a valid email `
        }
    }
}


const Order = db.model('Order',{
    _id : {
        type:String,
        default:cuid
    },
    buyerEmail:emailSchema({required:true}),
    products:[
        {
            type:String,
            ref:'Product',
            index:true,
            required:true
        }
    ],
    status : {
        type:String,
        index:true,
        default:'CREATED',
        enum:['CREATED','PENDING','COMPLETED']
    }

})

async function create(fields){
    const order = await new Order(fields).save()
    return order;
}


async function list(opts = {}){
    const {limit,offset,productId,status} = opts;
    const orders = await Order
                        .find({})
                        .sort({ _id: 1 })
                        .skip(offset)
                        .limit(limit)
    return orders;
}


// model method to get single order
async function get(_id){
   const order = await Order.findById({_id})
                                          .populate('products')
                                          .exec()
    return order;
}

module.exports = {
    create,
    list,
    get
}

