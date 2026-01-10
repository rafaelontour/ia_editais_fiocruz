import { adicionarFonte, atualizarFonte, apagarFonte } from "../acoes/fonte/funcoes_crud";

describe("Atualizar fonte", () => {
    it("Deve criar uma fonte só para atualizar o nome e descrição, depois apagar", () => {
        cy.login("rafaelnargolo@outlook.com", "12345");

        cy.visit("http://localhost:3000/adm/fontes")

        adicionarFonte("Teste Cypress fonte 1", "Descrição Cypress fonte 1")
        atualizarFonte("Teste Cypress fonte 1", "Nome da fonte atualizada", "Descricao da fonte atualizada")
        apagarFonte("Nome da fonte atualizada")
    })
})