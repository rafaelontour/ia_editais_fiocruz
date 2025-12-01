import { adicionarTaxonomia } from "../acoes/taxonomia/funcoes_crud";
import { adicionarTipificacao } from "../acoes/tipificacao/funcoes_crud";

describe("Salvar taxonomia", () => {
    it("Deve adicionar uma nova taxonomia e removê-la logo dopo", () => {
        cy.login("rafaelnargolo@outlook.com", "12345");

        cy.visit("http://localhost:3000/adm/tipificacoes")
        adicionarTipificacao("Teste Cypress tip pra taxonomia")

        adicionarTaxonomia("Teste Cypress tip pra taxonomia", "Teste Cypress taxteste", "Teste Cypress taxteste descricao")

        cy.get('[data-cy="item-taxonomia"]').contains("Teste Cypress taxteste")
          .should("exist")
        
        cy.get('[data-cy="item-taxonomia"]').contains("Teste Cypress taxteste descricao")
          .should("exist")
    })
})