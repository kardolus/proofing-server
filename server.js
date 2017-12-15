require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const morgan = require('morgan');
const passport = require('passport');
const uuidv4 = require('uuid/v4');


const {router: usersRouter} = require('./users');
const {router: authRouter, basicStrategy, jwtStrategy} = require('./auth');

const {PORT, DATABASE_URL, CLOUDINARY_URL, CLIENT_ORIGIN} = require('./config');

let cloudinary = require('cloudinary');

mongoose.Promise = global.Promise;

const {Album, Photo} = require('./models.js');

app.use(bodyParser.json())
app.use(morgan('common'));

app.use(cors({
    origin: CLIENT_ORIGIN
}))

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use('/users/', usersRouter);
app.use('/auth/', authRouter);


//Photos

app.get('/photos/:username', passport.authenticate('jwt', {session:false}), (req, res) => {
  let user = req.params.username;
  Photo
    .find({userName : user})
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
    let user = req.params.username;
    Photo
      .create({
          image :[req.body.uploaded],
          approved : false,
          userName : [req.body.uploaded.userName.username]
          })
      .then((photo) => {
    Photo.find({userName : user})
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

app.get('/photos/sort/:username', passport.authenticate('jwt', {session:false}), (req, res) => {
  let user = req.params.username;
  Photo
    .find({userName : user})
    .sort({approved: +1})
    .then(photos => {
      res.status(200).json(photos)
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
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

app.delete('/images/remove/:username', passport.authenticate('jwt', {session:false}), (req, res) => {
  let user = req.params.username;
  Photo
    .deleteMany({approved : true})
    .exec()
    .find({userName : user})
    .exec()
    .then(photos => {
      res.status(200).json(photos)
    })
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//Albums

app.post('/albums/:title/:username', passport.authenticate('jwt', {session:false}), (req, res) => {
    let user = req.params.username;
    let title = req.params.title;
    let newImages = req.body.images;
    Album
      .create({
          owner : user,
          albumTitle : title,
          albumArray : newImages,
          albumId: uuidv4(),
          guests: 'nick'
          })
      .then((album) => {
    Album.find({userName : user})
      .exec()
      .then(album => {
        res.status(200).json(album)
      })
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: err});
    });
});

app.get('/albums/:username', passport.authenticate('jwt', {session:false}), (req, res) => {
    let user = req.params.username;
    Album
      .find({owner: user})
      .exec()
      .then(albums => {
        res.status(200).json(albums)
      })
    .catch(err => {
        console.error(err);
        res.status(500).json({message: err});
  });
})

app.put('/albums/:username/:albumId', passport.authenticate('jwt', {session:false}), (req, res) => {
  let guestEmail = req.body.guestEmail;
  let _id = req.params.albumId;
  console.log(guestEmail);
  Album
    .findByIdAndUpdate( _id, {$push:{guests: guestEmail}})
    .then(album => {
      res.status(200).json(album)
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
