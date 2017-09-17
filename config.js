exports.DATABASE_URL = process.env.DATABASE_URL ||
						global.DATABASE_URL ||
						'mongodb://localhost/proofing-db';

exports.TESTDATABASE_URL = process.env.TestDatabase_URL ||
							'mongodb://localhost/proofing-db';

exports.PORT = process.env.PORT || 8080;

exports.CLOUDINARY_URL = 'cloudinary://821318977471469:dW9zgguPfWSrOwP8mQ2AyCMYu30@proofer'

exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';


