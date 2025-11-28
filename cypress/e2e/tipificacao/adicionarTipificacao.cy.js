import { adicionarTipificacao, apagarTipificacao } from "../acoes/tipificacao/funcoes_crud";

describe("Salvar tipificação", () => {
    it("Deve adicionar uma nova tipificação e removê-la logo dopo", () => {
        cy.login("rafaelnargolo@outlook.com", "12345");

        cy.visit("http://localhost:3000/adm/tipificacoes")

        adicionarTipificacao("Teste Cypress tipificação 1")
        apagarTipificacao("Teste Cypress tipificação 1")
    });
});