const mongoose = require('mongoose')

let productSchema = new mongoose.Schema({
    // _id:mongoose.Schema.Types.ObjectId
    _id: mongoose.Types.ObjectId,
    name: String,
    price: Number,
}, {
    versionKey: false // You should be aware of the outcome after set to false
})

//Collection name will be the word "Post" plural
module.exports = mongoose.model('Product', productSchema)
