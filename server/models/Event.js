const {Schema, model, ObjectId} = require("mongoose")

const Event = new Schema({
    img: {type: String, default: ''},
    title: {type: String, required: true},
    description: {type: String, required: true},
    location: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date },
    tags: [{type: String}],
    views: {type: Number, default: 0},
    likes: {type: Number, default: 0},
    difficulty: {type: String, default: 'Easy'},
    participateWays: {type: String, default: 'online'},
    created: {type: Date, default: Date.now()},
    presenseLink: {type: String, default: ''},
    author: {type: ObjectId, ref: 'Organization', required: true},
    subscribers: [{
        user: {type: ObjectId, ref: 'User'},
        presense: {type: Boolean, default: false},
        hours: {type: Number, default: 0}
    }],
    fullInfo: {
        company: {type: String, required: true},
        vacancySphere: {type: String, default: ''},
        workType: {type:String, default: ''},
        vacancyName: {type: String, default: ''},
        requirements: {type: String, default: ''},
        tasks: {type: String},
        deadlines: {type: String, default: 'в течение месяца'},
        age: {type: Number, default: 0},
        contactEmail: {type: String, default: ''},
        fullDescription: {type: String}
    },
    workInfo: {
        conditions: [{type: String, default: ''}],
        salary: {type: Number, default: 0},
        audience: {type: String}
    },
    helperInfo: {
        awards: {type: String, default: ''},
        coins: {type: Number, default: 0},
        services: [{type: String}],
    },
    isModerated: {type: Boolean, default: false}
})
//Event.index({'$**': 'text'});
module.exports = model('Event', Event)