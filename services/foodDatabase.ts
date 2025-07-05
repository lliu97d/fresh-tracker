import axios from 'axios';
import { FoodItem, FoodCategory } from '../store/types';

// Open Food Facts API base URL
const OPEN_FOOD_FACTS_BASE_URL = 'https://world.openfoodfacts.org/api/v0';

// USDA Food Database API (you'll need to get a free API key)
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// Enhanced FoodItem interface for API responses
export interface FoodProduct {
  id: string;
  name: string;
  barcode?: string;
  brand?: string;
  category: FoodCategory;
  nutrition: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  imageUrl?: string;
  ingredients?: string[];
  allergens?: string[];
  expirationSuggestion?: number; // days
  servingSize?: string;
  description?: string;
}

// Open Food Facts API response types
interface OpenFoodFactsProduct {
  code: string;
  product: {
    product_name: string;
    brands: string;
    categories: string;
    image_url: string;
    ingredients_text: string;
    allergens_tags: string[];
    nutriments: {
      energy_100g?: number;
      proteins_100g?: number;
      carbohydrates_100g?: number;
      fat_100g?: number;
      fiber_100g?: number;
      sugars_100g?: number;
      salt_100g?: number;
    };
    generic_name: string;
  };
  status: number;
}

// USDA API response types
interface USDAFood {
  fdcId: number;
  description: string;
  brandName?: string;
  foodCategory?: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    value: number;
    unitName: string;
  }>;
}

interface USDASearchResponse {
  foods: USDAFood[];
  totalHits: number;
}

class FoodDatabaseService {
  private usdaApiKey: string | null = null;

  constructor() {
    // You can set your USDA API key here
    this.usdaApiKey = '38PPDZfJ4GI73PVs6kwYbE7X26zNB0qxqlKxOg18';
  }

  // Set USDA API key
  setUSDAApiKey(apiKey: string) {
    this.usdaApiKey = apiKey;
  }

  // Search product by barcode using Open Food Facts
  async searchByBarcode(barcode: string): Promise<FoodProduct | null> {
    try {
      const response = await axios.get<OpenFoodFactsProduct>(
        `${OPEN_FOOD_FACTS_BASE_URL}/product/${barcode}.json`
      );

      if (response.data.status === 0) {
        return null; // Product not found
      }

      const product = response.data.product;
      return this.mapOpenFoodFactsToProduct(response.data);
    } catch (error) {
      console.error('Error searching by barcode:', error);
      return null;
    }
  }

  // Search products by name using Open Food Facts
  async searchByName(query: string): Promise<FoodProduct[]> {
    try {
      const response = await axios.get(
        `${OPEN_FOOD_FACTS_BASE_URL}/search?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`
      );

      const products = response.data.products || [];
      return products
        .map((product: any) => this.mapOpenFoodFactsToProduct({ product, code: product.code, status: 1 }))
        .filter(Boolean);
    } catch (error) {
      console.error('Error searching by name:', error);
      return [];
    }
  }

  // Search using USDA Food Database (requires API key)
  async searchUSDA(query: string): Promise<FoodProduct[]> {
    if (!this.usdaApiKey) {
      console.warn('USDA API key not set');
      return [];
    }

    try {
      const response = await axios.get<USDASearchResponse>(
        `${USDA_BASE_URL}/foods/search`,
        {
          params: {
            api_key: this.usdaApiKey,
            query: query,
            pageSize: 10,
            dataType: 'Foundation,SR Legacy',
          },
        }
      );

      return response.data.foods.map(food => this.mapUSDAToProduct(food));
    } catch (error) {
      console.error('Error searching USDA:', error);
      return [];
    }
  }

