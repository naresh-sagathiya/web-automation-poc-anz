import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { ScheduledPaymentPage } from '../../pages/scheduled-payment.page';
import { DateUtil } from '../../utils/date.util';
import { CustomWorld } from '../../support/world';

const page = (world: CustomWorld): ScheduledPaymentPage => new ScheduledPaymentPage(world.page);

Given('the user is on the payment page', async function (this: CustomWorld) { await page(this).open(this.parameters.baseUrl); });

When('the user selects a payment date of today plus 3 days', { timeout: 30_000 }, async function (this: CustomWorld) {
	this.selectedPaymentDate = DateUtil.todayPlusThreeDays(this.mockedNow);
	await page(this).selectPaymentDate(this.selectedPaymentDate);
});

When('the user selects a payment date that falls on a weekend', { timeout: 30_000 }, async function (this: CustomWorld) {
	this.selectedPaymentDate = DateUtil.nextWeekendDate(this.mockedNow);
	this.expectedEffectiveDate = DateUtil.rollToNextBusinessDay(this.selectedPaymentDate);
	await page(this).selectPaymentDate(this.selectedPaymentDate);
});

When('the user selects yesterday as the payment date', { timeout: 30_000 }, async function (this: CustomWorld) {
	await page(this).selectPaymentDate(DateUtil.addDaysInSydney(-1, this.mockedNow));
});

When('the user enters an invalid payment date', { timeout: 30_000 }, async function (this: CustomWorld) { await page(this).selectPaymentDate('2026-02-31'); });

When('the user submits the scheduled payment', { timeout: 30_000 }, async function (this: CustomWorld) { await page(this).submitScheduledPayment(); });
When('submits the scheduled payment', { timeout: 30_000 }, async function (this: CustomWorld) { await page(this).submitScheduledPayment(); });

When('the current Sydney date is mocked as {string}', async function (this: CustomWorld, today: string) {
	this.mockedNow = new Date(`${today}T12:00:00+11:00`);
	await page(this).open(this.parameters.baseUrl);
});

Then('the selected date should be displayed correctly', async function (this: CustomWorld) {
	assert.equal(await page(this).displayedPaymentDate(), this.expectedEffectiveDate || this.selectedPaymentDate);
});

Then('the selected date should persist after submission', async function (this: CustomWorld) {
	assert.equal((await page(this).storedPaymentDate())?.selectedDate, this.selectedPaymentDate);
});

Then('the scheduled payment date should roll to the next business day', async function (this: CustomWorld) {
	assert.equal(await page(this).displayedPaymentDate(), this.expectedEffectiveDate);
});

Then('the payment date validation message should be displayed', async function (this: CustomWorld) {
	assert.match(await page(this).validationText(), /today or a future date/i);
});

Then('the selected date should be {string}', async function (this: CustomWorld, expected: string) {
	assert.equal(this.selectedPaymentDate, expected);
});
