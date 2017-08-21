const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
         img: {name: 'string'}
     } 
);

const Photo = mongoose.model('Photo', photoSchema);

module.exports = {Photo};