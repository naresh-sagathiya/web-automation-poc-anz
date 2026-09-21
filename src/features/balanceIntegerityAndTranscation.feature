Feature: ParaBank account transaction validation
 Background:
    Given the customer is logged into ParaBank
@W6 
@BalanceIntegrity
Scenario: Verify account balance updates after successful bill payment
    When the customer records the current account balance
    And the customer navigates to Bill Pay
    And the customer submits a valid bill payment with the amount of "40"
    Then the bill payment should be completed successfully
    And the account balance should be decreased by "40"

@w7 @transaction-search
Scenario: Verify transaction search by amount
  When the customer pays a bill with amount "15"
  And the customer navigates to Find Transactions
  And the customer selects the payment account
  And the customer searches transactions by amount "15"
  Then the matching transaction should be displayed with the amount "15"