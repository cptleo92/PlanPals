describe('user interaction', () => {  
  beforeEach(() => {
    cy.exec('npm run db:wipe:test')
    cy.register()
  })

  it('shows home page properly on login', () => {    
    
    cy.contains('Hello there, Cypress')

  })

  it.only('creates a new group and new hangout properly', () => {

    cy.get('[data-testid=AddIcon]').click()

    cy.get('input[name=title]').type('New Group')
    cy.get('textarea[name=description]').type('Description for this group')
    cy.get('button[type=submit]').click()

    cy.contains('New Group')
    cy.contains('View Group').click()

    cy.contains('Plan a new hangout!').click()

    cy.get('input[name=title]').type('New hangout')
    cy.get('textarea[name=description]').type('Description for this hangout')

    cy.get('.rmdp-right').click()
    cy.get('.sd ').contains('11').click()

    cy.get('button[type=submit]').click()

    cy.url().should('contain', '/hangouts')
    cy.contains('New hangout')
  })
})