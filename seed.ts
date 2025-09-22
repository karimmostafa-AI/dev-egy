import { db } from "./server/db";
import { categories, brands, products, productImages } from "./server/db";
import { randomUUID } from "crypto";

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");
    
    // Clear existing data (in correct order to avoid foreign key constraints)
    await db.delete(productImages);
    await db.delete(products);
    await db.delete(categories);
    await db.delete(brands);
    
    console.log("Existing data cleared.");
    
    // Seed categories
    console.log("Seeding categories...");
    const categoryData = [
      { name: "Scrubs", slug: "scrubs", description: "Medical scrubs for healthcare professionals" },
      { name: "Lab Coats", slug: "lab-coats", description: "Professional lab coats for medical practitioners" },
      { name: "Shoes", slug: "shoes", description: "Comfortable and slip-resistant medical shoes" },
      { name: "Accessories", slug: "accessories", description: "Medical accessories and equipment" },
    ];
    
    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`Inserted ${insertedCategories.length} categories.`);
    
    // Seed brands
    console.log("Seeding brands...");
    const brandData = [
      { name: "Cherokee", slug: "cherokee", description: "Quality medical uniforms and scrubs" },
      { name: "Barco", slug: "barco", description: "Innovative healthcare apparel" },
      { name: "WonderWink", slug: "wonderwink", description: "Fashion-forward medical wear" },
      { name: "Healing Hands", slug: "healing-hands", description: "Premium medical apparel" },
      { name: "Greys Anatomy", slug: "greys-anatomy", description: "Inspired by the popular TV show" },
      { name: "Dickies", slug: "dickies", description: "Durable workwear and medical uniforms" },
      { name: "Landau", slug: "landau", description: "Professional medical clothing" },
      { name: "Koi", slug: "koi", description: "Comfortable and stylish medical wear" },
      { name: "Uniform Advantage", slug: "uniform-advantage", description: "High-quality medical uniforms" },
      { name: "FIGS", slug: "figs", description: "Premium medical apparel with modern design" },
    ];
    
    const insertedBrands = await db.insert(brands).values(brandData).returning();
    console.log(`Inserted ${insertedBrands.length} brands.`);
    
    // Seed products (using the sample data but adapting to database schema)
    console.log("Seeding products...");
    const sampleProducts = [
      {
        name: "Cherokee Revolution V-Neck Top",
        slug: "cherokee-revolution-v-neck-top",
        description: "The Cherokee Revolution V-Neck Top combines comfort, style, and functionality. Made with innovative moisture-wicking fabric, this piece keeps you cool and dry throughout your shift. Features multiple pockets for all your essentials.",
        shortDescription: "Moisture-wicking scrub top with multiple pockets",
        sku: "CHR-REV-VNK-001",
        price: "24.99",
        comparePrice: "29.99",
        inventoryQuantity: 100,
        categoryId: insertedCategories[0].id, // Scrubs
        brandId: insertedBrands[0].id, // Cherokee
      },
      {
        name: "Barco One Cargo Scrub Pants",
        slug: "barco-one-cargo-scrub-pants",
        description: "Barco One Cargo Scrub Pants offer ultimate comfort and functionality. Designed with healthcare professionals in mind, these pants feature a modern fit and practical cargo pockets.",
        shortDescription: "Comfortable cargo scrub pants with modern fit",
        sku: "BAR-ONE-CRG-001",
        price: "35.99",
        comparePrice: "39.99",
        inventoryQuantity: 85,
        categoryId: insertedCategories[0].id, // Scrubs
        brandId: insertedBrands[1].id, // Barco
      },
      {
        name: "WonderWink Renew Cargo Pant",
        slug: "wonderwink-renew-cargo-pant",
        description: "WonderWink Renew Cargo Pants combine style and functionality with a flattering fit. These pants feature comfortable stretch fabric and practical cargo pockets.",
        shortDescription: "Flattering cargo pants with stretch fabric",
        sku: "WON-REN-CRG-001",
        price: "27.99",
        inventoryQuantity: 90,
        categoryId: insertedCategories[0].id, // Scrubs
        brandId: insertedBrands[2].id, // WonderWink
      },
      {
        name: "Healing Hands Purple Label Top",
        slug: "healing-hands-purple-label-top",
        description: "Healing Hands Purple Label Top offers premium quality and comfort. Designed with healthcare professionals in mind, this top features moisture-wicking fabric and a flattering fit.",
        shortDescription: "Premium scrub top with moisture-wicking fabric",
        sku: "HEA-PUR-VNK-001",
        price: "22.99",
        comparePrice: "26.99",
        inventoryQuantity: 75,
        categoryId: insertedCategories[0].id, // Scrubs
        brandId: insertedBrands[3].id, // Healing Hands
      },
      {
        name: "Greys Anatomy Signature Series",
        slug: "greys-anatomy-signature-series",
        description: "Inspired by the popular TV show, the Greys Anatomy Signature Series offers premium medical apparel with a fashionable twist. Perfect for healthcare professionals who want to look good while providing excellent care.",
        shortDescription: "Fashionable medical apparel inspired by Grey's Anatomy",
        sku: "GRE-SIG-SET-001",
        price: "32.99",
        inventoryQuantity: 60,
        categoryId: insertedCategories[0].id, // Scrubs
        brandId: insertedBrands[4].id, // Greys Anatomy
      },
      {
        name: "Dickies Dynamix V-Neck Top",
        slug: "dickies-dynamix-v-neck-top",
        description: "Dickies Dynamix V-Neck Top combines durability with comfort. Made with high-quality fabric that withstands frequent washing while maintaining its shape and color.",
        shortDescription: "Durable scrub top with moisture management",
        sku: "DIC-DYN-VNK-001",
        price: "19.99",
        comparePrice: "23.99",
        inventoryQuantity: 120,
        categoryId: insertedCategories[0].id, // Scrubs
        brandId: insertedBrands[5].id, // Dickies
      },
      {
        name: "Landau Proflex Modern Jogger",
        slug: "landau-proflex-modern-jogger",
        description: "Landau Proflex Modern Joggers offer ultimate comfort with a professional look. These joggers feature stretch fabric and a modern design that's perfect for long shifts.",
        shortDescription: "Comfortable jogger-style medical pants",
        sku: "LAN-PRO-JOG-001",
        price: "26.99",
        inventoryQuantity: 70,
        categoryId: insertedCategories[0].id, // Scrubs
        brandId: insertedBrands[6].id, // Landau
      },
      {
        name: "Koi Lite Peace Cargo Pants",
        slug: "koi-lite-peace-cargo-pants",
        description: "Koi Lite Peace Cargo Pants combine comfort with functionality. These lightweight pants are perfect for warmer climates or those who prefer a lighter feel during long shifts.",
        shortDescription: "Lightweight cargo pants for warm weather",
        sku: "KOI-LIT-CRG-001",
        price: "29.99",
        comparePrice: "34.99",
        inventoryQuantity: 80,
        categoryId: insertedCategories[0].id, // Scrubs
        brandId: insertedBrands[7].id, // Koi
      },
      {
        name: "UA Butter-Soft Men's V-Neck",
        slug: "ua-buttersoft-mens-v-neck",
        description: "Uniform Advantage Butter-Soft Men's V-Neck offers exceptional comfort with its buttery-soft fabric. Designed for healthcare professionals who demand both comfort and style.",
        shortDescription: "Exceptionally soft scrub top for men",
        sku: "UNI-BUT-VNK-001",
        price: "19.99",
        comparePrice: "24.99",
        inventoryQuantity: 110,
        categoryId: insertedCategories[0].id, // Scrubs
        brandId: insertedBrands[8].id, // Uniform Advantage
      },
      {
        name: "FIGS Technical Collection Top",
        slug: "figs-technical-collection-top",
        description: "FIGS Technical Collection Top represents the pinnacle of medical apparel design. These tops feature advanced fabric technology for superior comfort, moisture management, and durability.",
        shortDescription: "Advanced technical fabric scrub top",
        sku: "FIG-TEC-TOP-001",
        price: "38.99",
        inventoryQuantity: 50,
        categoryId: insertedCategories[0].id, // Scrubs
        brandId: insertedBrands[9].id, // FIGS
      },
      {
        name: "Professional Lab Coat",
        slug: "professional-lab-coat",
        description: "Our Professional Lab Coat is designed for medical practitioners who need a clean, professional look. Made with high-quality fabric that's easy to clean and maintain.",
        shortDescription: "Classic professional lab coat",
        sku: "LAB-PRO-WHI-001",
        price: "49.99",
        inventoryQuantity: 40,
        categoryId: insertedCategories[1].id, // Lab Coats
        brandId: insertedBrands[8].id, // Uniform Advantage
      },
      {
        name: "Slip-Resistant Medical Shoes",
        slug: "slip-resistant-medical-shoes",
        description: "Our Slip-Resistant Medical Shoes provide the comfort and safety you need during long shifts. Designed with healthcare professionals in mind, these shoes offer superior support and traction.",
        shortDescription: "Comfortable slip-resistant medical shoes",
        sku: "SHO-SLI-BLK-001",
        price: "59.99",
        inventoryQuantity: 35,
        categoryId: insertedCategories[2].id, // Shoes
        brandId: insertedBrands[1].id, // Barco
      },
      {
        name: "Medical Stethoscope",
        slug: "medical-stethoscope",
        description: "Premium quality medical stethoscope for accurate diagnostics. Features a dual-head design and tunable diaphragm for versatile use.",
        shortDescription: "Professional dual-head stethoscope",
        sku: "ACC-STH-TUN-001",
        price: "89.99",
        inventoryQuantity: 25,
        categoryId: insertedCategories[3].id, // Accessories
        brandId: insertedBrands[0].id, // Cherokee
      },
    ];
    
    const insertedProducts = await db.insert(products).values(sampleProducts).returning();
    console.log(`Inserted ${insertedProducts.length} products.`);
    
    // Seed product images
    console.log("Seeding product images...");
    const productImagesData = insertedProducts.map(product => ({
      productId: product.id,
      url: "/images/placeholder-product.jpg",
      alt: `${product.name} - Product Image`,
      isPrimary: true,
      sortOrder: 0,
    }));
    
    const insertedImages = await db.insert(productImages).values(productImagesData).returning();
    console.log(`Inserted ${insertedImages.length} product images.`);
    
    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();