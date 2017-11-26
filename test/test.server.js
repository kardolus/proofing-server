 const chai = require('chai');
 const chaiHttp = require('chai-http');

 const {app, runServer, stopServer } = require('../server');

 const should = chai.should();
 chai.use(chaiHttp);

 describe('API', function() {

   it('should 401 on GET requests without bearer token', function() {
     return chai.request(app)
       .get('/photos/test')
       .then(function(res) {
         res.should.have.status(401);
         res.body.should.eql('Unauthorized');
         done();
       });
   });
 });

