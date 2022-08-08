const {Schema, model, ObjectId} = require("mongoose");

const Order = new Schema({
    img: {type: String, default: ''},
    name: {type: String, required: true},
    shortDescription: {type: String, required: true},
    fullDescription: {type: String, required: true},
    author: {type: ObjectId, ref: 'Organization', required: true}, 
    cost: {type: Number, required: true},
    category: {type: String},
    tags: [{type: String}],
})

module.exports = model('Order', Order)