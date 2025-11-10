# Playwright E2E Tests for ProtoApp

This directory contains end-to-end tests for the ProtoApp application running on https://protoapp.xyz.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install chromium
```

3. Set up environment variables for Google SSO authentication:
```bash
export GOOGLE_TEST_EMAIL="your-test-email@gmail.com"
export GOOGLE_TEST_PASSWORD="your-test-password"
```

Or create a `.env` file in the project root with:
```
GOOGLE_TEST_EMAIL=your-test-email@gmail.com
GOOGLE_TEST_PASSWORD=your-test-password
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests with UI mode:
```bash
npm run test:ui
```

Run tests in headed mode (see browser):
```bash
npm run test:headed
```

Debug tests:
```bash
npm run test:debug
```

View test report:
```bash
npm run test:report
```

## Test Structure

- `auth.setup.ts` - Authentication setup that runs before all tests
- `home.spec.ts` - Tests for the home/dashboard page
- `campaigns.spec.ts` - Tests for campaign management
- `billing.spec.ts` - Tests for billing and subscriptions
- `contacts.spec.ts` - Tests for contact management
- `analytics.spec.ts` - Tests for analytics page
- `other-features.spec.ts` - Tests for API keys, webhooks, email, media, deals, articles, about, and account pages

## Important Notes

- All tests run against the production environment (https://protoapp.xyz)
- Tests create data with the "PLAYWRIGHT" prefix to distinguish test data from real data
- Authentication is handled once in the setup step and reused across all tests
- Test artifacts (screenshots, videos, traces) are saved in the `test-results/` directory
- Test reports are generated in the `playwright-report/` directory

## Test Coverage

The test suite covers:
- ✅ Home/Dashboard page
- ✅ Campaigns (list, create, edit, form builder, users, embed)
- ✅ Billing (index, plans, payment method, pay)
- ✅ Contacts
- ✅ Analytics
- ✅ API Keys
- ✅ Webhooks
- ✅ Email
- ✅ Media
- ✅ Deals
- ✅ Articles
- ✅ About
- ✅ Account
