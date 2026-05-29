import productModel from "../models/product.models.js";

/**
 * Get stock for a specific variant. If variantId is absent, returns the
 * product-level stock (sum of all variants, or a sentinel large number so
 * base-product additions are never blocked by this check).
 */
export const stockOfVariants = async (productId, variantId) => {
    const product = await productModel.findById(productId);

    if (!product) return 0;

    // Base product (no variantId) — use the default variant's stock
    if (!variantId) {
        const defaultVariant = product.variants?.find(v => v.isDefault);
        if (defaultVariant) return defaultVariant.stock ?? 0;
        // Fallback for old products without a default variant
        if (!product.variants?.length) return 9999;
        return product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    }

    const variant = product.variants.find(v => v._id.toString() === variantId.toString());
    if (!variant) return 0;

    return variant.stock ?? 0;
};