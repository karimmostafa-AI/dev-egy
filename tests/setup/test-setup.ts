import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { users, categories, brands, products } from '../../shared/schema-sqlite';

/**
 * Test setup utilities for creating test data and admin users
 * Used by Playwright tests to ensure consistent test environment
 */

export interface TestSetupConfig {
  databasePath?: string;
  adminEmail?: string;
  adminPassword?: string;
}

export class TestSetup {
  private db: any;
  private sqlite: Database.Database;

  constructor(config: TestSetupConfig = {}) {
    const dbPath = config.databasePath || './dev-egypt.db';
    this.sqlite = new Database(dbPath);
    this.db = drizzle(this.sqlite);
  }

  /**
   * Creates admin user for testing
   */
  async createAdminUser(email: string = 'admin@devegypt.com', password: string = 'admin123456') {
    try {
      // Check if admin user already exists
      const existingUser = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        console.log(`Admin user ${email} already exists`);
        return existingUser[0];
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create admin user
      const newUser = await this.db
        .insert(users)
        .values({
          email,
          passwordHash,
          fullName: 'Test Admin User',
          role: 'admin'
        })
        .returning();

      console.log(`Created admin user: ${email}`);
      return newUser[0];
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }
  }

  /**
   * Seeds test categories
   */
  async seedCategories() {
    const testCategories = [
      { name: 'Scrubs', slug: 'scrubs', description: 'Medical scrubs and uniforms' },
      { name: 'Lab Coats', slug: 'lab-coats', description: 'Professional lab coats' },
      { name: 'Shoes', slug: 'shoes', description: 'Medical and nursing shoes' },
      { name: 'Accessories', slug: 'accessories', description: 'Medical accessories' }
    ];

    try {
      for (const category of testCategories) {
        // Check if category exists
        const existing = await this.db
          .select()
          .from(categories)
          .where(eq(categories.slug, category.slug))
          .limit(1);

        if (existing.length === 0) {
          await this.db.insert(categories).values(category);
          console.log(`Created category: ${category.name}`);
        }
      }
    } catch (error) {
      console.error('Error seeding categories:', error);
      throw error;
    }
  }

  /**
   * Seeds test brands
   */
  async seedBrands() {
    const testBrands = [
      { name: 'MediWear', slug: 'mediwear', description: 'Premium medical apparel' },
      { name: 'NursePro', slug: 'nursepro', description: 'Professional nursing uniforms' },
      { name: 'ComfortFeet', slug: 'comfortfeet', description: 'Comfortable medical footwear' },
      { name: 'SafeGuard', slug: 'safeguard', description: 'Safety and protection gear' }
    ];

    try {
      for (const brand of testBrands) {
        // Check if brand exists
        const existing = await this.db
          .select()
          .from(brands)
          .where(eq(brands.slug, brand.slug))
          .limit(1);

        if (existing.length === 0) {
          await this.db.insert(brands).values(brand);
          console.log(`Created brand: ${brand.name}`);
        }
      }
    } catch (error) {
      console.error('Error seeding brands:', error);
      throw error;
    }
  }

  /**
   * Creates test products for testing
   */
  async createTestProducts() {
    const testProducts = [
      {
        name: 'Test Medical Scrub Set',
        slug: 'test-medical-scrub-set',
        sku: 'TEST-001',
        description: 'High-quality test medical scrub set',
        price: 89.99,
        comparePrice: 99.99,
        inventoryQuantity: 100,
        isAvailable: true,
        isFeatured: false
      },
      {
        name: 'Test Lab Coat',
        slug: 'test-lab-coat',
        sku: 'TEST-002', 
        description: 'Professional test lab coat',
        price: 149.99,
        inventoryQuantity: 50,
        isAvailable: true,
        isFeatured: true
      }
    ];

    try {
      for (const product of testProducts) {
        // Check if product exists
        const existing = await this.db
          .select()
          .from(products)
          .where(eq(products.sku, product.sku))
          .limit(1);

        if (existing.length === 0) {
          await this.db.insert(products).values(product);
          console.log(`Created test product: ${product.name}`);
        }
      }
    } catch (error) {
      console.error('Error creating test products:', error);
      throw error;
    }
  }

