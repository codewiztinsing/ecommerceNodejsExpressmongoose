var db = require('../db')
var cuid = require('cuid')
var bcrypt = require('bcrypt')
const { isEmail, isAlphanumeric } = require('validator')



const SALT_ROUNDS = 10

const User = db.model('User',{
    _id      :{type:String,default:cuid},
    username : usernameSchema(),
    password : {type:String,maxLength:120},
    email    : emailSchema({required:true})
})

function usernameSchema() {
    return {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        minLength:3,
        maxLength:16,
        validate:[
            {
                validator:isAlphanumeric,
                message:props => `${props.value} contains special character`

            },
            {
                validator:str => !str.match(/^admin$/i),
                message:props => 'invalid name'
            },
            {
              validator:function(username) {return isUnique(this,username)},
                message:props => 'Username is taken'
            }
        ]
    }


}



function emailSchema (opts = {}) {
    const { required } = opts
    return {
    type: String,
    required: !!required,
    validate: {
    validator: isEmail,
    message: props => `${props.value} is not a valid email address`
    }
    }
    }

async function isUnique(doc,username) {
    const existing = await get(username)
    return !existing || doc._id === existing._id
}


async function list(opts = {}) {
    const { limit = 3, offset = 1, tag } = opts;
    const query = tag ? { tags: tag } : {}
    const users = await User
        .find(query)
        .sort({ _id: 1 })
        .skip(offset)
        .limit(limit)

    return users;

}


async function get(username) {
    var user = await User.findOne({username})
    return user;
}



async function remove(_id) {
  
    const user = await User.deleteOne({ _id })
    return {}

}

async function create(fields) {
    const user = new User(fields)
    await hashPassword(user)
    await user.save()
    return user;
}


async function edit(username,change) {
    const user = await get(username)
    Object.keys(change).forEach(key => {
        user[key] = change[key]
       
    })
    if(change.password) hashPassword(user);
    await user.save()
    return user
}


async function hashPassword(user){
    if(!user.password) throw user.invalidate('password','password is required')
    if(user.password.length < 12) throw user.invalidate('password','password must be at least 12 characters')
    user.password = await bcrypt.hash(user.password,SALT_ROUNDS)
}


module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    model: User
    }