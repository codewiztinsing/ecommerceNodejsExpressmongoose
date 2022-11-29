var mongoose = require('mongoose')

var username = encodeURIComponent("Tinsae");
var password = encodeURIComponent("TESIha1817!?");

var connectionString = `mongodb://${username}:${password}@cluster0.9uip3.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(connectionString
    // { useNewUrlParser: true, useCreateIndex: true }
)
module.exports = mongoose
