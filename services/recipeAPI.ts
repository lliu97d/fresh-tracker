import axios from 'axios';
import { Recipe, RecipeIngredient, FoodItem } from '../store/types';

// Spoonacular API configuration
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';
const SPOONACULAR_API_KEY = '10f3c6ab3ce6470faa705a6151db778a';

// Fallback sample recipes when API is unavailable
const FALLBACK_RECIPES: Recipe[] = [
  {
    id: 'fallback-1',
    name: 'Quick Banana Smoothie Bowl',
    cuisine: 'American',
    time: '10 min',
    ingredients: [
      { name: 'Banana', amount: 1, unit: 'piece' },
      { name: 'Greek yogurt', amount: 200, unit: 'g' },
      { name: 'Honey', amount: 15, unit: 'ml' },
      { name: 'Granola', amount: 30, unit: 'g' },
      { name: 'Mixed berries', amount: 50, unit: 'g' },
    ],
    instructions: [
      'Blend banana with yogurt and honey until smooth',
      'Pour into a bowl',
      'Top with granola and fresh berries',
      'Serve immediately'
    ],
    difficulty: 'easy',
    servings: 1,
    calories: 320,
    tags: ['Breakfast', 'Healthy', 'Quick', 'Vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400',
  },
  {
    id: 'fallback-2',
    name: 'Spinach Quinoa Salad',
    cuisine: 'Mediterranean',
    time: '20 min',
    ingredients: [
      { name: 'Quinoa', amount: 100, unit: 'g' },
      { name: 'Fresh spinach', amount: 50, unit: 'g' },
      { name: 'Cherry tomatoes', amount: 100, unit: 'g' },
      { name: 'Cucumber', amount: 1, unit: 'piece' },
      { name: 'Olive oil', amount: 15, unit: 'ml' },
      { name: 'Lemon juice', amount: 10, unit: 'ml' },
    ],
    instructions: [
      'Cook quinoa according to package instructions',
      'Chop vegetables and mix in a bowl',
      'Add cooked quinoa to vegetables',
      'Dress with olive oil and lemon juice',
      'Season with salt and pepper to taste'
    ],
    difficulty: 'easy',
    servings: 2,
    calories: 280,
    tags: ['Lunch', 'Vegetarian', 'Protein', 'Healthy'],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
  },
  {
    id: 'fallback-3',
    name: 'Greek Yogurt Parfait',
    cuisine: 'Greek',
    time: '5 min',
    ingredients: [
      { name: 'Greek yogurt', amount: 150, unit: 'g' },
      { name: 'Honey', amount: 10, unit: 'ml' },
      { name: 'Mixed berries', amount: 50, unit: 'g' },
      { name: 'Nuts', amount: 20, unit: 'g' },
    ],
    instructions: [
      'Layer yogurt in a glass or bowl',
      'Drizzle with honey',
      'Add fresh berries',
      'Sprinkle with chopped nuts',
      'Serve immediately'
    ],
    difficulty: 'easy',
    servings: 1,
    calories: 250,
    tags: ['Snack', 'Healthy', 'Quick', 'Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
  },
  {
    id: 'fallback-4',
    name: 'Avocado Toast with Eggs',
    cuisine: 'International',
    time: '15 min',
    ingredients: [
      { name: 'Bread', amount: 2, unit: 'slices' },
      { name: 'Avocado', amount: 1, unit: 'piece' },
      { name: 'Eggs', amount: 2, unit: 'pieces' },
      { name: 'Salt', amount: 1, unit: 'pinch' },
      { name: 'Black pepper', amount: 1, unit: 'pinch' },
    ],
    instructions: [
      'Toast bread until golden brown',
      'Mash avocado and spread on toast',
      'Fry or poach eggs to your preference',
      'Place eggs on top of avocado',
      'Season with salt and pepper'
    ],
    difficulty: 'easy',
    servings: 1,
    calories: 350,
    tags: ['Breakfast', 'Protein', 'Quick', 'Healthy'],
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
  },
  {
    id: 'fallback-5',
    name: 'Simple Pasta with Vegetables',
    cuisine: 'Italian',
    time: '25 min',
    ingredients: [
      { name: 'Pasta', amount: 200, unit: 'g' },
      { name: 'Broccoli', amount: 100, unit: 'g' },
      { name: 'Cherry tomatoes', amount: 100, unit: 'g' },
      { name: 'Olive oil', amount: 30, unit: 'ml' },
      { name: 'Garlic', amount: 2, unit: 'cloves' },
      { name: 'Parmesan cheese', amount: 30, unit: 'g' },
    ],
    instructions: [
      'Cook pasta according to package instructions',
      'Steam broccoli until tender',
      'Sauté garlic in olive oil',
      'Add tomatoes and cook for 2 minutes',
      'Combine pasta, vegetables, and cheese',
      'Season with salt and pepper'
    ],
    difficulty: 'medium',
    servings: 2,
    calories: 450,
    tags: ['Dinner', 'Vegetarian', 'Pasta', 'Italian'],
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
  },
];

// Spoonacular API response types
interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  nutrition: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
  analyzedInstructions: Array<{
    name: string;
    steps: Array<{
      number: number;
      step: string;
      ingredients: Array<{
        id: number;
        name: string;
        localizedName: string;
        image: string;
      }>;
    }>;
  }>;
  extendedIngredients: Array<{
    id: number;
    original: string;
    originalName: string;
    name: string;
    amount: number;
    unit: string;
    meta: string[];
  }>;
}

interface SpoonacularSearchResponse {
  results: SpoonacularRecipe[];
  offset: number;
  number: number;
  totalResults: number;
}

class RecipeAPIService {
  private apiKey: string;
  private isApiAvailable: boolean = true;

  constructor() {
    this.apiKey = SPOONACULAR_API_KEY;
  }

  // Set API key
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.isApiAvailable = true; // Reset availability when new key is set
  }

  // Check if API is available (not rate limited)
  private async checkApiAvailability(): Promise<boolean> {
    if (!this.isApiAvailable) return false;
    
    try {
      // Make a simple test request
      await axios.get(`${SPOONACULAR_BASE_URL}/complexSearch`, {
        params: {
          apiKey: this.apiKey,
          query: 'test',
          number: 1,
        },
      });
      
      return true;
    } catch (error: any) {
      if (error.response?.status === 402) {
        this.isApiAvailable = false;
        return false;
      }
      
      return true; // Other errors might be temporary
    }
  }

  // Get fallback recipes based on ingredients
  private getFallbackRecipes(ingredients: string[]): Recipe[] {
    if (ingredients.length === 0) {
      return FALLBACK_RECIPES;
    }

    // Filter fallback recipes based on available ingredients
    return FALLBACK_RECIPES.filter(recipe => {
      const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
      const availableIngredients = ingredients.map(ing => ing.toLowerCase());
      
      // Check if recipe uses any of the available ingredients
      return availableIngredients.some(available => 
        recipeIngredients.some(recipeIng => 
          recipeIng.includes(available) || available.includes(recipeIng)
        )
      );
    });
  }

  // Search recipes by ingredients (perfect for using expiring items)
  async findRecipesByIngredients(
    ingredients: string[],
    ranking: number = 2, // 1 = maximize used ingredients, 2 = minimize missing ingredients
    ignorePantry: boolean = true,
    number: number = 10
  ): Promise<Recipe[]> {
    try {
      // Check if API is available
      const apiAvailable = await this.checkApiAvailability();
      if (!apiAvailable) {
        console.log('Using fallback recipes due to API unavailability');
        return this.getFallbackRecipes(ingredients);
      }

      const response = await axios.get(
        `${SPOONACULAR_BASE_URL}/findByIngredients`,
        {
          params: {
            apiKey: this.apiKey,
            ingredients: ingredients.join(','),
            ranking,
            ignorePantry,
            number,
          },
        }
      );

      // Get detailed recipe information for each result
      const detailedRecipes = await Promise.all(
        response.data.map((recipe: any) => this.getRecipeInformation(recipe.id))
      );

      return detailedRecipes.filter(Boolean);
    } catch (error: any) {
      console.error('Error finding recipes by ingredients:', error);
      
      // Handle 402 error specifically
      if (error.response?.status === 402) {
        console.warn('API limit exceeded, using fallback recipes');
        this.isApiAvailable = false;
        return this.getFallbackRecipes(ingredients);
      }
      
      return this.getFallbackRecipes(ingredients);
    }
  }

  // Get detailed recipe information
  async getRecipeInformation(recipeId: number): Promise<Recipe | null> {
    try {
      const response = await axios.get<SpoonacularRecipe>(
        `${SPOONACULAR_BASE_URL}/${recipeId}/information`,
        {
          params: {
            apiKey: this.apiKey,
          },
        }
      );

      return this.mapSpoonacularToRecipe(response.data);
    } catch (error: any) {
      console.error('Error getting recipe information:', error);
      
      if (error.response?.status === 402) {
        this.isApiAvailable = false;
      }
      
      return null;
    }
  }

  // Search recipes with complex queries
  async searchRecipes(
    query: string,
    cuisine?: string,
    diet?: string,
    intolerances?: string[],
    maxReadyTime?: number,
    number: number = 10
  ): Promise<Recipe[]> {
    try {
      // Check if API is available
      const apiAvailable = await this.checkApiAvailability();
      if (!apiAvailable) {
        console.log('Using fallback recipes due to API unavailability');
        return this.getFallbackRecipes([query]);
      }

      const params: any = {
        apiKey: this.apiKey,
        query,
        number,
        addRecipeInformation: true,
        fillIngredients: true,
      };

      if (cuisine) params.cuisine = cuisine;
      if (diet) params.diet = diet;
      if (intolerances) params.intolerances = intolerances.join(',');
      if (maxReadyTime) params.maxReadyTime = maxReadyTime;

      const response = await axios.get<SpoonacularSearchResponse>(
        `${SPOONACULAR_BASE_URL}/complexSearch`,
        { params }
      );

      return response.data.results.map(recipe => this.mapSpoonacularToRecipe(recipe));
    } catch (error: any) {
      console.error('Error searching recipes:', error);
      
      // Handle 402 error specifically
      if (error.response?.status === 402) {
        console.warn('API limit exceeded, using fallback recipes');
        this.isApiAvailable = false;
        return this.getFallbackRecipes([query]);
      }
      
      return this.getFallbackRecipes([query]);
    }
  }

  // Get recipe suggestions based on user's inventory and preferences
  async getPersonalizedSuggestions(
    inventory: FoodItem[],
    dietaryPreferences: string[],
    allergies: string[],
    favoriteCuisine?: string
  ): Promise<Recipe[]> {
    try {
      // Get ingredients from inventory (prioritize expiring items)
      const expiringItems = inventory
        .filter(item => item.status === 'expiring' || item.status === 'watch')
        .map(item => item.name);

      const allIngredients = inventory.map(item => item.name);
      
      // Use expiring items first, then all ingredients
      const ingredientsToUse = expiringItems.length > 0 ? expiringItems : allIngredients;

      if (ingredientsToUse.length === 0) {
        // Fallback to cuisine-based search
        return this.searchRecipes(
          favoriteCuisine || 'healthy',
          favoriteCuisine,
          undefined,
          allergies,
          45, // max 45 minutes
          5
        );
      }

      // Find recipes using available ingredients
      const recipes = await this.findRecipesByIngredients(
        ingredientsToUse.slice(0, 5), // Limit to 5 ingredients
        2, // Minimize missing ingredients
        true,
        10
      );

      // Filter by dietary preferences and allergies
      return recipes.filter(recipe => {
        // Check dietary preferences
        if (dietaryPreferences.length > 0) {
          const hasDietaryMatch = dietaryPreferences.some(diet => 
            recipe.tags?.some(tag => tag.toLowerCase().includes(diet.toLowerCase()))
          );
          if (!hasDietaryMatch) return false;
        }

        // Check allergies (simple check - in production, you'd want more sophisticated allergy checking)
        if (allergies.length > 0) {
          const hasAllergen = allergies.some(allergy => 
            recipe.ingredients.some(ingredient => 
              ingredient.name.toLowerCase().includes(allergy.toLowerCase())
            )
          );
          if (hasAllergen) return false;
        }

        return true;
      });
    } catch (error) {
      console.error('Error getting personalized suggestions:', error);
      return this.getFallbackRecipes(inventory.map(item => item.name));
    }
  }

  // Map Spoonacular recipe to our Recipe format
  private mapSpoonacularToRecipe(spoonacularRecipe: SpoonacularRecipe): Recipe {
    const ingredients: RecipeIngredient[] = spoonacularRecipe.extendedIngredients.map(ing => ({
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
    }));

    const instructions = spoonacularRecipe.analyzedInstructions[0]?.steps.map(step => step.step) || [];

    const calories = spoonacularRecipe.nutrition?.nutrients.find(n => n.name === 'Calories')?.amount;

    const tags = [
      ...spoonacularRecipe.cuisines,
      ...spoonacularRecipe.dishTypes,
      ...spoonacularRecipe.diets,
    ];

    return {
      id: spoonacularRecipe.id.toString(),
      name: spoonacularRecipe.title,
      cuisine: spoonacularRecipe.cuisines[0] || 'International',
      time: `${spoonacularRecipe.readyInMinutes} min`,
      ingredients,
      instructions,
      difficulty: this.getDifficulty(spoonacularRecipe.readyInMinutes),
      servings: spoonacularRecipe.servings,
      calories: calories ? Math.round(calories) : undefined,
      tags,
      imageUrl: spoonacularRecipe.image,
    };
  }

  // Determine difficulty based on cooking time
  private getDifficulty(readyInMinutes: number): 'easy' | 'medium' | 'hard' {
    if (readyInMinutes <= 30) return 'easy';
    if (readyInMinutes <= 60) return 'medium';
    return 'hard';
  }

  // Reset API availability (useful for testing or when switching API keys)
  resetApiAvailability() {
    this.isApiAvailable = true;
  }

  // Get API status
  getApiStatus(): { available: boolean; message: string } {
    if (this.isApiAvailable) {
      return { available: true, message: 'API is available' };
    } else {
      return { 
        available: false, 
        message: 'API limit exceeded - using fallback recipes. Consider upgrading your Spoonacular plan or waiting until tomorrow.' 
      };
    }
  }
}

export const recipeAPI = new RecipeAPIService();
export default recipeAPI; 