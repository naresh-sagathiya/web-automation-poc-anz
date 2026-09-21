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

## GitHub session-timeout scenario

The GitHub scenario is isolated from the existing suite and uses a Playwright storage-state file for a dedicated test account. Create the file once with a headed browser, then run:

```powershell
$env:GITHUB_STORAGE_STATE = "github-auth.json"
npm run test:github
```

Use `HEADLESS=false` when you need to watch the flow. The scenario clears the GitHub session, presses Back, and verifies that protected settings cannot be restored or refreshed without login.