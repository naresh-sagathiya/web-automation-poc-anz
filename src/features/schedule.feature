@schedule
Feature: Future Dated Payment
	ParaBank has no native scheduled-payment API. These POC scenarios validate the browser-side schedule record.

	Background:
		Given the user is on the payment page

	Scenario: Select a dynamic future payment date
		When the user selects a payment date of today plus 3 days
		Then the selected date should be displayed correctly

	Scenario: Schedule and persist a future-dated payment
		When the user selects a payment date of today plus 3 days
		And submits the scheduled payment
		Then the selected date should be displayed correctly
		And the selected date should persist after submission

	Scenario: Calculate the date in Sydney timezone across year-end
		When the current Sydney date is mocked as "2026-12-30"
		And the user selects a payment date of today plus 3 days
		Then the selected date should be "2027-01-02"
