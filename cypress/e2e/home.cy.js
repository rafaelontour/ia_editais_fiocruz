describe("Página inicial", () => {
  it("abre a home", () => {
    cy.visit("http://localhost:3000");

    // valida se o body foi carregado
    cy.get("body").should("exist");
  });
});