  // Get nutritional information for a food item
  async getNutritionInfo(foodName: string): Promise<FoodProduct['nutrition'] | null> {
    try {
      // Try Open Food Facts first
    //   const openFoodResults = await this.searchByName(foodName);
    //   if (openFoodResults.length > 0) {
    //     return openFoodResults[0].nutrition;
    //   }

      // Fallback to USDA if API key is available
      if (this.usdaApiKey) {
        const usdaResults = await this.searchUSDA(foodName);
        if (usdaResults.length > 0) {
          return usdaResults[0].nutrition;
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting nutrition info:', error);
      return null;
    }
  }

  // Map Open Food Facts response to our FoodProduct format
  private mapOpenFoodFactsToProduct(data: OpenFoodFactsProduct): FoodProduct {
    const product = data.product;
    const nutriments = product.nutriments || {};

    return {
      id: data.code,
      name: product.product_name || product.generic_name || 'Unknown Product',
      barcode: data.code,
      brand: product.brands,
      category: this.mapCategory(product.categories),
      nutrition: {
        calories: nutriments.energy_100g ? Math.round(nutriments.energy_100g / 4.184) : undefined, // Convert kJ to kcal
        protein: nutriments.proteins_100g,
        carbs: nutriments.carbohydrates_100g,
        fat: nutriments.fat_100g,
        fiber: nutriments.fiber_100g,
        sugar: nutriments.sugars_100g,
        sodium: nutriments.salt_100g ? nutriments.salt_100g * 400 : undefined, // Convert salt to sodium
      },
      imageUrl: product.image_url,
      ingredients: product.ingredients_text ? product.ingredients_text.split(',').map(i => i.trim()) : undefined,
      allergens: product.allergens_tags ? product.allergens_tags.map(tag => tag.replace('en:', '')) : undefined,
      expirationSuggestion: this.getExpirationSuggestion(product.categories),
      description: product.generic_name,
    };
  }

  // Map USDA response to our FoodProduct format
  private mapUSDAToProduct(food: USDAFood): FoodProduct {
    const nutrients = food.foodNutrients.reduce((acc, nutrient) => {
      acc[nutrient.nutrientName.toLowerCase()] = nutrient.value;
      return acc;
    }, {} as Record<string, number>);

    return {
      id: food.fdcId.toString(),
      name: food.description,
      brand: food.brandName,
      category: this.mapCategory(food.foodCategory),
      nutrition: {
        calories: nutrients['energy'] || nutrients['calories'],
        protein: nutrients['protein'],
        carbs: nutrients['carbohydrate, by difference'],
        fat: nutrients['total lipid (fat)'],
        fiber: nutrients['fiber, total dietary'],
        sugar: nutrients['sugars, total including nlea'],
        sodium: nutrients['sodium, na'],
      },
      description: food.description,
    };
  }

  // Map category strings to our FoodCategory enum
  private mapCategory(categoryString?: string): FoodCategory {
    if (!categoryString) return 'Other';

    const lowerCategory = categoryString.toLowerCase();

    if (lowerCategory.includes('vegetable') || lowerCategory.includes('veggie')) return 'Vegetables';
    if (lowerCategory.includes('fruit')) return 'Fruits';
    if (lowerCategory.includes('meat') || lowerCategory.includes('beef') || lowerCategory.includes('chicken') || lowerCategory.includes('pork')) return 'Meat';
    if (lowerCategory.includes('dairy') || lowerCategory.includes('milk') || lowerCategory.includes('cheese') || lowerCategory.includes('yogurt')) return 'Dairy';
    if (lowerCategory.includes('bread') || lowerCategory.includes('bakery') || lowerCategory.includes('pastry')) return 'Bakery';
    if (lowerCategory.includes('condiment') || lowerCategory.includes('sauce') || lowerCategory.includes('dressing')) return 'Condiments';
    if (lowerCategory.includes('spice') || lowerCategory.includes('herb') || lowerCategory.includes('seasoning')) return 'Spices';
    if (lowerCategory.includes('oil') || lowerCategory.includes('fat')) return 'Oils';

    return 'Other';
  }

  // Get suggested expiration date based on category
  private getExpirationSuggestion(categoryString?: string): number {
    if (!categoryString) return 7;

    const lowerCategory = categoryString.toLowerCase();

    if (lowerCategory.includes('dairy')) return 7;
    if (lowerCategory.includes('meat')) return 3;
    if (lowerCategory.includes('vegetable') || lowerCategory.includes('fruit')) return 7;
    if (lowerCategory.includes('bread') || lowerCategory.includes('bakery')) return 5;
    if (lowerCategory.includes('condiment') || lowerCategory.includes('sauce')) return 30;
    if (lowerCategory.includes('spice') || lowerCategory.includes('oil')) return 365;

    return 7; // Default to 7 days
  }

  // Convert FoodProduct to FoodItem for storage
  toFoodItem(product: FoodProduct, quantity: number, unit: string): Omit<FoodItem, 'id' | 'addedDate' | 'status'> {
    return {
      name: product.name,
      quantity,
      unit,
      category: product.category,
      calories: product.nutrition.calories,
      expirationDate: new Date(Date.now() + (product.expirationSuggestion || 7) * 24 * 60 * 60 * 1000),
      notes: product.description,
      barcode: product.barcode,
      location: 'fresh',
    };
  }
}

// Export singleton instance
export const foodDatabase = new FoodDatabaseService(); 