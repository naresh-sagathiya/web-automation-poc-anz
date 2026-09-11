# Web Automation POC ANZ

A TypeScript test automation starter using Playwright for browser automation and Cucumber for Gherkin-based BDD scenarios.

## Project structure

```text
features/
	login.feature                 # Gherkin scenarios
	step-definitions/             # Step implementations
src/
	pages/                        # Page Object Model classes
	support/                      # Cucumber world and lifecycle hooks
cucumber.js                     # Cucumber configuration
```

## Setup

```bash
npm install
npx playwright install chromium
```

Copy `.env.example` to `.env` when you need a different application URL or browser mode.

## Run tests

```bash
npm test                  # Headless Cucumber run
npm run test:headed       # Visible browser run
npm run test:debug        # Playwright inspector mode
npm run typecheck         # TypeScript validation
```

Override the target application with `BASE_URL` when needed.