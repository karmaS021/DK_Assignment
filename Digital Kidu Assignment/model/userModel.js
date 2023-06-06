const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true

    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: {
        type: String
    },
    resetToken: {
        type: String
    },

    resetTokenExpiration: {
        type: Date
    },
 
});
const User = mongoose.model('User', userSchema);

module.exports = User;