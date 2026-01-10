describe("Login Real + Requisições Autenticadas", () => {

  it("Deve logar e acessar rotas protegidas usando token HttpOnly", () => {

    cy.login("rafaelnargolo@outlook.com", "12345");

    // ----- Parte importante -----
    // Captura o cookie que armazena o token
    cy.getCookie("access_token").then(cookie => {

      expect(cookie).to.exist; // valida login real

      // Agora podemos acessar rotas que exigem autenticação
      cy.request({
        method: "GET",
        url: "http://localhost:8000/user/my",
        headers: { Cookie: `${cookie.name}=${cookie.value}` }
      }).then(res => {

        expect(res.status).to.eq(200);
        cy.log("USUÁRIO AUTENTICADO:", JSON.stringify(res.body, null, 2));

      });

    });

  });

});
