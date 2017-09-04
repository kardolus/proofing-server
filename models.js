const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({ 
         	"public_id": {type: String},
     		"secure_url": {type: String},
     		"New": {type: Boolean},
     		"Approved": {type: Boolean}
     } 
);

const Photo = mongoose.model('Photo', photoSchema);


module.exports = {Photo};
