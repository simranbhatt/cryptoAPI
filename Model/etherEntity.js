const mongoose = require('mongoose')

const etherEntity = new mongoose.Schema({
    valueInINR: {
        type: Number,
        required:true
    }
})

module.exports = {Ether : mongoose.model('Ether', etherEntity)};