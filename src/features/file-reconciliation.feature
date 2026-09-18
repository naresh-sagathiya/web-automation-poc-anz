@file-reconciliation
Feature: ParaBank PDF and CSV reconciliation

  Background:
    Given I am on the parabank login page
    When I sign in with valid username "john" and password "demo"

  @csv-reconciliation
  Scenario: Reconcile CSV account export with ParaBank UI
    Given I capture the first account details from the ParaBank UI
    When I create a CSV export from the captured account details
    Then the CSV account details should match the ParaBank UI

  @pdf-reconciliation
  Scenario: Reconcile PDF account export with ParaBank UI
    Given I capture the first account details from the ParaBank UI
    When I create a PDF export from the captured account details
    Then the PDF account details should match the ParaBank UI
