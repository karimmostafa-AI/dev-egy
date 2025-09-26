import { test, expect, Page } from '@playwright/test';
import path from 'path';

// Test data constants
const ADMIN_CREDENTIALS = {
  email: 'admin@devegypt.com',
  password: 'admin123456'
};

const TEST_PRODUCT = {
  name: 'Test Medical Scrub Set',
  description: 'High-quality medical scrub set for healthcare professionals. Comfortable, durable, and available in multiple colors and sizes.',
  category: '1', // Scrubs
  brand: '1', // MediWear
  sellingPrice: '89.99',
  discountPrice: '79.99',
  stockQuantity: '100',
  minimumOrder: '2',
  colors: ['Blue', 'White', 'Green'],
  sizes: ['S', 'M', 'L', 'XL']
};

/**
 * Helper function to login as admin
 */
async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login');
  
  // Check if already on admin login page
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.locator('h2')).toContainText('Admin Portal');

  // Fill login credentials
  await page.fill('#email', ADMIN_CREDENTIALS.email);
  await page.fill('#password', ADMIN_CREDENTIALS.password);
  
  // Submit login form
  await page.click('button[type="submit"]');
  
  // Wait for successful login and redirect to admin dashboard
  await page.waitForURL(/\/admin/);
  await expect(page).toHaveURL(/\/admin/);
}

/**
 * Helper function to navigate to add product page
 */
async function navigateToAddProduct(page: Page) {
  // Navigate to products management
  await page.goto('/admin/products');
  
  // Click on "Add Product" button or navigate directly
  await page.goto('/admin/add-product');
  
  // Verify we're on the add product page
  await expect(page.locator('h1')).toContainText('Add Product');
  await expect(page.locator('form')).toBeVisible();
}

