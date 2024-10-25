/// <reference types='Cypress' />

// cypress/support/commands.js

const { faker } = require('@faker-js/faker');
const { USER } = require('../fixtures/endpoint.json');
const { DATA} = require('../fixtures/data.json')

const generateCPF = () => {
    let cpf = '';
    for (let i = 0; i < 9; i++) {
      cpf += Math.floor(Math.random() * 10);
    }
    cpf += calculateCPFCheckDigits(cpf);
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); // Formata o CPF
  };
  
  const calculateCPFCheckDigits = (base) => {
    const getCheckDigit = (base, multiplier) => {
      let sum = 0;
      for (let i = 0; i < multiplier; i++) {
        sum += base[i] * (multiplier + 1 - i);
      }
      const remainder = (sum * 10) % 11;
      return remainder >= 10 ? 0 : remainder;
    };
    const firstCheckDigit = getCheckDigit(base, 9);
    const secondCheckDigit = getCheckDigit(base + firstCheckDigit, 10);
    return `${firstCheckDigit}${secondCheckDigit}`;
  };
  
  // Adiciona a função ao Cypress como um comando
  Cypress.Commands.add('generateCPF', generateCPF);

//Para chamar o token do admin
Cypress.Commands.add('loginAdmin', () => {
  cy.log('Fazendo requisição de login para admin');
  return cy.request({
    method: 'POST',
    url: `${Cypress.config('baseUrl')}/api/login/`,
    body: {
      mail: 'sysadmin@qacoders.com',
      password: '1234@Test'
    },
    timeout: 60000
  }).then((response) => {
    cy.log(`Status: ${response.status}`);
    const token = response.body.token;
    return cy.wrap(token);
  });
});


// Para ajusta os inicias do fullname

Cypress.Commands.add('ajuste_fullname', () => {
  let fullName = faker.person.fullName();

  // Remove caracteres especiais do nome gerado
  fullName = fullName.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos
  fullName = fullName.replace(/[^a-zA-Z\s]/g, ''); // Remove caracteres que não sejam letras ou espaços

  // Formata o nome para ter as iniciais em maiúscula
  fullName = fullName.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');

  return fullName;
});


Cypress.Commands.add('loginUser', (token) => {
  const mail = faker.internet.email();
  const password = '1234@Test';

  // Cria um novo usuário e então faz o login
  return cy.createUser({ token: token, email: mail }).then((createdUser) => {
    cy.log(`Usuário criado: ${createdUser._id}`);

    return cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/api/login/`,
      body: {
        mail: mail,
        password: password
      }
    }).then((response) => {
      const userToken = response.body.token;  // Token de login do usuário
      const userId = createdUser._id;  // ID do usuário criado
      return cy.wrap({ userToken, userId });
    })
  });
});

// Criar usuário
Cypress.Commands.add('createUser', ({token, email=faker.internet.email()}) => {
  return cy.generateCPF().then((cpf) => { 
    const cpfSemFormatacao = cpf.replace(/\D/g, '');
    return cy.ajuste_fullname().then((fullName) => {
      return cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}${USER.ENDPOINT_USER}`, 
        body: {
          fullName: fullName,  
          mail: email,
          accessProfile: "ADMIN",
          cpf: cpfSemFormatacao, 
          password: "1234@Test",
          confirmPassword: "1234@Test"
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('msg', `Olá ${fullName}, cadastro realizado com sucesso.`);
        return response.body.user; 
      });
    });
  });
});