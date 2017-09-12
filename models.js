const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({ 
         	image : [],
         	status: ''
     } 
);

const Photo = mongoose.model('Photo', photoSchema);


module.exports = {Photo};

