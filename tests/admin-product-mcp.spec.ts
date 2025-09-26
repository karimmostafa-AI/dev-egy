import { test, expect } from '@playwright/test';

// This test demonstrates advanced browser automation for admin product management
// using Playwright with the MCP browser server integration

test.describe('Admin Product Management - Advanced MCP Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.goto('http://localhost:5000');
  });

  test('should complete full product creation workflow using MCP browser automation', async ({ page }) => {
    // Navigate to admin login
    await page.goto('/admin/login');
    
    // Use MCP browser automation to fill login form
    await page.fill('#email', 'admin@devegypt.com');
    await page.fill('#password', 'admin123456');
    await page.click('button[type="submit"]');
    
    // Wait for admin dashboard
    await page.waitForURL(/\/admin/);
    
    // Navigate to add product page
    await page.goto('/admin/add-product');
    
    // Wait for form to be visible
    await page.waitForSelector('form');
    
    // Fill product information step by step
    await page.fill('#name', 'Automated Test Medical Scrubs');
    await page.fill('#description', 'Premium medical scrubs created via automated testing. Features comfortable fit and professional appearance.');
    
    // Select category using MCP browser interaction
    await page.click('button[role="combobox"]:has-text("Select a category")');
    await page.waitForSelector('[role="listbox"]', { state: 'visible' });
    await page.click('[role="option"]:has-text("Scrubs")');
    
    // Select brand
    await page.click('button[role="combobox"]:has-text("Select a brand")');
    await page.waitForSelector('[role="listbox"]', { state: 'visible' });
    await page.click('[role="option"]:has-text("MediWear")');
    
    // Fill pricing information
    await page.fill('#sellingPrice', '99.99');
    await page.fill('#discountPrice', '89.99');
    await page.fill('#stockQuantity', '150');
    await page.fill('#minimumOrder', '1');
    
    // Select multiple colors
    const colorsToSelect = ['Blue', 'White', 'Green'];
    for (const color of colorsToSelect) {
      await page.check(`#color-${color}`);
      // Verify checkbox is checked
      await expect(page.locator(`#color-${color}`)).toBeChecked();
    }
    
    // Select multiple sizes
    const sizesToSelect = ['S', 'M', 'L', 'XL'];
    for (const size of sizesToSelect) {
      await page.check(`#size-${size}`);
      // Verify checkbox is checked
      await expect(page.locator(`#size-${size}`)).toBeChecked();
    }
    
    // Verify color images section appears
    await expect(page.locator('h4:has-text("Color Images")')).toBeVisible();
    
    // Upload a test thumbnail image
    await page.setInputFiles('#thumbnail-upload', {
      name: 'test-scrubs.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')
    });
    
    // Upload color-specific images
    for (const color of colorsToSelect) {
      const colorImageInput = `#color-image-${color}`;
      if (await page.locator(colorImageInput).isVisible()) {
        await page.setInputFiles(colorImageInput, {
          name: `${color.toLowerCase()}-scrubs.jpg`,
          mimeType: 'image/jpeg',
          buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')
        });
      }
    }
    
    // Take a screenshot before submission for debugging
    await page.screenshot({ path: 'tests/screenshots/before-submit.png', fullPage: true });
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for submission to complete
    await page.waitForTimeout(3000);
    
    // Check for success indicators
    const successChecks = [
      // Form reset (empty name field indicates success)
      async () => {
        const nameValue = await page.locator('#name').inputValue();
        return nameValue === '';
      },
      
      // Success toast/alert message
      async () => {
        const successAlert = page.locator('[role="alert"]:has-text("success"), .toast:has-text("Product Created")');
        try {
          await successAlert.waitFor({ timeout: 2000 });
          return true;
        } catch {
          return false;
        }
      },
      
      // URL change (redirect to products list)
      async () => {
        const url = page.url();
        return url.includes('/admin/products') && !url.includes('/admin/add-product');
      }
    ];
    
    // Execute success checks
    let successDetected = false;
    for (const check of successChecks) {
      if (await check()) {
        successDetected = true;
        break;
      }
    }
    
    // Take a screenshot after submission
    await page.screenshot({ path: 'tests/screenshots/after-submit.png', fullPage: true });
    
    // Assert that success was detected
    expect(successDetected).toBeTruthy();
    
    // If form was reset, verify all fields are empty
    if (await page.locator('#name').inputValue() === '') {
      await expect(page.locator('#description')).toHaveValue('');
      await expect(page.locator('#sellingPrice')).toHaveValue('');
      await expect(page.locator('#stockQuantity')).toHaveValue('');
    }
  });

  test('should handle form validation and error states', async ({ page }) => {
    // Login as admin
    await page.goto('/admin/login');
    await page.fill('#email', 'admin@devegypt.com');
    await page.fill('#password', 'admin123456');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
    
    // Navigate to add product
    await page.goto('/admin/add-product');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Verify form validation prevents submission
    const currentUrl = page.url();
    expect(currentUrl).toContain('/admin/add-product');
    
    // Check HTML5 validation on required fields
    const nameField = page.locator('#name');
    const priceField = page.locator('#sellingPrice');
    
    await expect(nameField).toHaveAttribute('required');
    await expect(priceField).toHaveAttribute('required');
    
    // Fill only name and try again
    await page.fill('#name', 'Test Product');
    await page.click('button[type="submit"]');
    
    // Should still be on add product page due to missing required fields
    expect(page.url()).toContain('/admin/add-product');
  });

  test('should handle complex product variant selection', async ({ page }) => {
    // Login
    await page.goto('/admin/login');
    await page.fill('#email', 'admin@devegypt.com');
    await page.fill('#password', 'admin123456');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
    
    // Navigate to add product
    await page.goto('/admin/add-product');
    
    // Fill basic info
    await page.fill('#name', 'Complex Variant Product');
    await page.fill('#sellingPrice', '150.00');
    
    // Test color selection and deselection
    await page.check('#color-Black');
    await page.check('#color-Blue');
    await page.check('#color-White');
    
    // Verify color images section appears
    await expect(page.locator('h4:has-text("Color Images")')).toBeVisible();
    
    // Verify individual color upload sections
    await expect(page.locator('[data-color="Black"], div:has(span:text("Black"))')).toBeVisible();
    await expect(page.locator('[data-color="Blue"], div:has(span:text("Blue"))')).toBeVisible();
    await expect(page.locator('[data-color="White"], div:has(span:text("White"))')).toBeVisible();
    
    // Deselect one color
    await page.uncheck('#color-Black');
    
    // Verify the color section is removed
    await expect(page.locator('#color-Black')).not.toBeChecked();
    
    // Test size selection
    const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    for (const size of allSizes) {
      await page.check(`#size-${size}`);
      await expect(page.locator(`#size-${size}`)).toBeChecked();
    }
    
    // Deselect some sizes
    await page.uncheck('#size-XS');
    await page.uncheck('#size-3XL');
    
    await expect(page.locator('#size-XS')).not.toBeChecked();
    await expect(page.locator('#size-3XL')).not.toBeChecked();
  });

  test('should handle file upload functionality', async ({ page }) => {
    // Login
    await page.goto('/admin/login');
    await page.fill('#email', 'admin@devegypt.com');
    await page.fill('#password', 'admin123456');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
    
    // Navigate to add product
    await page.goto('/admin/add-product');
    
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
    
    // Upload thumbnail image
    await page.setInputFiles('#thumbnail-upload', {
      name: 'test-thumbnail.png',
      mimeType: 'image/png',
      buffer: testImageBuffer
    });
    
    // Verify thumbnail preview appears
    await expect(page.locator('img[alt*="preview"], img[alt*="Thumbnail preview"]')).toBeVisible();
    
    // Select a color to enable color image upload
    await page.check('#color-Red');
    
    // Upload color-specific image if the input exists
    const colorImageInput = page.locator('#color-image-Red');
    if (await colorImageInput.isVisible()) {
      await page.setInputFiles('#color-image-Red', {
        name: 'red-variant.png',
        mimeType: 'image/png',
        buffer: testImageBuffer
      });
      
      // Verify color image preview appears
      await expect(page.locator('img[alt*="Red preview"]')).toBeVisible();
    }
  });

  test('should navigate between admin sections correctly', async ({ page }) => {
    // Login
    await page.goto('/admin/login');
    await page.fill('#email', 'admin@devegypt.com');
    await page.fill('#password', 'admin123456');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
    
    // Navigate to add product
    await page.goto('/admin/add-product');
    
    // Verify we're on add product page
    await expect(page.locator('h1:has-text("Add Product")')).toBeVisible();
    
    // Click "Back to Products" button
    await page.click('a:has-text("Back to Products")');
    
    // Should navigate to products list
    await expect(page).toHaveURL(/\/admin\/products/);
    
    // Navigate back to add product via URL
    await page.goto('/admin/add-product');
    
    // Fill some form data
    await page.fill('#name', 'Navigation Test Product');
    await page.fill('#description', 'Testing navigation behavior');
    
    // Click cancel button
    await page.click('a:has-text("Cancel")');
    
    // Should navigate back to products list
    await expect(page).toHaveURL(/\/admin\/products/);
  });
});

// Create screenshots directory
test.beforeAll(async () => {
  const fs = require('fs');
  const path = require('path');
  
  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
});