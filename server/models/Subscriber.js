const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchma = mongoose.Schema({
    userTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    
}, { timestamps: true })

const Subscriber = mongoose.model('Subscriber', subscriberSchma);

module.exports = { Subscriber }