const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({ 
         	image : {type: Array},
         	approved : {type: Boolean, default: false},
         	userName : {type: String},
         	guestApproved: {type: Array}
     } 
);

const Photo = mongoose.model('Photo', photoSchema);

const albumSchema = mongoose.Schema({ 
			owner : {type: String},
			albumTitle : {type: String, default: "A photo Album"},
         	albumArray : {type: Array},
         	albumId : {type: String},
         	guests: {type: Array, 'default': []}
     } 
);

const Album = mongoose.model('Album', albumSchema);

module.exports = {Album, Photo};

