/// <reference types='Cypress' />

const DADOS = require('../fixtures/data.json');

describe('Login', () => {
  it('Acesso login admin', () => {
    cy.fixture('endpoint').then((data) => {
      const endpoint = data.ADMIN.ENDPOINT_ADMIN;

      cy.request({
        method: 'POST', 
        url: `${Cypress.config('baseUrl')}${endpoint}`,
        body: {
          mail: DADOS.EMAIL_ADMIN,
          password: DADOS.SENHA_ADMIN
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.eq(200); 
        expect(response.body.msg).to.eq('Olá Qa-Coders-SYSADMIN, autenticação autorizada com sucesso!');
        console.log(response.body.msg);
        expect(response.body.user.mail).to.eq(DADOS.EMAIL_ADMIN);
        expect(response.body).to.have.property('token'); 
      });
    });
  });
});
