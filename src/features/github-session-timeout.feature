@github @session-timeout
Feature: GitHub session timeout

  Scenario: Back button must not restore an authenticated page after timeout
    Given I am authenticated on GitHub
    And I open a private GitHub page
    When my GitHub session expires
    And I press the browser back button
    Then I should not see authenticated GitHub content
    And refreshing the private GitHub page should require login