const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser')

const {PORT, DATABASE_URL, CLOUDINARY_URL, CLIENT_ORIGIN} = require('./config');

let cloudinary = require('cloudinary');

mongoose.Promise = global.Promise;

const {Photo} = require('./models.js');

app.use(bodyParser.json())


app.use(cors({
    origin: CLIENT_ORIGIN
}))

app.get('/', (req, res) =>{
	Photo
		.find()
		.exec()
		.then(photos => {
			res.status(200).json(photos)
		})
		.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'Internal Server Error'});
		});
});

app.post('/', function(req, res, next) {
  console.log("The Req"+ JSON.stringify(req.body));
			Photo
			.create({
				image :[req.body.uploaded]
				})
			.then(
				photo => res.status(201).json(photo))
			.catch(err => {
				console.error(err);
  				res.status(500).json({message: err});
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
