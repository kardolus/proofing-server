require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const morgan = require('morgan');
const passport = require('passport');


const {router: usersRouter} = require('./users');
const {router: authRouter, basicStrategy, jwtStrategy} = require('./auth');

const {PORT, DATABASE_URL, CLOUDINARY_URL, CLIENT_ORIGIN} = require('./config');

let cloudinary = require('cloudinary');

mongoose.Promise = global.Promise;

const {Photo} = require('./models.js');

app.use(bodyParser.json())
app.use(morgan('common'));

app.use(cors({
    origin: CLIENT_ORIGIN
}))

app.get('/photos/:username', passport.authenticate('jwt', {session:false}), (req, res) =>{
  Photo
    .find({userName : req.params.username})
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


app.post('/photos/:username', passport.authenticate('jwt', {session:false}), (req, res) => {
    let userName = req.params.username;
    Photo
      .create({
          image :[req.body.uploaded],
          approved : false,
          userName : [req.body.uploaded.userName.username]
          })
      .then((photo) => {
    Photo.find({userName : userName})
      .exec()
      .then(photos => {
        res.status(200).json(photos)
      })
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: err});
    });
});


app.put('/images/:id/approve', function (req, res){
	Photo
		.findByIdAndUpdate(req.params.id, {approved: true})
		.then(photo => {
			res.status(200).json(photo)
		})
		.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'Internal Server Error'});
		});
});

app.put('/images/:id/disprove', function (req, res){
	Photo
		.findByIdAndUpdate(req.params.id, {approved: false})
		.then(photo => {
			res.status(200).json(photo)
		})
		.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'Internal Server Error'});
		});
});

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use('/users/', usersRouter);
app.use('/auth/', authRouter);


app.use('*', (req, res) => {
  return res.status(404).json({message: 'Not Found'});
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
