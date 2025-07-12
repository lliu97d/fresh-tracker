// Core data types for FreshTracker app

export type FreshnessStatus = 'fresh' | 'watch' | 'expiring' | 'expired';

export type FoodCategory = 
  | 'Vegetables' 
  | 'Fruits' 
  | 'Meat' 
  | 'Dairy' 
  | 'Bakery' 
  | 'Pantry' 
  | 'Condiments' 
  | 'Spices' 
  | 'Oils' 
  | 'Other';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

// Food Items
export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  originalQuantity: number;  // Track initial quantity for percentage calculations
  unit: string;
  category: FoodCategory;
  calories?: number;
  expirationDate: Date;
  addedDate: Date;
  status: FreshnessStatus;
  notes?: string;
  barcode?: string;
  location: 'fresh' | 'pantry';
}

// Recipe Ingredients
export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  optional?: boolean;
}

// Recipes
export interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  time: string;
  ingredients: RecipeIngredient[];
  instructions?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  servings?: number;
  calories?: number;
  tags?: string[];
  imageUrl?: string;
}

// Meal Planning
export interface MealPlan {
  id: string;
  date: string; // YYYY-MM-DD
  meals: {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
    snacks?: Recipe[];
  };
  notes?: string;
}

// User Profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  dietPreferences: string[];
  favoriteCuisine: string;
  allergies: string[];
  calorieGoal: number;
  createdAt: Date;
  updatedAt: Date;
}

// App Settings
export interface AppSettings {
  notifications: {
    expirationReminders: boolean;
    mealReminders: boolean;
    shoppingListReminders: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

// Shopping List
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: FoodCategory;
  completed: boolean;
  addedDate: Date;
  notes?: string;
} 