const express = require('express');
const app = express();
const mongoose = require('mongoose');

const {PORT, DATABASE_URL} = require('./config.js');

const cloudinary = require('cloudinary');

mongoose.Promise = global.Promise;
const {Photo} = require('./models.js');



app.get('/', (req, res) =>{
	Photo
		.find()
		.exec()
		.then(photo => {
			res.status(200).json(photo)
		})
		.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'Internal Server Error'});
			});
});





let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT){
	return new Promise((resolve, reject) => {
    	mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
	      	})
	      	.on('error', err => {
	        	mongoose.disconnect();
	        	reject(err);
      		});
    	});
  	});
}

function stopServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, stopServer};