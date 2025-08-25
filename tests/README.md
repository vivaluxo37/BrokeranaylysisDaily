# BrokeranalysisDaily Test Suite

This directory contains comprehensive tests for the BrokeranalysisDaily project, including both unit tests (Jest) and end-to-end tests (Playwright).

## Test Structure

```
tests/
├── e2e/                    # Playwright end-to-end tests
│   ├── blog.spec.ts        # Blog page functionality
│   ├── brokers.spec.ts     # Broker listing and detail pages
│   ├── homepage.spec.ts    # Homepage and navigation
│   ├── scalping-comparison.spec.ts  # Scalping comparison tool
│   ├── search.spec.ts      # Search functionality
│   └── simple.spec.ts      # Basic connectivity tests
├── fixtures/               # Test data and fixtures
│   └── test-data.ts        # Mock data and test constants
├── utils/                  # Test utilities and helpers
│   └── test-helpers.ts     # Common test helper functions
└── README.md              # This file

__tests__/
├── unit/                   # Jest unit tests
│   ├── AuthContext.test.tsx        # Authentication context tests
│   ├── DataService.test.ts         # Data service tests
│   ├── ScalpingBrokersClient.test.ts  # Broker getter functions
│   ├── api-ask-route.test.ts       # API route tests
│   └── vectorService.test.ts       # Vector search service tests
└── integration/            # Integration tests (future)
```

## Running Tests

### Unit Tests (Jest)
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests (Playwright)
```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/homepage.spec.ts

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests for specific browser
npx playwright test --project=chromium
```

### All Tests
```bash
# Run both unit and E2E tests
npm run test:all
```

## Test Coverage

### Unit Tests Cover:
- **AuthContext**: Authentication state management, sign up/in/out, password updates
- **DataService**: Database operations, error handling, data transformation
- **VectorService**: Search functionality, result formatting, error handling
- **ScalpingBrokersClient**: Broker data getters with various schema formats
- **API Routes**: Request/response handling, error scenarios, validation

### E2E Tests Cover:
- **Homepage**: Navigation, hero section, featured brokers, SEO, performance
- **Blog Page**: Article listing, pagination, search, category filters, responsive design
- **Broker Pages**: Listing, filtering, search, detail pages, trust scores, SEO metadata
- **Scalping Comparison**: Table/card views, data handling, broker selection, mobile responsiveness
- **Search Functionality**: Global search, results page, filters, pagination, special characters
- **Cross-cutting Concerns**: Accessibility, performance, JavaScript errors, mobile responsiveness

## Test Data and Fixtures

The `tests/fixtures/test-data.ts` file contains:
- Mock broker data with various schema formats
- Mock article data
- Test search queries (valid, empty, special characters, no results)
- Common selectors for UI elements
- Expected content patterns
- Viewport configurations
- Performance thresholds

## Test Helpers

The `tests/utils/test-helpers.ts` file provides:
- `TestHelpers` class with common test operations
- Element finding utilities
- JavaScript error checking
- SEO validation
- Accessibility checks
- Performance measurement
- Mobile navigation testing
- Search functionality testing

## Configuration

### Jest Configuration (`jest.config.js`)
- Uses Next.js Jest configuration
- Mocks Supabase and Next.js navigation
- Includes coverage thresholds (80% for all metrics)
- Supports TypeScript and module path mapping

### Playwright Configuration (`playwright.config.ts`)
- Tests against Chromium, Firefox, WebKit
- Mobile device testing (Pixel 5, iPhone 12)
- Automatic screenshots and videos on failure
- Trace collection for debugging
- Web server integration for local development

## Best Practices

### Writing Tests
1. **Use descriptive test names** that explain what is being tested
2. **Group related tests** using `describe` blocks
3. **Use data-testid attributes** for reliable element selection
4. **Test user journeys** rather than implementation details
5. **Handle async operations** properly with appropriate waits
6. **Test error scenarios** and edge cases
7. **Make tests resilient** to UI changes by using multiple selectors

### Test Data
1. **Use realistic test data** that matches production scenarios
2. **Test with missing/undefined data** to ensure graceful handling
3. **Include edge cases** like special characters and long strings
4. **Mock external dependencies** to ensure test reliability

### Maintenance
1. **Keep tests up to date** with UI changes
2. **Review and update selectors** when components change
3. **Monitor test performance** and optimize slow tests
4. **Update test data** to reflect current business requirements

## Debugging Tests

### Jest Tests
```bash
# Run tests in debug mode
npm test -- --detectOpenHandles --forceExit

# Run specific test file
npm test AuthContext.test.tsx

# Run tests with verbose output
npm test -- --verbose
```

### Playwright Tests
```bash
# Run with debug mode
npx playwright test --debug

# Run with headed browser
npx playwright test --headed

# Generate and view test report
npx playwright show-report

# Record new tests
npx playwright codegen localhost:3001
```

## Continuous Integration

The test suite is designed to run in CI environments:
- Jest tests run quickly and provide fast feedback
- Playwright tests include retry logic for flaky tests
- Screenshots and videos are captured on failures
- Coverage reports are generated for monitoring

## Future Enhancements

1. **Visual Regression Testing**: Add screenshot comparison tests
2. **API Testing**: Expand API route testing coverage
3. **Performance Testing**: Add Lighthouse integration
4. **Accessibility Testing**: Integrate axe-core for automated a11y testing
5. **Load Testing**: Add tests for high-traffic scenarios
6. **Cross-browser Testing**: Expand browser coverage
7. **Database Testing**: Add tests for database operations
8. **Security Testing**: Add tests for common security vulnerabilities
