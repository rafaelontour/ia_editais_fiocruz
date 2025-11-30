export function adicionarTaxonomia(nome: string, descricao: string) {
    // Acessa essa tipificação
    cy.get('[data-cy="item-tipificacao"]')
        .contains("Teste Cypress tip pra taxonomia")
        .parents('[data-cy="item-tipificacao"]')
        .within(() => {
        cy.get('button[title="Taxonomias desta tipificação"]').click()
        })
    
    // Adiciona uma nova taxonomia pra essa tipificação
    cy.contains("Adicionar taxonomia").click();

    cy.get('[data-cy="input-nome-taxonomia"').type(nome);
    cy.get('[data-cy="input-descricao-taxonomia"]').type(descricao);
    cy.get('[data-cy="trigger-fontes-tax"]').click()
    cy.get('[data-cy="item-fonte-tax"]').contains("FONTE 1 TESTE").click()

    cy.contains("Salvar").click();
}

export function atualizarTaxonomia() {

}

export function apagarTaxonomia() {

}