# Projeto de automação Web com Cypress- nivel básico
- Vamos escrever os primeiros casos de teste
- Utilizamos uma ferramenta poderosa com o recurso que facilita o acesso end-to-end
Aplicativo API

## Pré-requisto para utilizar o projeto

### Sistema Operacional
- MacOs versão 10.9 ou superior com 64 bit -Linux Ubuntu versão 20.04 ou superior com 64 bits -Fodera Linux versão 21 com 64 bits -Linux Debian versão 8 com 64 bits -Windows versão 10 ou superior com 64 bits

### Hardware
- Minimo 2 CPUS para rodar o cypress
- Um CPU adicional para gravação de video
- Um CPU adicional para processo de execução fora do cypress: - Servido de aplicativos de Front-End - Servidor de aplicativos de Back-End
- Aplicativos de Banco de Dados -Qualquer Infraestrutura adicional, como por exemplo: - Redis (é um cache e banco de dados como serviço totalmente gerenciados para casos de uso em tempo real e permite que os usuários armazenem chaves que fazem o mapeamento para vários tipos de dados) - Kafka (é uma plataforma de fluxo de dados open source e distribuída que pode publicar, subscrever, armazenar e processar fluxos de registros em tempo real, podem ser distribuídos em ambientes locais e em nuvens públicas, privadas ou públicas, além de utilizar sistemas operacionais diferentes.)

### Armazenamento
- Memória de 4 GB ou superior para execução de teste

### Gerenciador de Dependencia
- Node.js versão 18 ou superior


### Linguagem de programação
- Javascript

## Ferramenta IDE
- Vscode
- Intellij
- Qualquer uma outra da sua preferencia


## Links para instalação
- Node.js: https://nodejs.org/en/download
- Vscode: https://code.visualstudio.com/download
- Links para acessar a Documentação do Cypress
- cypress.io: https://docs.cypress.io/api/commands/document https://docs.cypress.io/examples/recipes https://docs.cypress.io/guides/overview/why-cypress


# Configuração do ambiente
Para iniciarmos o projeto com framework cypress é necessario utlizar:

## IDE Vscode
- Ferramenta Only para executar bloco de código especifico que fica na Extesão da IDE Vscode
- Ferramenta Es6 Mocha Snippets que fica na Extesão da IDE Vscode
- Ferramenta Cypress Snippets que fica na Extesão da IDE Vscode

## Instalação inicial
- É necessario ter IDE, gerenciador de dependencia e o framework cypress, dica:

- Faça download nodejs com a versão compativel do seu sistema operacional
- Faça download Vscode com a versão compativel do seu sistema operacional
- Instala o framework cypress

## Comando para instalar Framework Cypress
- Para instalar o cypress é necessario ter instalado no node.js. npm install cypress --save-dev

## Comando para instalar a biblioteca faker-js
 - Para instalar o cypress é necessario ter instalado no node.js. npm install @faker-js/faker --save-dev

## Configuração do cypress
Acessa o package.json e utliza o comando: { "devDependencies": { "cypress": "^13.6.2" }, "scripts": { "cypress:open": "cypress open", "cypress:run": "cypress run" } }

# Comando para executar o cypress
São duas maneira para executar o cypress:

- npx cypress open
- npm run cypress:open
- npm run cypress:run (handler)

# Estruturar o projeto

## Configuração para video e screenshot

- Para realizar video é necessario acessar o arquivo cypress.config.js e colocar o comando: video: true, videoCompression: false, videosFolder: 'cypress/videos'

- Para realizar screenshot é necessario acessar o arquivo cypress.config.js e colocar o comando: screenshotOnRunFailure: true, screenshotsFolder: 'cypress/screenshots' E na pasta e2e no arquivo nome_do_arquivo.cy.js você chamar ele, por exemplo: afterEach(() => { cy.screenshot(); })


## Gerar relatório 
link: https://docs.cypress.io/guides/tooling/reporters

# Gerar relatorio allure
## Passo 1: Instale as Dependências
 No terminal, instale o plugin Allure e o allure-commandline:

- npm install --save-dev @shelex/cypress-allure-plugin allure-commandline 
                ou
- npm install --save-dev @shelex/cypress-allure-plugin

- npm install --save-dev allure-commandline

## Passo 2: Configure o Allure no cypress.config.js
- Edite o cypress.config.js para integrar o plugin Allure:

const { defineConfig } = require("cypress");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://develop.qacoders.dev.br/', 

    setupNodeEvents(on, config) {
      allureWriter(on, config); // Integra o Allure com o Cypress
      return config;
    },
  },
});

## Passo 3: Importe o Plugin Allure no Arquivo cypress/support/e2e.js
No arquivo cypress/support/e2e.js, adicione a linha abaixo para carregar o plugin Allure:
import '@shelex/cypress-allure-plugin';

## Passo 4: Adicione Scripts no package.json
Para facilitar a geração e visualização dos relatórios Allure, adicione os seguintes scripts no package.json:

{
  "devDependencies": {
    "@faker-js/faker": "^9.0.1",
    "@shelex/cypress-allure-plugin": "^2.40.2",
    "allure-commandline": "^2.31.0",
    "cypress": "^13.14.2"
  },
  "scripts": {
    "cypress:run": "cypress run",
    "allure:generate": "allure generate allure-results --clean -o allure-report",
    "allure:open": "allure open allure-report"
  }
}

## Passo 5: Execute e Gere o Relatório
- Para rodar os testes, execute: npm run cypress:run
- Após a execução dos testes, gere o relatório Allure: npm run allure:generate
- Se precisar ver o relatório localmente, abra com: npm run allure:open


# Boas praticas
Sempre quando for iniciar o projeto de automação pelo Cypress não deixa de colocar a referencia do tipo cypress: //<reference types='Cypress'