import { eq, and, desc, asc } from "drizzle-orm";
import { 
  db, 
  productOptions, 
  productOptionValues, 
  productVariants, 
  productVariantOptionValues,
  products 
} from "../db";
import { 
  InsertProductOption,
  UpdateProductOption,
  ProductOption,
  InsertProductOptionValue,
  UpdateProductOptionValue,
  ProductOptionValue,
  InsertProductVariant,
  UpdateProductVariant,
  ProductVariant,
  InsertProductVariantOptionValue,
  ProductVariantOptionValue
} from "@shared/schema";

export interface ProductOptionWithValues extends ProductOption {
  values: ProductOptionValue[];
}

export interface ProductVariantWithOptions extends ProductVariant {
  optionValues: Array<{
    optionValue: ProductOptionValue;
    option: ProductOption;
  }>;
}

export interface CreateProductOptionRequest {
  name: string;
  displayName: string;
  sortOrder?: number;
  values: Array<{
    value: string;
    displayValue: string;
    sortOrder?: number;
  }>;
}

export interface CreateProductVariantRequest extends Omit<InsertProductVariant, 'productId'> {
  optionValueIds: string[];
}

export class ProductOptionsService {
  /**
   * Get all options for a product with their values
   */
  async getProductOptions(productId: string): Promise<ProductOptionWithValues[]> {
    try {
      // Get all options for the product
      const options = await db
        .select()
        .from(productOptions)
        .where(eq(productOptions.productId, productId))
        .orderBy(asc(productOptions.sortOrder), asc(productOptions.displayName));

      // Get all option values for these options
      const optionsWithValues: ProductOptionWithValues[] = [];
      
      for (const option of options) {
        const values = await db
          .select()
          .from(productOptionValues)
          .where(eq(productOptionValues.optionId, option.id))
          .orderBy(asc(productOptionValues.sortOrder), asc(productOptionValues.displayValue));

        optionsWithValues.push({
          ...option,
          values
        });
      }

      return optionsWithValues;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get product options: ${error.message}`);
      }
      throw new Error("Failed to get product options due to an unexpected error.");
    }
  }

  /**
   * Create a new product option with values
   */
  async createProductOption(productId: string, optionData: CreateProductOptionRequest): Promise<ProductOptionWithValues> {
    try {
      // Verify product exists
      const product = await db.select().from(products).where(eq(products.id, productId)).limit(1);
      if (!product.length) {
        throw new Error("Product not found");
      }

      // Create the option
      const [option] = await db
        .insert(productOptions)
        .values({
          productId,
          name: optionData.name,
          displayName: optionData.displayName,
          sortOrder: optionData.sortOrder || 0
        })
        .returning();

      // Create option values
      const values: ProductOptionValue[] = [];
      for (const valueData of optionData.values) {
        const [value] = await db
          .insert(productOptionValues)
          .values({
            optionId: option.id,
            value: valueData.value,
            displayValue: valueData.displayValue,
            sortOrder: valueData.sortOrder || 0
          })
          .returning();
        values.push(value);
      }

      return {
        ...option,
        values
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create product option: ${error.message}`);
      }
      throw new Error("Failed to create product option due to an unexpected error.");
    }
  }

  /**
   * Update a product option
   */
  async updateProductOption(productId: string, optionId: string, optionData: UpdateProductOption): Promise<ProductOption> {
    try {
      // Verify option exists and belongs to product
      const existingOption = await db
        .select()
        .from(productOptions)
        .where(and(eq(productOptions.id, optionId), eq(productOptions.productId, productId)))
        .limit(1);

      if (!existingOption.length) {
        throw new Error("Product option not found");
      }

      const [updatedOption] = await db
        .update(productOptions)
        .set(optionData)
        .where(eq(productOptions.id, optionId))
        .returning();

      return updatedOption;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update product option: ${error.message}`);
      }
      throw new Error("Failed to update product option due to an unexpected error.");
    }
  }

  /**
   * Delete a product option and all its values
   */
  async deleteProductOption(productId: string, optionId: string): Promise<void> {
    try {
      // Verify option exists and belongs to product
      const existingOption = await db
        .select()
        .from(productOptions)
        .where(and(eq(productOptions.id, optionId), eq(productOptions.productId, productId)))
        .limit(1);

      if (!existingOption.length) {
        throw new Error("Product option not found");
      }

      // Delete option values first (CASCADE should handle this, but being explicit)
      await db.delete(productOptionValues).where(eq(productOptionValues.optionId, optionId));
      
      // Delete the option
      await db.delete(productOptions).where(eq(productOptions.id, optionId));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete product option: ${error.message}`);
      }
      throw new Error("Failed to delete product option due to an unexpected error.");
    }
  }

  /**
   * Get all variants for a product with their option combinations
   */
  async getProductVariants(productId: string): Promise<ProductVariantWithOptions[]> {
    try {
      // Get all variants for the product
      const variants = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, productId))
        .orderBy(asc(productVariants.sortOrder), asc(productVariants.sku));

      // Get option combinations for each variant
      const variantsWithOptions: ProductVariantWithOptions[] = [];
      
      for (const variant of variants) {
        // Get all option value mappings for this variant
        const optionValueMappings = await db
          .select({
            optionValue: productOptionValues,
            option: productOptions
          })
          .from(productVariantOptionValues)
          .innerJoin(productOptionValues, eq(productVariantOptionValues.optionValueId, productOptionValues.id))
          .innerJoin(productOptions, eq(productOptionValues.optionId, productOptions.id))
          .where(eq(productVariantOptionValues.variantId, variant.id))
          .orderBy(asc(productOptions.sortOrder), asc(productOptionValues.sortOrder));

        variantsWithOptions.push({
          ...variant,
          optionValues: optionValueMappings
        });
      }

      return variantsWithOptions;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get product variants: ${error.message}`);
      }
      throw new Error("Failed to get product variants due to an unexpected error.");
    }
  }

  /**
   * Create a new product variant with option mapping
   */
  async createProductVariant(productId: string, variantData: CreateProductVariantRequest): Promise<ProductVariantWithOptions> {
    try {
      // Verify product exists
      const product = await db.select().from(products).where(eq(products.id, productId)).limit(1);
      if (!product.length) {
        throw new Error("Product not found");
      }

      // Verify all option values exist and belong to the product
      for (const optionValueId of variantData.optionValueIds) {
        const optionValueCheck = await db
          .select({
            optionValue: productOptionValues,
            option: productOptions
          })
          .from(productOptionValues)
          .innerJoin(productOptions, eq(productOptionValues.optionId, productOptions.id))
          .where(and(
            eq(productOptionValues.id, optionValueId),
            eq(productOptions.productId, productId)
          ))
          .limit(1);

        if (!optionValueCheck.length) {
          throw new Error(`Option value ${optionValueId} not found or doesn't belong to this product`);
        }
      }

      // Create the variant
      const { optionValueIds, ...variantCreateData } = variantData;
      const [variant] = await db
        .insert(productVariants)
        .values({
          ...variantCreateData,
          productId,
          // Convert numeric fields to strings for database
          price: variantCreateData.price ? variantCreateData.price.toString() : undefined,
          comparePrice: variantCreateData.comparePrice ? variantCreateData.comparePrice.toString() : undefined,
          costPerItem: variantCreateData.costPerItem ? variantCreateData.costPerItem.toString() : undefined,
          weight: variantCreateData.weight ? variantCreateData.weight.toString() : undefined
        })
        .returning();

      // Create option value mappings
      for (const optionValueId of optionValueIds) {
        await db
          .insert(productVariantOptionValues)
          .values({
            variantId: variant.id,
            optionValueId
          });
      }

      // Return the variant with its options
      const variantWithOptions = await this.getVariantWithOptions(variant.id);
      return variantWithOptions!;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create product variant: ${error.message}`);
      }
      throw new Error("Failed to create product variant due to an unexpected error.");
    }
  }

  /**
   * Update a product variant
   */
  async updateProductVariant(productId: string, variantId: string, variantData: UpdateProductVariant): Promise<ProductVariant> {
    try {
      // Verify variant exists and belongs to product
      const existingVariant = await db
        .select()
        .from(productVariants)
        .where(and(eq(productVariants.id, variantId), eq(productVariants.productId, productId)))
        .limit(1);

      if (!existingVariant.length) {
        throw new Error("Product variant not found");
      }

      const [updatedVariant] = await db
        .update(productVariants)
        .set({
          ...variantData,
          // Convert numeric fields to strings for database
          price: variantData.price ? variantData.price.toString() : undefined,
          comparePrice: variantData.comparePrice ? variantData.comparePrice.toString() : undefined,
          costPerItem: variantData.costPerItem ? variantData.costPerItem.toString() : undefined,
          weight: variantData.weight ? variantData.weight.toString() : undefined
        })
        .where(eq(productVariants.id, variantId))
        .returning();

      return updatedVariant;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update product variant: ${error.message}`);
      }
      throw new Error("Failed to update product variant due to an unexpected error.");
    }
  }

  /**
   * Delete a product variant and its option mappings
   */
  async deleteProductVariant(productId: string, variantId: string): Promise<void> {
    try {
      // Verify variant exists and belongs to product
      const existingVariant = await db
        .select()
        .from(productVariants)
        .where(and(eq(productVariants.id, variantId), eq(productVariants.productId, productId)))
        .limit(1);

      if (!existingVariant.length) {
        throw new Error("Product variant not found");
      }

      // Delete option value mappings first
      await db.delete(productVariantOptionValues).where(eq(productVariantOptionValues.variantId, variantId));
      
      // Delete the variant
      await db.delete(productVariants).where(eq(productVariants.id, variantId));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete product variant: ${error.message}`);
      }
      throw new Error("Failed to delete product variant due to an unexpected error.");
    }
  }

  /**
   * Update variant stock levels
   */
  async updateVariantStock(variantId: string, quantity: number): Promise<ProductVariant> {
    try {
      const [updatedVariant] = await db
        .update(productVariants)
        .set({ inventoryQuantity: quantity })
        .where(eq(productVariants.id, variantId))
        .returning();

      if (!updatedVariant) {
        throw new Error("Product variant not found");
      }

      return updatedVariant;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update variant stock: ${error.message}`);
      }
      throw new Error("Failed to update variant stock due to an unexpected error.");
    }
  }

  /**
   * Check variant availability for requested quantity
   */
  async checkVariantAvailability(variantId: string, requestedQuantity: number): Promise<{
    available: boolean;
    currentStock: number;
    canPurchaseOutOfStock: boolean;
  }> {
    try {
      const variant = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.id, variantId))
        .limit(1);

      if (!variant.length) {
        throw new Error("Product variant not found");
      }

      const currentStock = variant[0].inventoryQuantity;
      const canPurchaseOutOfStock = variant[0].allowOutOfStockPurchases || false;
      const available = currentStock >= requestedQuantity || canPurchaseOutOfStock;

      return {
        available,
        currentStock,
        canPurchaseOutOfStock
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to check variant availability: ${error.message}`);
      }
      throw new Error("Failed to check variant availability due to an unexpected error.");
    }
  }

  /**
   * Get aggregate stock for a product (sum of all variant stocks)
   */
  async getProductAggregateStock(productId: string): Promise<{
    totalStock: number;
    hasVariants: boolean;
    variants: Array<{ id: string; sku: string; stock: number; }>;
  }> {
    try {
      const variants = await db
        .select({
          id: productVariants.id,
          sku: productVariants.sku,
          stock: productVariants.inventoryQuantity
        })
        .from(productVariants)
        .where(eq(productVariants.productId, productId));

      const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);

      return {
        totalStock,
        hasVariants: variants.length > 0,
        variants
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get product aggregate stock: ${error.message}`);
      }
      throw new Error("Failed to get product aggregate stock due to an unexpected error.");
    }
  }

  /**
   * Helper method to get a variant with its options
   */
  private async getVariantWithOptions(variantId: string): Promise<ProductVariantWithOptions | null> {
    try {
      const variant = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.id, variantId))
        .limit(1);

      if (!variant.length) {
        return null;
      }

      const optionValueMappings = await db
        .select({
          optionValue: productOptionValues,
          option: productOptions
        })
        .from(productVariantOptionValues)
        .innerJoin(productOptionValues, eq(productVariantOptionValues.optionValueId, productOptionValues.id))
        .innerJoin(productOptions, eq(productOptionValues.optionId, productOptions.id))
        .where(eq(productVariantOptionValues.variantId, variantId))
        .orderBy(asc(productOptions.sortOrder), asc(productOptionValues.sortOrder));

      return {
        ...variant[0],
        optionValues: optionValueMappings
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get variant with options: ${error.message}`);
      }
      throw new Error("Failed to get variant with options due to an unexpected error.");
    }
  }
}