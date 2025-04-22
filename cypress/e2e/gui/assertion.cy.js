

// cypress.Commands.add('haveText', (selector, text) => {
//    cy.get(selector).should('contain.text', text)





// })



describe('assertion', () => {
    // it('assertions', () => {
    //     cy.visit('https://www.bootcampshub.ai/branch-landing-page');
    //     cy.get('#__next > div > div > section.b1 > div.banner_main > div.left_side > div.left_text > h2').should('be.visible');
    //     cy.get('#__next > div > div > section.b1 > div.banner_main > div.left_side > div.left_text > h2').should('contain.text', 'One');
    //     cy.get("#__next > div > div > section.explore > div > div").should("have.class", "right_div")
    // });

    // it('assertions', () => {
    //     cy.visit('https://www.bootcampshub.ai/branch-landing-page');
    //     cy.get('#__next > div > div > section.b1 > div.banner_main > div.left_side > div.left_text > h2')
    //     .should('be.visible')
    //     .and('have.text', 'One Stop Solution for Trade School & Students')
    //     .and('contain.text', 'One')
       
       
    // });
    it.only('check the text', ()=> {
        cy.visit('https://www.bootcampshub.ai/branch-landing-page');

        const selector = "#__next > div > div > section.b1 > div.banner_main > div.left_side > div.left_text > h2"
        const text = "One Stop"
        cy.haveText(selector, text)
        
    })
});