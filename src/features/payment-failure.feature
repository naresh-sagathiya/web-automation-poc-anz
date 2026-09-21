@W14
Feature: Transfer Validation & Double Submit

  Background:
   Given I am logged into ParaBank for payment failure
   And I open the Transfer Funds page

  @PaymentFailure @SupportedValidation
  Scenario: Verify invalid transfer handling
    When user enters "-90" as transfer amount
    And user selects destination account "13344"
    And user clicks Transfer
    Then transfer validation message should be displayed
