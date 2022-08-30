const mongoose = require('mongoose')

const userEntity = new mongoose.Schema({
    address: {
        type: String,
        required:true
    },
    transactionData: { type: Array }
})

exports.userEntity = mongoose.model('User', userEntity);