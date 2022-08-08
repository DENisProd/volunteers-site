const {Schema, model, ObjectId} = require("mongoose");

const Product = new Schema({
    name: {type: String, required: true, unique: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    img: {type: String},
    images: [{type: String}],
    createdDate: {type: Date, default: Date.now()},
    delivery: {type: String},
    contactUser: {type: ObjectId, ref: 'User', required: true},
    contactOrganization: {type: ObjectId, ref: 'Organization'},
    views: {type: Number, default: 0},
    buyCount: {type: Number, default: 0}
})

module.exports = model('Product', Product)