Feature: User authentication
  As a registered customer
  I want to sign in to the store
  So that I can view the inventory

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I sign in with username "standard_user" and password "secret_sauce"
    Then I should see the inventory page
