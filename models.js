const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({ 
         	image : {type: Array},
         	class : String
     } 
);

const Photo = mongoose.model('Photo', photoSchema);


module.exports = {Photo};

