export function adicionarTipificacao(nome: string) {
    cy.get('[data-cy="item-tipificacao"]').should("not.contain", nome)

    cy.contains("Adicionar tipificação").click();
    
    cy.get('[data-cy="input-nome-tipificacao"]').type(nome);

    cy.get('[data-cy="trigger-fontes-tip"]').click()
    
    cy.get('[data-cy="item-fonte"]').contains("FONTE 1 TESTE").click()

    cy.contains("Salvar").click();

    cy.contains('[data-cy="item-nome-tip"]', nome)
        .find("h2").should("exist")
        
}

export function atualizarTipificacao(nomeAntigo: string, nomeNovo: string) {
    cy.contains('[data-cy="item-nome-tip"]', nomeAntigo)
        .parent()
        .within(() => {
            cy.get('button[title="Editar tipificação"]').click()
        })

    cy.get('[data-cy="input-nome-tipificacao"]').clear().type(nomeNovo)

    cy.get('[data-cy="fonte-selecionada"]').should("contain", "FONTE 1 TESTE")
      .find('div[title="Remover fonte"]')
      .click()

    cy.contains("Salvar").click();

    cy.contains('[data-cy="item-nome-tip"]', nomeNovo).should("exist");

}

export function apagarTipificacao(nome: string) {
    cy.contains('[data-cy="item-nome-tip"]', nome)
        .parent()
        .within(() => {
            cy.get('[data-cy="componente-excluir"]').click()
        })
    
    cy.contains("button","Excluir")
        .click()

    cy.contains('[data-cy="item-tipificacao"]', nome)
        .should("not.exist");
}