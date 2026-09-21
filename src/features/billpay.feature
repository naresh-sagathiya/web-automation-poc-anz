@bill
Feature: Bill Payment

Background:
  Given I am logged into ParaBank
  And I open the Bill Pay page


Scenario: Successful bill payment
  When I enter valid bill payment details
  And I submit the payment
  Then payment should be successful
  And I capture the receipt details


Scenario: Mandatory field validation
  When I submit the payment form without entering details
  Then validation errors should be displayed


Scenario: Invalid CRN equivalent validation
  When I enter mismatched account numbers
  And I submit the payment
  Then the payment should be rejected