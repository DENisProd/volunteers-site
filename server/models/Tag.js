const {Schema, model, ObjectId} = require("mongoose")

const Tag = new Schema({
    name: {type: String, required:true},
    useCount: {type: Number, default: 0}
})

module.exports = model('Tag', Tag)