export function adicionarTaxonomia(nomeTip: string, nomeTax: string, descricaoTax: string) {
    // Acessa essa tipificação
    cy.contains('[data-cy="item-nome-tip"]', nomeTip)
        .parent()
        .within(() => {
            cy.get('button[title="Taxonomias desta tipificação"]').click()
        })

    cy.wait(1000)
    
    // Adiciona uma nova taxonomia pra essa tipificação
    cy.contains("Adicionar taxonomia").click();

    cy.get('[data-cy="input-nome-taxonomia"').type(nomeTax);
    cy.get('[data-cy="input-descricao-taxonomia"]').type(descricaoTax);
    cy.get('[data-cy="trigger-fontes-tax"]').click()
    cy.get('[data-cy="item-fonte-tax"]').contains("FONTE 1 TESTE").click()

    cy.contains("Salvar").click();
}

export function atualizarTaxonomia() {

}

export function apagarTaxonomia() {

}