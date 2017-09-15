const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({ 
         	image : [],
         	class : ''
     } 
);

const Photo = mongoose.model('Photo', photoSchema);


module.exports = {Photo};

