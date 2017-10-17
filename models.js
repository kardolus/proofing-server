const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({ 
         	image : {type: Array},
         	approved : {type: Boolean, default: false}
     } 
);

const Photo = mongoose.model('Photo', photoSchema);


module.exports = {Photo};

