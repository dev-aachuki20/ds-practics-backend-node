const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema(
    {
        first_name:
        {
            type: String,
            default: null,
            trim: true
        },
        last_name:
        {
            type: String,
            default: null,
            trim: true
        },
        email:
        {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        password:
        {
            type: String,
            required: true,
        },
        mobile_number:
        {
            type: String,
            default: null
        },
        status:
        {
            type: Number,
            enum: [0, 1],
            default: 1
        },
        role: {
            type: Number,
            enum: [1, 2],
            default: 2, // 1 = Admin, 2 = User
        },
        image:
        {
            type: String,
            default: null
        },
        token:
        {
            type: String,
            default: null
        },
        resetToken:
        {
            type: String,
            default: null
        },
        resetTokenExpiration:
        {
            type: Date,
            default: null
        },
    }, {
    timestamps: true
});

// create a model.
const User = mongoose.model('User', userSchema);
module.exports = User;