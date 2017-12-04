const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({ 
         	image : {type: Array},
         	approved : {type: Boolean, default: false},
         	userName : {type: String}
     } 
);

const Photo = mongoose.model('Photo', photoSchema);

const albumSchema = mongoose.Schema({ 
         	album: {type: Array}
     } 
);

const Album = mongoose.model('Album', albumSchema);

module.exports = {Album, Photo};

