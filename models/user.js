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
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: props => `${props.value} is not a valid email address!`
            },
        },
        password:
        {
            type: String,
            required: [true, 'Password is required']
        },
        mobile_number:
        {
            type: String,
            default: null
        },
        status:
        {
            type: Boolean,
            default: true
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