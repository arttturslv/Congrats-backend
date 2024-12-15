const mongoose = require('mongoose');

const {Schema} = mongoose;


const fileSchema = new Schema({
    id: {
        type: String,
        required: [true, 'id is required field!']
    },
    title: {
        type: String,
        required: false,
        trim: true
    },
    pictureDate: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: [true, 'description is required field!'],
        trim: true
    },
    file: {
        type: String,
        required: [true, 'file is required field!']
    }
});

const cardSchema = new Schema({
    easyId: {
        type: String,
        required: [true, 'id is required field!']
    },
    title: {
        type: String,
        required: [true, 'title is required field!'],
        trim: true
    },
    senderName: {
        type: String,
        required: [true, 'senderName is required field!'],
        trim: true
    },
    receiverName: {
        type: String,
        required: [true, 'receiverName is required field!'],
        trim: true
    },
    dateMet: {
        type: Date,
        required: false
    },
    pictures: {
        type: [fileSchema],
        required: [true, 'pictures (array) is required field!'],
    },
    passKey: {
        type: String,
    }
}, {timestamps:true})

const Card = mongoose.model("Card", cardSchema);

module.exports = {
    Card, 
    cardSchema,
}