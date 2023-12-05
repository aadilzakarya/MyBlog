//checks whether the /dashboard route is properly protected and only accessible to logged-in users.


import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.mjs'; 

const { expect } = chai;
chai.use(chaiHttp);

describe('Authentication and Redirection', () => {
  describe('Accessing /dashboard', () => {
    context('when not logged in', () => {
      it('should redirect to /login', (done) => {
        chai.request(app)
          .get('/dashboard')
          .end((err, res) => {
            expect(res).to.redirect;
           // expect(res).to.have.status(302); //  redirection status code is 302
            expect(res.redirects[0]).to.include('/login'); // Check if it redirects to login
            done();
          });
      });
    });

    context('when logged in', () => {

      let agent = chai.request.agent(app); 

      before((done) => {
        agent
          .post('/login') 
          .send({ username: 'lol', password: 'lol' }) //default username and password 
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should allow access to /dashboard', (done) => {
        agent
          .get('/dashboard')
          .end((err, res) => {
            expect(res).to.have.status(200); //  access to dashboard allowed 
           
            done();
          });
      });

      // logging out 
      after((done) => {
        agent.get('/logout').end(() => {
          agent.close();
          done();
        });
      });   
    });
  });
});
