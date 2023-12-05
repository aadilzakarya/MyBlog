import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.mjs'; // Adjust the path according to your project structure

chai.use(chaiHttp);
const expect = chai.expect;

describe('User Flow - Blog Addition', () => {
    const agent = chai.request.agent(app);

    // Login test
    it('should log in a user', (done) => {
        agent
            .post('/login') // Replace with your actual login route
            .send({ username: 'testuser', password: 'password' }) // Replace with test credentials
            .end((err, res) => {
                expect(res).to.have.status(200); // Replace with your actual success status code
                done(err);
            });
    });

    // Access /add-blog test
    it('should access /add-blog when logged in', (done) => {
        agent
            .get('/add-blog')
            .end((err, res) => {
                expect(res).to.have.status(200);
              
                done(err);
            });
    });

    // Logout test
    it('should log out a user', (done) => {
        agent
            .get('/logout') // Replace with your actual logout route
            .end((err, res) => {
                expect(res).to.have.status(200); // Replace with your actual success status code
                // You may also check for redirection to the login page or another appropriate page
                done(err);
            });
    });

    // Close the agent after tests
    after(() => {
        agent.close();
    });
});
