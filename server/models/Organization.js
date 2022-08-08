const {Schema, model, ObjectId} = require("mongoose");

const Organization = new Schema({
    name: {type: String, required: true, unique: true},
    location: {type: String},
    description: {type: String, required: true},
    email: {type: String, required:true},
    isEmailConfirmed: {type: Boolean, default: false},
    img: {type: String},
    phoneNumber: {type: String, default: ''},
    telegram: {type:String},
    isTelegramConfirmed: {type: Boolean, default: false},
    level: {type: Number, default: 0},
    registeredDate: {type: Date, default: Date.now()},
    createdEvents: [{type: ObjectId, ref:'Event'}],
    ambition: {type: String},
    contactUser: {type: ObjectId, ref: 'User', required: true}, 
})

module.exports = model('Organization', Organization)