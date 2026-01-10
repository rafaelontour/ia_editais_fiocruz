import { adicionarFonte, apagarFonte } from "../acoes/fonte/funcoes_crud";

describe("Salvar fonte", () => {
    it("Deve adicionar uma nova fonte e removê-la logo após", () => {
        cy.login("rafaelnargolo@outlook.com", "12345");

        cy.visit("http://localhost:3000/adm/fontes")

        adicionarFonte("Teste Cypress fonte 1", "Teste Cypress descrição fonte 1")
        apagarFonte("Teste Cypress fonte 1")
    });
});
