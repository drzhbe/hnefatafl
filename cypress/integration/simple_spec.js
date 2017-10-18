describe('My first test', () => {
	it('Does not', () => {
		cy.visit('localhost:8000')
		cy.get('.actions__play').click()
		cy.get('.info').should('be.visible')
	})
})
