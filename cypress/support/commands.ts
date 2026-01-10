/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
    interface Chainable {
        login(email: string, senha: string): Chainable<Cookie | null>;
    }
}

Cypress.Commands.add("login", (email: string, senha: string) => {
  // 1) Intercepta a chamada de login para esperar a resposta
  cy.intercept("POST", "/auth/sign-in").as("signIn");

  // 2) Abre a página e preenche
  cy.visit("http://localhost:3000/auth/login");
  cy.get("#email").clear().type(email);
  cy.get("#senha").clear().type(senha);

  // 3) Clica para submeter o form
  cy.get("#login").click();

  // 4) Espera a resposta da API de login (garante que backend respondeu e setou cookie)
  cy.wait("@signIn");

  cy.url().should("include", "/adm");

  // 5) Espera explicitamente o cookie HttpOnly aparecer (até 10s)
  // Retornamos o Chainable para que chamadores esperem pelo fim do comando.
  return cy.getCookie("access_token").should("exist");
});