const {Schema, model, ObjectId} = require("mongoose")

const EventParams = new Schema({
    deadlines: [{type: String}],
    difficulty: [{type: String}],
    participateWays: [{type: String}]
})

module.exports = model('EventParams', EventParams)