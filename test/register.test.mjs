// Import the necessary modules
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.mjs'; // Adjust the path according to your project structure

// Use chaiHttp for HTTP requests
chai.use(chaiHttp);
const expect = chai.expect;

describe('User Registration', () => {
    // Test for successful registration
    it('should register a new user', (done) => {
        chai.request(app)
            .post('/register')
            .send({ username: 'newuser', password: 'password123', confirmPassword: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
        
                done();
            });
    });

    

});

