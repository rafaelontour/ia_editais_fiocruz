export function adicionarFonte(nome: string, descricao: string) {
    return cy.contains("Adicionar fonte").click()
        .get('[data-cy="input-nome-fonte"]').type(nome)
        .get('[data-cy="input-descricao-fonte"]').type(descricao)
        .get('[data-cy="botao-salvar-fonte"]').click()
        .get('[data-cy="item-fonte"]')
        .should("contain", nome);
}

export function atualizarFonte(
    nomeAntigo: string,
    nomeNovo: string,
    descricao: string
) {
    cy.contains('[data-cy="item-fonte"]', nomeAntigo)
        .find('button[title="Editar fonte"]')
        .click()
    
    cy.get('[data-cy="input-nome-fonte"]').clear().type(nomeNovo)
    cy.get('[data-cy="input-descricao-fonte"]').clear().type(descricao)


    cy.get('[data-cy="botao-salvar-fonte"]').click()

    cy.contains('[data-cy="item-fonte"]', nomeNovo, { timeout: 10000 })
        .should("contain", nomeNovo)
    
    cy.contains('[data-cy="item-fonte"]', nomeNovo, { timeout: 10000 })
    .should("contain", descricao);
}

export function apagarFonte(nome: string)  {
    cy.contains('[data-cy="item-fonte"]', nome)     // IMPORTANTE: Todos tem o botão genérico de excluir, então procurar pelo nome
        .find('[data-cy="componente-excluir"]')
        .click()

    cy.contains("button","Excluir")
        .click()

    cy.contains('[data-cy="item-fonte"]', nome)
        .should("not.exist");
}