test.describe('Admin Product Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginAsAdmin(page);
  });

  test('should successfully add a new product with complete information', async ({ page }) => {
    await navigateToAddProduct(page);

    // Fill basic information
    await page.fill('#name', TEST_PRODUCT.name);
    await page.fill('#description', TEST_PRODUCT.description);

    // Select category
    await page.click('[data-testid="category-select"], button[role="combobox"]:has-text("Select a category")');
    await page.click(`[role="option"][data-value="${TEST_PRODUCT.category}"]`);

    // Select brand  
    await page.click('[data-testid="brand-select"], button[role="combobox"]:has-text("Select a brand")');
    await page.click(`[role="option"][data-value="${TEST_PRODUCT.brand}"]`);

    // Fill pricing information
    await page.fill('#sellingPrice', TEST_PRODUCT.sellingPrice);
    await page.fill('#discountPrice', TEST_PRODUCT.discountPrice);
    await page.fill('#stockQuantity', TEST_PRODUCT.stockQuantity);
    await page.fill('#minimumOrder', TEST_PRODUCT.minimumOrder);

    // Upload thumbnail image (create a test image file)
    const testImagePath = path.join(__dirname, 'test-assets', 'product-thumbnail.jpg');
    
    // Check if file upload input exists and upload if available
    const fileInput = page.locator('#thumbnail-upload');
    if (await fileInput.isVisible()) {
      // Create a simple test file for upload
      await page.setInputFiles('#thumbnail-upload', {
        name: 'test-product.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('test image data')
      });
    }

    // Select colors
    for (const color of TEST_PRODUCT.colors) {
      await page.check(`#color-${color}`);
    }

    // Select sizes  
    for (const size of TEST_PRODUCT.sizes) {
      await page.check(`#size-${size}`);
    }

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for success message or redirect
    await page.waitForTimeout(2000);
    
    // Verify success (could be a toast message, redirect, or success indicator)
    // This will depend on how the app handles success responses
    const successIndicators = [
      page.locator('[role="alert"]:has-text("success")'),
      page.locator('.toast:has-text("Product Created")'),
      page.locator('[data-testid="success-message"]'),
    ];

    let successFound = false;
    for (const indicator of successIndicators) {
      try {
        await indicator.waitFor({ timeout: 3000 });
        successFound = true;
        break;
      } catch (e) {
        // Continue checking other indicators
      }
    }

    // If no specific success indicator, check if we stayed on page or redirected
    if (!successFound) {
      // Check if form was reset (indicating success)
      const nameField = page.locator('#name');
      const nameValue = await nameField.inputValue();
      expect(nameValue).toBe(''); // Form should be reset on success
    }
  });

  test('should show validation errors for required fields', async ({ page }) => {
    await navigateToAddProduct(page);

    // Try to submit form without filling required fields
    await page.click('button[type="submit"]');

    // Check for HTML5 validation or custom validation messages
    const nameField = page.locator('#name');
    const categorySelect = page.locator('button[role="combobox"]:has-text("Select a category")');
    const brandSelect = page.locator('button[role="combobox"]:has-text("Select a brand")');
    const priceField = page.locator('#sellingPrice');

    // Verify required field validation
    await expect(nameField).toHaveAttribute('required');
    await expect(priceField).toHaveAttribute('required');
    
    // Check if browser validation or custom validation prevents submission
    const currentUrl = page.url();
    expect(currentUrl).toContain('/admin/add-product');
  });

  test('should handle category and brand selection properly', async ({ page }) => {
    await navigateToAddProduct(page);

    // Test category selection
    await page.click('button[role="combobox"]:has-text("Select a category")');
    await expect(page.locator('[role="listbox"], [role="menu"]')).toBeVisible();
    
    // Select Scrubs category
    await page.click('[role="option"]:has-text("Scrubs")');
    
    // Verify category was selected
    await expect(page.locator('button[role="combobox"]').first()).toContainText('Scrubs');

    // Test brand selection
    await page.click('button[role="combobox"]:has-text("Select a brand")');
    await expect(page.locator('[role="listbox"], [role="menu"]')).toBeVisible();
    
    // Select MediWear brand
    await page.click('[role="option"]:has-text("MediWear")');
    
    // Verify brand was selected
    await expect(page.locator('button[role="combobox"]').nth(1)).toContainText('MediWear');
  });

  test('should handle color and size selection', async ({ page }) => {
    await navigateToAddProduct(page);

    // Test color selection
    const colors = ['Black', 'White', 'Blue'];
    for (const color of colors) {
      const colorCheckbox = page.locator(`#color-${color}`);
      await colorCheckbox.check();
      await expect(colorCheckbox).toBeChecked();
    }

    // Verify color images section appears when colors are selected
    await expect(page.locator('h4:has-text("Color Images")')).toBeVisible();

    // Test size selection
    const sizes = ['S', 'M', 'L'];
    for (const size of sizes) {
      const sizeCheckbox = page.locator(`#size-${size}`);
      await sizeCheckbox.check();
      await expect(sizeCheckbox).toBeChecked();
    }

    // Test deselecting colors
    await page.uncheck('#color-Black');
    await expect(page.locator('#color-Black')).not.toBeChecked();
  });

  test('should validate numeric fields properly', async ({ page }) => {
    await navigateToAddProduct(page);

    // Test price fields accept numeric input
    await page.fill('#sellingPrice', '99.99');
    await expect(page.locator('#sellingPrice')).toHaveValue('99.99');

    await page.fill('#discountPrice', '89.99');
    await expect(page.locator('#discountPrice')).toHaveValue('89.99');

    // Test stock quantity
    await page.fill('#stockQuantity', '50');
    await expect(page.locator('#stockQuantity')).toHaveValue('50');

    // Test minimum order
    await page.fill('#minimumOrder', '1');
    await expect(page.locator('#minimumOrder')).toHaveValue('1');

    // Test invalid input (letters in numeric fields)
    await page.fill('#sellingPrice', 'invalid');
    // The input type="number" should prevent or filter invalid characters
  });

  test('should allow canceling product creation', async ({ page }) => {
    await navigateToAddProduct(page);

    // Fill some fields
    await page.fill('#name', 'Test Product to Cancel');
    await page.fill('#description', 'This product creation will be cancelled');

    // Click cancel button
    await page.click('a:has-text("Cancel"), button:has-text("Cancel")');

    // Should navigate back to products list
    await expect(page).toHaveURL(/\/admin\/products/);
  });

  test('should display product creation form elements correctly', async ({ page }) => {
    await navigateToAddProduct(page);

    // Verify all main sections are present
    await expect(page.locator('h1:has-text("Add Product")')).toBeVisible();
    await expect(page.locator('[data-testid="basic-info"], .card:has(h3:text("Basic Information"))')).toBeVisible();
    await expect(page.locator('[data-testid="organization"], .card:has(h3:text("Organization"))')).toBeVisible();
    await expect(page.locator('[data-testid="pricing"], .card:has(h3:text("Pricing"))')).toBeVisible();
    await expect(page.locator('[data-testid="media"], .card:has(h3:text("Product Media"))')).toBeVisible();

    // Verify all required form fields are present
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#description')).toBeVisible();
    await expect(page.locator('#sellingPrice')).toBeVisible();
    await expect(page.locator('#stockQuantity')).toBeVisible();
    await expect(page.locator('#minimumOrder')).toBeVisible();

    // Verify dropdowns are present
    await expect(page.locator('button[role="combobox"]:has-text("Select a category")')).toBeVisible();
    await expect(page.locator('button[role="combobox"]:has-text("Select a brand")')).toBeVisible();

    // Verify color and size options are present
    await expect(page.locator('#color-Black')).toBeVisible();
    await expect(page.locator('#size-S')).toBeVisible();

    // Verify action buttons are present
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('a:has-text("Cancel"), button:has-text("Cancel")')).toBeVisible();
  });

  test('should handle file upload for thumbnail and color images', async ({ page }) => {
    await navigateToAddProduct(page);

    // Test thumbnail upload
    const thumbnailInput = page.locator('#thumbnail-upload');
    if (await thumbnailInput.isVisible()) {
      await page.setInputFiles('#thumbnail-upload', {
        name: 'thumbnail.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake image data')
      });

      // Check if preview appears
      await expect(page.locator('img[alt*="preview"], img[alt*="Thumbnail"]')).toBeVisible();
    }

    // Test color image uploads
    // First select a color to enable color image upload
    await page.check('#color-Blue');
    
    // Check if color image upload section appears
    const colorImageInput = page.locator('#color-image-Blue');
    if (await colorImageInput.isVisible()) {
      await page.setInputFiles('#color-image-Blue', {
        name: 'blue-variant.jpg',
        mimeType: 'image/jpeg', 
        buffer: Buffer.from('blue variant image data')
      });
    }
  });

  test('should navigate back to products list', async ({ page }) => {
    await navigateToAddProduct(page);

    // Click the "Back to Products" button
    await page.click('a:has-text("Back to Products")');

    // Should navigate back to products list
    await expect(page).toHaveURL(/\/admin\/products/);
  });
});

test.describe('Admin Authentication', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    // Try to access admin add product page without authentication
    await page.goto('/admin/add-product');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('should login with correct credentials', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('#email', ADMIN_CREDENTIALS.email);
    await page.fill('#password', ADMIN_CREDENTIALS.password);
    await page.click('button[type="submit"]');

    // Should redirect to admin dashboard
    await page.waitForURL(/\/admin/);
    await expect(page).toHaveURL(/\/admin/);
  });

  test('should show error with incorrect credentials', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('#email', 'wrong@example.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('[role="alert"], .alert-destructive')).toBeVisible();
  });
});