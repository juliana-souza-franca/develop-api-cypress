/// <reference types='Cypress' />


const { faker } = require('@faker-js/faker');
const { USER } = require('../fixtures/endpoint.json');



describe('User', () => {
  let token; 

  beforeEach(() => {
    cy.loginAdmin().then((tkn) => {
      token = tkn;
    });
  });

  it('Cadastro do usuário com sucesso', () => {
    cy.createUser({token: token}).then((user) => {
      cy.log('User ID:', user._id);
    });
  });


it('Consultar um usuário com id', () => {
  cy.createUser({token:token}).then((user) => { 
    const userId = user._id; 
    cy.log('User ID:', userId);
    cy.request({
      method: 'GET',
      url: `${Cypress.config('baseUrl')}${USER.ENDPOINT_USER}/${userId}`, 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}` 
      }
        }).then((getUserResponse) => {
          expect(getUserResponse.status).to.eq(200); 
          expect(getUserResponse.body).to.have.property('_id', userId); 
          expect(getUserResponse.body).to.have.property('fullName'); 
        });
      });
    });
  
  
    it('Atuzalizar um  usuário', () => {
      cy.loginAdmin().then((adminToken) => {
        cy.loginUser(adminToken).then((user) => {
          const userId = user.userId; 
          cy.log('User ID:', userId);
    
          const userToken = user.userToken;
          cy.log('User Token:', userToken);
    
          cy.log(`Admin Token: ${adminToken}`);
          cy.log(`User Token: ${userToken}`);
  
          const generar_name= faker.person.fullName();
          const generar_mail= faker.internet.email();
  
    
          cy.request({
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}${USER.ENDPOINT_USER}/${userId}`,
            body: {
              fullName: generar_name,
              mail: generar_mail
            },
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${userToken}` 
            },
            failOnStatusCode: false,
            timeout: 120000  
          }).then((response) => {
            cy.log(`Response Status: ${response.status}`);
            cy.log(`Response Body: ${JSON.stringify(response.body, null, 2)}`);
  
            expect(response.body, 'Response body não deve ser nulo ou indefinido').to.not.be.null;
            expect(response.body, 'Response body não deve ser indefinido').to.not.be.undefined;
            
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('msg', 'Dados atualizados com sucesso!');
  
            if (response.body.updatedUser) {
            expect(response.body.updatedUser).to.have.property('fullName', generar_name);
            expect(response.body.updatedUser).to.have.property('mail', generar_mail);
          } else {
            cy.log('A propriedade updatedUser não foi encontrada na resposta.');
          }
          });
        });
      });
    })

    it(' Deletar um  usuário', () => {
      cy.loginAdmin().then((adminToken) => {
        cy.loginUser(adminToken).then((user) => {
          const userId = user.userId; 
          cy.log('User ID:', userId);
    
          const userToken = user.userToken;
          cy.log('User Token:', userToken);
    
          cy.log(`Admin Token: ${adminToken}`);
          cy.log(`User Token: ${userToken}`);

    
          cy.request({
            method: 'DELETE',
            url: `${Cypress.config('baseUrl')}${USER.ENDPOINT_USER}/${userId}`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${adminToken}`
            },
            failOnStatusCode: false,
            timeout: 120000  
          }).then((response) => {
            cy.log(`Response Status: ${response.status}`);
          
           // expect(response.status).to.eq(200)
            expect(response.body).to.have.property('msg', 'Usuário deletado com sucesso!.');
  
          });
        });
      });
    })

 });
