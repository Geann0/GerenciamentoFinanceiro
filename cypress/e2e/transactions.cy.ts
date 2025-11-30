describe('Transaction Flow', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should create a new income transaction', () => {
    cy.get('[data-testid="create-transaction-btn"]').click()
    cy.get('input[value="INCOME"]').check()
    cy.get('input[name="amount"]').type('500')
    cy.get('input[name="description"]').type('Salary payment')
    cy.get('input[name="date"]').type('2024-01-15')
    cy.get('select[name="categoryId"]').select('Salary')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Salary payment').should('be.visible')
    cy.contains('$500.00').should('be.visible')
  })

  it('should create a new expense transaction', () => {
    cy.get('[data-testid="create-transaction-btn"]').click()
    cy.get('input[value="EXPENSE"]').check()
    cy.get('input[name="amount"]').type('50')
    cy.get('input[name="description"]').type('Grocery shopping')
    cy.get('input[name="date"]').type('2024-01-16')
    cy.get('select[name="categoryId"]').select('Food')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Grocery shopping').should('be.visible')
    cy.contains('$50.00').should('be.visible')
  })

  it('should filter transactions by type', () => {
    cy.get('[data-testid="filter-type"]').select('INCOME')
    cy.get('[data-testid="transaction-item"]').each(($el) => {
      cy.wrap($el).should('contain', 'Income')
    })
  })

  it('should display correct balance', () => {
    cy.get('[data-testid="total-income"]').should('be.visible')
    cy.get('[data-testid="total-expense"]').should('be.visible')
    cy.get('[data-testid="balance"]').should('be.visible')
  })
})
