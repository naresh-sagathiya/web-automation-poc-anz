# W12 Scheduled / Future-Dated Payment

ParaBank does not provide scheduled payments natively. The scenarios below use a browser-side schedule record as the reference implementation and keep all dates dynamic in the automation.

## Shared Preconditions

- ParaBank is reachable at `BASE_URL`.
- A browser context is available and the user can open Bill Pay.
- The schedule control is available, or the ParaBank-compatible test shim is enabled.
- Calendar calculations use `Australia/Sydney` and ISO `YYYY-MM-DD` values.

## Functional Test Cases

| ID | Test Description | Test Steps | Expected Results | Playwright Locators |
| --- | --- | --- | --- | --- |
| W12-F01 | Schedule Today + 3 days | Open Bill Pay; calculate `DateUtil.todayPlusThreeDays()`; select the date; submit | The selected future date is displayed and the stored record contains the same selected date | `[name="paymentDate"]`, `[data-testid="scheduled-payment-date"]` |
| W12-F02 | Persist the scheduled date | Submit a valid future date; read the saved schedule | `localStorage['parabank.scheduledPayment']` contains `selectedDate` and `effectiveDate` | `page.evaluate()` |
| W12-F03 | Roll a weekend date | Select the next Saturday; submit | The effective date is the following Monday and the original selected date remains stored | `[name="paymentDate"]`, `[data-testid="scheduled-payment-date"]` |
| W12-F04 | Reject a past date | Select yesterday; submit | No schedule is stored and a future-date validation message is shown | `[data-testid="payment-date-error"]` |
| W12-F05 | Reject invalid input | Enter an impossible ISO date such as `2026-02-31`; submit | A date validation message is shown and no invalid record is stored | `[name="paymentDate"]`, `[data-testid="payment-date-error"]` |
| W12-F06 | Handle month rollover | Mock Sydney date `2026-01-30`; calculate Today + 3 | The result is `2026-02-02` with no timezone offset | `[name="paymentDate"]` |
| W12-F07 | Handle year rollover | Mock Sydney date `2026-12-30`; calculate Today + 3 | The result is `2027-01-02` with no timezone offset | `[name="paymentDate"]` |

## Positive Scenarios

- W12-F01 accepts a valid future date calculated at runtime.
- W12-F02 preserves both the requested date and the business-day effective date.
- W12-F03 applies the non-business-day rule by rolling Saturday or Sunday forward to Monday.

## Negative Scenarios

- W12-F04 rejects yesterday and all dates before the Sydney calendar date.
- W12-F05 rejects malformed, impossible, or empty date values with a user-visible message.

## Edge Cases

- Month-end and year-end rollovers are covered by W12-F06 and W12-F07.
- Sydney daylight-saving transitions do not change the calendar date because calculations use Sydney date parts and UTC calendar arithmetic.
- Weekend selection stores the requested date while displaying the effective business date.