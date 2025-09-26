# Admin Product Management - Automated Testing Suite

This directory contains comprehensive automated tests for the DEV Egypt e-commerce platform's admin product management functionality.

## Test Structure

### 1. Basic Playwright Tests (`admin-product-management.spec.ts`)
- **Authentication Testing**: Login/logout functionality
- **Form Validation**: Required fields, input validation
- **Product Creation Workflow**: Complete product creation process
- **UI Component Testing**: Form elements, dropdowns, checkboxes
- **File Upload Testing**: Thumbnail and color image uploads
- **Navigation Testing**: Page transitions and routing

### 2. Advanced MCP Integration Tests (`admin-product-mcp.spec.ts`)
- **Browser Automation**: Advanced browser interactions using MCP
- **Complex Workflows**: Multi-step product creation scenarios
- **Visual Testing**: Screenshot capture and comparison
- **Error Handling**: Validation states and error recovery
- **Performance Testing**: Form submission and response times

## Test Data

### Default Admin Credentials
```typescript
const ADMIN_CREDENTIALS = {
  email: 'admin@devegypt.com',
  password: 'admin123456'
};
```

### Sample Product Data
```typescript
const TEST_PRODUCT = {
  name: 'Test Medical Scrub Set',
  description: 'High-quality medical scrubs for healthcare professionals',
  category: '1', // Scrubs
  brand: '1', // MediWear
  sellingPrice: '89.99',
  discountPrice: '79.99',
  stockQuantity: '100',
  minimumOrder: '2',
  colors: ['Blue', 'White', 'Green'],
  sizes: ['S', 'M', 'L', 'XL']
};
```

## Running Tests

### Prerequisites
1. Ensure the development server is running: `npm run dev`
2. Admin user must be created in the database
3. Database must be seeded with categories and brands

### Basic Test Execution
```bash
# Run all e2e tests
npm run test:e2e

# Run tests with UI mode (visual debugging)
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/admin-product-management.spec.ts

# Run tests in debug mode
npm run test:e2e:debug

# Generate and view test report
npm run test:e2e:report
```

### Advanced Test Execution
```bash
# Run tests in specific browser
npx playwright test --project=chromium

# Run tests with specific timeout
npx playwright test --timeout=60000

# Run tests with custom configuration
npx playwright test --config=playwright.config.ts

# Run tests and generate screenshots
npx playwright test --screenshot=on

# Run tests with video recording
npx playwright test --video=on
```

## Test Coverage

### Authentication Tests
- ✅ Login with correct credentials
- ✅ Login with incorrect credentials
- ✅ Redirect to login when not authenticated
- ✅ Session persistence and logout

### Product Creation Form Tests
- ✅ Complete product creation workflow
- ✅ Required field validation
- ✅ Category and brand selection
- ✅ Color and size variant selection
- ✅ Price and inventory input validation
- ✅ File upload (thumbnail and color images)
- ✅ Form reset after successful submission

### Navigation Tests
- ✅ Navigate to add product page
- ✅ Back to products list navigation
- ✅ Cancel button functionality
- ✅ Form state preservation during navigation

### Error Handling Tests
- ✅ Network error handling
- ✅ Server validation errors
- ✅ File upload errors
- ✅ Form submission failures

## MCP Browser Integration

The advanced tests demonstrate integration with MCP (Model Context Protocol) browser automation:

### Key Features
1. **Real Browser Automation**: Uses actual browser instances for testing
2. **Visual Feedback**: Screenshots and video recordings
3. **Complex Interactions**: Multi-step workflows with dynamic content
4. **Error Recovery**: Automatic retry and error handling
5. **Performance Monitoring**: Response time measurements

### MCP Browser Commands Used
```typescript
// Navigation
await page.goto('/admin/login');

// Element Interaction
await page.fill('#email', credentials.email);
await page.click('button[type="submit"]');

// File Upload
await page.setInputFiles('#thumbnail-upload', fileData);

// Assertions
await expect(page.locator('h1')).toContainText('Add Product');

// Screenshots
await page.screenshot({ path: 'screenshot.png' });
```

## Test Environment Setup

### Database Preparation
```sql
-- Ensure admin user exists
INSERT INTO users (email, password_hash, role) VALUES 
('admin@devegypt.com', 'hashed_password', 'admin');

-- Ensure categories exist
INSERT INTO categories (name, slug) VALUES 
('Scrubs', 'scrubs'),
('Lab Coats', 'lab-coats'),
('Shoes', 'shoes'),
('Accessories', 'accessories');

-- Ensure brands exist
INSERT INTO brands (name, slug) VALUES 
('MediWear', 'mediwear'),
('NursePro', 'nursepro'),
('ComfortFeet', 'comfortfeet'),
('SafeGuard', 'safeguard');
```

### Environment Variables
```bash
NODE_ENV=test
DATABASE_URL=file:./test-dev-egypt.db
JWT_SECRET=test_secret_key
PORT=5000
```

## Debugging Tests

### Common Issues and Solutions

1. **Server Not Running**
   ```bash
   # Start development server
   npm run dev
   ```

2. **Database Not Seeded**
   ```bash
   # Initialize and seed database
   npm run db:push
   npm run db:seed
   tsx create-admin-user.ts
   ```

3. **Authentication Failures**
   - Verify admin user exists in database
   - Check password hashing in create-admin-user.ts
   - Ensure JWT_SECRET is set correctly

4. **Element Not Found Errors**
   - Check if UI components have correct IDs
   - Verify CSS selectors in tests
   - Use browser dev tools to inspect elements

5. **Timeout Issues**
   - Increase timeout in playwright.config.ts
   - Add explicit waits for dynamic content
   - Check network tab for slow API calls

### Debug Mode Features
- **Step-by-step execution**: Pause at each test step
- **Browser dev tools**: Access Chrome/Firefox dev tools
- **Console logs**: View browser console output
- **Network monitoring**: Inspect API requests/responses

## Test Data Management

### Image Test Data
The tests use base64-encoded 1x1 pixel images for file upload testing:
```typescript
const testImageBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 
  'base64'
);
```

### Dynamic Test Data
- Product names include timestamps to avoid duplicates
- Email addresses use unique suffixes for parallel test runs
- File names include test identifiers for cleanup

## Continuous Integration

### GitHub Actions Setup
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx playwright install
      - run: npm run test:e2e
```

### Test Reports
- HTML reports generated in `playwright-report/`
- Screenshots saved in `test-results/`
- Videos recorded for failed tests
- Trace files for debugging

## Best Practices

1. **Page Object Model**: Consider implementing page objects for complex forms
2. **Test Data Isolation**: Use unique test data to avoid conflicts
3. **Explicit Waits**: Use `waitFor` instead of `setTimeout`
4. **Error Screenshots**: Automatically capture screenshots on failures
5. **Retry Logic**: Configure retries for flaky tests
6. **Parallel Execution**: Run tests in parallel for faster feedback

## Contributing

When adding new tests:
1. Follow existing naming conventions
2. Add appropriate test documentation
3. Ensure tests are deterministic and reliable
4. Include both positive and negative test cases
5. Update this README with new test scenarios