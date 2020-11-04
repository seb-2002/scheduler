describe("Navigation", () => {
  beforeEach(() => {
    cy.request("GET", "api/debug/reset");
    cy.visit("/");
    cy.contains(/monday/i);
  });

  it("should navigate to tuesday", () => {
    cy.contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");
  });
  cd;

  it("should book an interview", () => {
    cy.visit("/");
    cy.contains("[data-testid=day]", "Tuesday").click();
    cy.get(
      ":nth-child(1) > .appointment__add > .appointment__add-button"
    ).click();
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
    cy.get("[alt='Sylvia Palmer']").click();
    cy.contains(/save/i).click();
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    cy.get("[alt=Edit]").first().click({ force: true });
    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Lydia Miller-Jones");
    cy.get("[alt='Tori Malcolm']").click();

    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should delete an interview", () => {
    cy.get("[alt=Delete]").first().click({ force: true });
    cy.contains(/confirm/i).click();
    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");

    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
});
