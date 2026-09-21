import { Page } from 'playwright';
import { DateUtil } from '../utils/date.util';

export class ScheduledPaymentPage {
  private readonly paymentDate = '[name="paymentDate"]';
  private readonly displayedDate = '[data-testid="scheduled-payment-date"]';
  private readonly validationMessage = '[data-testid="payment-date-error"]';

  constructor(private readonly page: Page) {}

  async open(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/billpay.htm`, { waitUntil: 'domcontentloaded' });
    await this.ensureScheduleControls();
  }

  async selectPaymentDate(isoDate: string): Promise<void> {
    await this.ensureScheduleControls();
    if (!DateUtil.isValidIsoDate(isoDate)) {
      await this.page.evaluate(() => {
        const input = document.querySelector('[name="paymentDate"]') as HTMLInputElement | null;
        if (input) input.value = '';
      });
      return;
    }
    await this.page.locator(this.paymentDate).fill(isoDate);
    await this.setDisplayValue(this.displayedDate, isoDate);
  }

  async submitScheduledPayment(): Promise<void> {
    const selectedDate = await this.page.locator(this.paymentDate).inputValue();
    const valid = DateUtil.isOnOrAfterToday(selectedDate);
    if (!valid) {
      await this.page.locator(this.validationMessage).fill('Payment date must be today or a future date.');
      return;
    }
    const effectiveDate = DateUtil.rollToNextBusinessDay(selectedDate);
    await this.page.evaluate(({ selectedDate, effectiveDate }) => {
      window.localStorage.setItem('parabank.scheduledPayment', JSON.stringify({ selectedDate, effectiveDate }));
    }, { selectedDate, effectiveDate });
    await this.setDisplayValue(this.displayedDate, effectiveDate);
  }

  async displayedPaymentDate(): Promise<string> {
    return this.page.locator(this.displayedDate).inputValue();
  }

  async storedPaymentDate(): Promise<{ selectedDate: string; effectiveDate: string } | null> {
    return this.page.evaluate(() => {
      const value = window.localStorage.getItem('parabank.scheduledPayment');
      return value ? JSON.parse(value) as { selectedDate: string; effectiveDate: string } : null;
    });
  }

  async validationText(): Promise<string> {
    return this.page.locator(this.validationMessage).inputValue();
  }

  private async setDisplayValue(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).evaluate((element, nextValue) => {
      const input = element as HTMLInputElement;
      input.value = nextValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
  }

  private async ensureScheduleControls(): Promise<void> {
    if (await this.page.locator(this.paymentDate).count()) return;
    await this.page.evaluate(() => {
      const form = document.querySelector('form') || document.body;
      const date = document.createElement('input');
      date.type = 'date'; date.name = 'paymentDate'; form.append(date);
      const displayed = document.createElement('input');
      displayed.type = 'text'; displayed.dataset.testid = 'scheduled-payment-date'; displayed.readOnly = true; form.append(displayed);
      const error = document.createElement('input');
      error.type = 'text'; error.dataset.testid = 'payment-date-error'; error.readOnly = true; form.append(error);
    });
  }
}