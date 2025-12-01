import { adicionarTipificacao, atualizarTipificacao, apagarTipificacao } from "../acoes/tipificacao/funcoes_crud";

describe("Atualizar tipificação", () => {
    it("Deve atualizar uma tipificação", () => {
        cy.login("rafaelnargolo@outlook.com", "12345");

        cy.visit("http://localhost:3000/adm/tipificacoes")

        adicionarTipificacao("Teste Cypress tipificação 1")
        atualizarTipificacao("Teste Cypress tipificação 1", "Teste Cypress modificado")
        apagarTipificacao("Teste Cypress modificado")
    });
})