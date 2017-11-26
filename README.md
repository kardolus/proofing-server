# Proofing Server  [![Build Status](https://api.travis-ci.org/NickFoden/proofing-server.svg?branch=master)](https://travis-ci.org/NickFoden/proofing-server)



Original tests have been scrapped after adding jwt auth to routes. New tests are needed. 

Build is likely passing. Will require Config file like below with cloudinary url and your JWT Secret


config.js 


		exports.DATABASE_URL = process.env.DATABASE_URL ||
								global.DATABASE_URL ||
								'mongodb://localhost/proofing-db';

		exports.TESTDATABASE_URL = process.env.TestDatabase_URL ||
									'mongodb://localhost/proofing-db';

		exports.PORT = process.env.PORT || 8080;

		exports.CLOUDINARY_URL = ' '

		exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';


		exports.JWT_SECRET = ' '
		exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'; 