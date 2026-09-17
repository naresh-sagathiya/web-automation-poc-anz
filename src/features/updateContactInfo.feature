
@UpdateContactInfo
Feature: Update Contact Information



  Background:
    Given user navigates to ParaBank application
    And user logs in with valid credentials

  Scenario: Update contact details successfully
    When user navigates to Update Contact Info page
    And user updates contact details with valid information
    Then contact information should be updated successfully


