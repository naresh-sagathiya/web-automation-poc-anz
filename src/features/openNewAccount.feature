Feature: ParaBank Open New Account

  @W5
  @smoke
  Scenario: Open a new account successfully
    Given user is logged into ParaBank
    When user navigates to the "Open New Account" page
    And  user creates a new additional account
    Then user should see the newly created account in the "Accounts Overview" page