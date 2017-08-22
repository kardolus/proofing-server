const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({ 
         	"public_id": {type: String},
     		"url": {type: String},
     		"Approved": {type: String}
     } 
);

const Photo = mongoose.model('Photo', photoSchema);


module.exports = {Photo};