  /**
   * Cleans up test data (use carefully!)
   */
  async cleanupTestData() {
    try {
      // Delete test products
      await this.db
        .delete(products)
        .where(like(products.sku, 'TEST-%'));

      // Delete test admin users (except default)
      await this.db
        .delete(users)
        .where(and(
          eq(users.role, 'admin'),
          ne(users.email, 'admin@devegypt.com')
        ));

      console.log('Test data cleanup completed');
    } catch (error) {
      console.error('Error cleaning up test data:', error);
      throw error;
    }
  }

  /**
   * Complete test environment setup
   */
  async setupTestEnvironment() {
    console.log('Setting up test environment...');
    
    try {
      await this.createAdminUser();
      await this.seedCategories();
      await this.seedBrands();
      await this.createTestProducts();
      
      console.log('Test environment setup completed successfully');
    } catch (error) {
      console.error('Failed to setup test environment:', error);
      throw error;
    }
  }

  /**
   * Verifies test environment is ready
   */
  async verifyTestEnvironment() {
    try {
      // Check admin user exists
      const adminUser = await this.db
        .select()
        .from(users)
        .where(eq(users.email, 'admin@devegypt.com'))
        .limit(1);

      if (adminUser.length === 0) {
        throw new Error('Admin user not found');
      }

      // Check categories exist
      const categoriesCount = await this.db
        .select({ count: count() })
        .from(categories);

      if (categoriesCount[0].count < 4) {
        throw new Error('Insufficient categories found');
      }

      // Check brands exist
      const brandsCount = await this.db
        .select({ count: count() })
        .from(brands);

      if (brandsCount[0].count < 4) {
        throw new Error('Insufficient brands found');
      }

      console.log('Test environment verification passed');
      return true;
    } catch (error) {
      console.error('Test environment verification failed:', error);
      return false;
    }
  }

  /**
   * Gets test data for use in tests
   */
  async getTestData() {
    try {
      const adminUser = await this.db
        .select()
        .from(users)
        .where(eq(users.email, 'admin@devegypt.com'))
        .limit(1);

      const categoriesList = await this.db
        .select()
        .from(categories)
        .limit(10);

      const brandsList = await this.db
        .select()
        .from(brands)
        .limit(10);

      return {
        adminUser: adminUser[0],
        categories: categoriesList,
        brands: brandsList
      };
    } catch (error) {
      console.error('Error getting test data:', error);
      throw error;
    }
  }

  /**
   * Closes database connection
   */
  close() {
    this.sqlite.close();
  }
}

// Helper functions for direct use
export async function setupTestEnvironment(config?: TestSetupConfig) {
  const setup = new TestSetup(config);
  try {
    await setup.setupTestEnvironment();
    const isValid = await setup.verifyTestEnvironment();
    return isValid;
  } finally {
    setup.close();
  }
}

export async function createTestAdmin(email?: string, password?: string) {
  const setup = new TestSetup();
  try {
    return await setup.createAdminUser(email, password);
  } finally {
    setup.close();
  }
}

export async function cleanupTestData() {
  const setup = new TestSetup();
  try {
    await setup.cleanupTestData();
  } finally {
    setup.close();
  }
}

// CLI usage
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  const args = process.argv.slice(2);
  const command = args[0];

  async function runCommand() {
    switch (command) {
      case 'setup':
        await setupTestEnvironment();
        break;
      case 'create-admin':
        const email = args[1] || 'admin@devegypt.com';
        const password = args[2] || 'admin123456';
        await createTestAdmin(email, password);
        break;
      case 'cleanup':
        await cleanupTestData();
        break;
      default:
        console.log('Usage: tsx test-setup.ts [setup|create-admin|cleanup]');
        console.log('  setup: Complete test environment setup');
        console.log('  create-admin [email] [password]: Create admin user');
        console.log('  cleanup: Remove test data');
    }
  }

  runCommand().catch(console.error);
}