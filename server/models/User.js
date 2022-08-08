const {Schema, model, ObjectId} = require("mongoose");

const User = new Schema({
    email: {type: String, required:true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    registeredDate: {type: Date, default: Date.now()},
    avatar: {type: String},
    birthday: {type: Date},
    hours: {type: Number, default: 0},
    coins: {type: Number, default: 0},
    level: {type: Number, default: 0},
    takePart: {type: Number, default: 0}, // Участвовал в мероприятиях (кол-во)
    events: [{type: ObjectId, ref:'Event'}],
    phoneNumber: {type: Number, default: 0},
    telegram: {type:String},
    location: {type: String, default: 'неизвестно'},
    favoriteTags: [{
        tag: {type: ObjectId, ref: 'Tag'}, 
        useCount: {type: Number, default: 0}
    }],
    createdEvents: [{type: ObjectId, ref:'Event'}],
    reviews: [
        {
            author: {type: ObjectId, ref:'Organization'},
            reputation: {type: Number, default: 5, min: 0, max:5},
            text: {type: String}
        }
    ],
    buyedItems: [{type: ObjectId, ref: 'Product'}]
})

module.exports = model('User', User)