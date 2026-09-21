Feature: Transfer Funds - Payment Limits & Negative Paths

  Background:
     Given user navigates to ParaBank application for transfer
     When user logs in with valid credentials for transfer funds
    
  @W13 @NegativeAmount
  Scenario: Validate transfer with negative amount
    Given user navigates to Transfer Funds page
    When user enters "-90" as transfer amount
    And user selects destination account "13344"
    And user clicks Transfer
    Then transfer validation message should be displayed

  @W13 @ZeroAmount
  Scenario: Validate transfer with zero amount
    Given user navigates to Transfer Funds page
    When user enters "0" as transfer amount
    And user selects destination account "13344"
    And user clicks Transfer
    Then transfer validation message should be displayed

  @W13 @InsufficientFunds
  Scenario: Validate transfer amount exceeds available balance
    Given user navigates to Transfer Funds page
    When user enters "99999999" as transfer amount
    And user selects destination account "13344"
    And user clicks Transfer
    Then transfer validation message should be displayed

  @W13 @OverPrecision
  Scenario: Validate transfer with excessive decimal precision
    Given user navigates to Transfer Funds page
    When user enters "100.123456" as transfer amount
    And user selects destination account "13344"
    And user clicks Transfer
    Then transfer validation message should be displayed