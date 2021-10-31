describe("Audio Player", () => {
	it("plays audio", () => {
		cy.visit("/");
		//Dirty hacks here involve hardcoded ids
		//I wouldnt use in a real app unless i'm in hurry.
		cy.get(".composition-name:first").click();
		cy.get("#play-button").click();
		cy.wait(1000);
		cy.get("#player-play-button").click();
	});
});
