describe("Salvar fonte", () => {
    it("Deve adicionar uma nova fonte e removê-la logo após", () => {
        cy.login("rafaelnargolo@outlook.com", "12345");

        cy.visit("http://localhost:3000/adm/fontes");

        cy.contains("Adicionar fonte").click();

        cy.get('[data-cy="input-nome-fonte"]').type("Teste Cypress fonte 1");
        cy.get('[data-cy="input-descricao-fonte"]').type("Teste Cypress fonte 1");

        cy.contains("Salvar").click();

        // Verifica se voltou e se o item realmente foi criado
        cy.contains("Teste Cypress fonte 1", { timeout: 10000 }).should("exist");

        // 1️⃣ Clica no trigger para abrir o modal
        cy.contains("Teste Cypress fonte 1")
        .closest('[data-cy="item-fonte"]')
        .find('button[title^="Excluir"]')
        .click();

        // 2️⃣ Agora busca o botão dentro do modal globalmente
        cy.get('[data-cy="botao-excluir-fonte"]', { timeout: 5000 })
        .should("be.visible")
        .click();

        // Verifica se voltou e se o item realmente foi excluido
        cy.contains("Teste Cypress fonte 1", { timeout: 10000 }).should("not.exist");
    })
})