import axios from 'axios';
import { Recipe, RecipeIngredient, FoodItem } from '../store/types';

// Spoonacular API configuration
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';
const SPOONACULAR_API_KEY = '10f3c6ab3ce6470faa705a6151db778a';

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

  constructor() {
    this.apiKey = SPOONACULAR_API_KEY;
  }

  // Set API key
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Search recipes by ingredients (perfect for using expiring items)
  async findRecipesByIngredients(
    ingredients: string[],
    ranking: number = 2, // 1 = maximize used ingredients, 2 = minimize missing ingredients
    ignorePantry: boolean = true,
    number: number = 10
  ): Promise<Recipe[]> {
    try {
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
    } catch (error) {
      console.error('Error finding recipes by ingredients:', error);
      return [];
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
    } catch (error) {
      console.error('Error getting recipe information:', error);
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
    } catch (error) {
      console.error('Error searching recipes:', error);
      return [];
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
      return [];
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
}

export const recipeAPI = new RecipeAPIService();
export default recipeAPI; 