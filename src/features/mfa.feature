@mfa
Feature: MFA login

  Background:
    Given I am on the MFA login page

  Scenario: Successful login with a valid MFA code
    When I enter MFA credentials with username "demo_user" and password "secret_pass"
    And I submit the current TOTP code
    Then I should be logged in successfully

  Scenario: MFA login form displays the required controls
    Then I should see the MFA challenge
    And I should see the MFA code field
    And I should see the verify button

  Scenario: Wrong MFA code is rejected
    When I enter MFA credentials with username "demo_user" and password "secret_pass"
    And I submit MFA code "000000"
    Then I should see an invalid MFA code message
    And I should remain on the MFA challenge

  Scenario: Expired MFA code is rejected
    When I enter MFA credentials with username "demo_user" and password "secret_pass"
    And I submit an expired MFA code
    Then I should see an invalid MFA code message
    And I should remain on the MFA challenge

  Scenario: Login is rejected when the MFA code is missing
    When I enter MFA credentials with username "demo_user" and password "secret_pass"
    And I submit the login form without an MFA code
    Then I should see a required MFA code message
    And I should remain on the MFA challenge

  Scenario: Login is rejected with invalid credentials
    When I enter MFA credentials with username "invalid_user" and password "invalid_password"
    And I submit MFA code "000000"
    Then I should see an invalid credentials message
    And I should remain on the MFA login form