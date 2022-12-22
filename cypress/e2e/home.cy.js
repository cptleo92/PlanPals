describe('The Home Page', () => {
  it('successfully navigates to the login page', () => {
    cy.visit('/')
    
    cy.contains('Register').click()

    cy.url().should('contain', '/register')
  })
})

describe('Creating a new user', () => {
  before(() => {
    cy.exec('npm run db:wipe:test')
  })

  it('fails if fields are invalid', () => {
    cy.visit('/register')

    cy.get('input[name=firstName]').type('Cypress')
    cy.get('button[type=submit]').click()

    cy.contains('Last name is required')

    cy.get('input[name=lastName]').type('Io')
    cy.get('button[type=submit]').click()
    
    cy.contains('Email address is required')
    
    cy.get('input[name=email]').type('cypress@test.com')
    cy.get('button[type=submit]').click()
    
    cy.contains('Password is required')

    cy.get('input[name=password]').type('pass')
    cy.get('button[type=submit]').click()
    
    cy.contains('Passwords do not match')
    cy.contains('Password must be at least 6 characters')   
  })

  it('navigates to the user home page on successful registration', () => {
    cy.visit('/register')

    cy.get('input[name=firstName]').type('Cypress')
    cy.get('input[name=lastName]').type('Io')
    cy.get('input[name=email]').type('cypress@test.com')      
    cy.get('input[name=password]').clear().type('password')
    cy.get('input[name=confirmPassword]').clear().type('password')

    cy.get('button[type=submit]').click()
    
    cy.url().should('contain', '/home')   
  })

  it('fails if the user already exists', () => {
    cy.visit('/register')

    cy.get('input[name=firstName]').type('Cypress')
    cy.get('input[name=lastName]').type('Cypress')
    cy.get('input[name=email]').type('cypress@test.com')      
    cy.get('input[name=password]').clear().type('password')
    cy.get('input[name=confirmPassword]').clear().type('password')

    cy.get('button[type=submit]').click()

    cy.contains('User already exists!')
  })
})

