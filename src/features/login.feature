@login
Feature: ParaBank login

  @valid-login
  Scenario: Successful login of ParaBank with valid credentials
    Given I am on the parabank login page
    When I sign in with valid username "john" and password "demo"
    Then I should see the account services page
 
  @invalid-login
  Scenario: Login of ParaBank with invalid credentials
    Given I am on the parabank login page
    When I sign in with invalid username "abc456" and password "abc@456"
    Then I not able to see the account services page
  