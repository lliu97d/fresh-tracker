import { create } from 'zustand';
import { 
  FoodItem, 
  Recipe, 
  UserProfile, 
  MealPlan, 
  ShoppingItem, 
  FreshnessStatus,
  FoodCategory 
} from './types';
import { 
  mockFoodItems, 
  mockRecipes, 
  mockUserProfile, 
  mockMealPlans, 
  mockShoppingItems 
} from './mockData';
import { saveAllData, loadAllData, clearRecipesFromStorage } from './persistence';
import { recipeAPI } from '../services/recipeAPI';

// Helper function to calculate freshness status
const calculateStatus = (expirationDate: Date): FreshnessStatus => {
  const now = new Date();
  const diffTime = expirationDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'expired';
  if (diffDays <= 1) return 'expiring';
  if (diffDays <= 3) return 'watch';
  return 'fresh';
};

// Helper function to generate unique IDs
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

interface AppState {
  // State
  foodItems: FoodItem[];
  recipes: Recipe[];
  mealPlans: MealPlan[];
  userProfile: UserProfile;
  shoppingList: ShoppingItem[];
  isLoading: boolean;
  isInitialized: boolean;
  
  // Initialization
  initializeStore: () => Promise<void>;
  
  // Food Items Actions
  addFoodItem: (item: Omit<FoodItem, 'id' | 'addedDate' | 'status'>) => void;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  getFoodItemsByLocation: (location: 'fresh' | 'pantry') => FoodItem[];
  getExpiringItems: () => FoodItem[];
  
  // Recipe Actions
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  getRecipesByCuisine: (cuisine: string) => Recipe[];
  getRecipesByIngredients: (ingredients: string[]) => Recipe[];
  
  // Recipe API Actions
  fetchPersonalizedRecipes: () => Promise<Recipe[]>;
  searchRecipes: (query: string, filters?: {
    cuisine?: string;
    diet?: string;
    intolerances?: string[];
    maxReadyTime?: number;
  }) => Promise<Recipe[]>;
  clearRecipes: () => void;
  forceReloadRecipes: () => Promise<Recipe[]>;
  isLoadingRecipes: boolean;
  
  // Meal Plan Actions
  addMealPlan: (mealPlan: Omit<MealPlan, 'id'>) => void;
  updateMealPlan: (id: string, updates: Partial<MealPlan>) => void;
  deleteMealPlan: (id: string) => void;
  getMealPlanByDate: (date: string) => MealPlan | undefined;
  getMealPlansByDateRange: (startDate: string, endDate: string) => MealPlan[];
  
  // User Profile Actions
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  
  // Shopping List Actions
  addShoppingItem: (item: Omit<ShoppingItem, 'id' | 'addedDate'>) => void;
  updateShoppingItem: (id: string, updates: Partial<ShoppingItem>) => void;
  deleteShoppingItem: (id: string) => void;
  toggleShoppingItem: (id: string) => void;
  getCompletedShoppingItems: () => ShoppingItem[];
  getPendingShoppingItems: () => ShoppingItem[];
  
  // Utility Actions
  refreshFoodItemStatuses: () => void;
  generateShoppingList: () => void;
  saveToStorage: () => Promise<void>;
  clearAllData: () => Promise<void>;
  resetRecipes: () => Promise<void>;
  
  // Development helpers
  loadMockRecipes: () => void;
  useMockRecipes: boolean;
  toggleMockRecipes: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial State
  foodItems: [],
  recipes: [],
  mealPlans: [],
  userProfile: mockUserProfile,
  shoppingList: [],
  isLoading: true,
  isInitialized: false,
  isLoadingRecipes: false,
  useMockRecipes: false,
  
  // Initialization
  initializeStore: async () => {
    set({ isLoading: true });
    try {
      const defaultData = {
        foodItems: mockFoodItems,
        recipes: [], // Start with empty recipes to load from API
        mealPlans: mockMealPlans,
        userProfile: mockUserProfile,
        shoppingList: mockShoppingItems,
      };
      
      // Temporarily disable loading recipes from storage to force API load
      const loadedData = await loadAllData(defaultData);
      
      set({
        ...loadedData,
        recipes: [], // Force empty recipes to trigger API load
        isLoading: false,
        isInitialized: true,
      });
      
      console.log('🚀 Store initialized with empty recipes');
    } catch (error) {
      console.error('Error initializing store:', error);
      set({
        foodItems: mockFoodItems,
        recipes: [], // Start with empty recipes to load from API
        mealPlans: mockMealPlans,
        userProfile: mockUserProfile,
        shoppingList: mockShoppingItems,
        isLoading: false,
        isInitialized: true,
      });
    }
  },
  
  // Food Items Actions
  addFoodItem: (item) => {
    const newItem: FoodItem = {
      ...item,
      originalQuantity: item.quantity, // Set original quantity to initial quantity
      id: generateId(),
      addedDate: new Date(),
      status: calculateStatus(item.expirationDate),
    };
    set((state) => ({
      foodItems: [...state.foodItems, newItem],
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  updateFoodItem: (id, updates) => {
    set((state) => ({
      foodItems: state.foodItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  deleteFoodItem: (id) => {
    set((state) => ({
      foodItems: state.foodItems.filter((item) => item.id !== id),
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  getFoodItemsByLocation: (location) => {
    return get().foodItems.filter((item) => item.location === location);
  },
  
  getExpiringItems: () => {
    return get().foodItems.filter((item) => item.status === 'expiring');
  },
  
  // Recipe Actions
  addRecipe: (recipe) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: generateId(),
    };
    set((state) => ({
      recipes: [...state.recipes, newRecipe],
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  updateRecipe: (id, updates) => {
    set((state) => ({
      recipes: state.recipes.map((recipe) =>
        recipe.id === id ? { ...recipe, ...updates } : recipe
      ),
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  deleteRecipe: (id) => {
    set((state) => ({
      recipes: state.recipes.filter((recipe) => recipe.id !== id),
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  getRecipesByCuisine: (cuisine) => {
    return get().recipes.filter((recipe) => 
      recipe.cuisine.toLowerCase() === cuisine.toLowerCase()
    );
  },
  
  getRecipesByIngredients: (ingredients) => {
    return get().recipes.filter((recipe) =>
      recipe.ingredients.some((ingredient) =>
        ingredients.some((searchIngredient) =>
          ingredient.name.toLowerCase().includes(searchIngredient.toLowerCase())
        )
      )
    );
  },
  
  // Recipe API Actions
  fetchPersonalizedRecipes: async () => {
    const state = get();
    
    // Check if mock mode is enabled
    if (state.useMockRecipes) {
      console.log('🧪 Using mock recipes (mock mode enabled)');
      set({ isLoadingRecipes: true });
      
      // Filter mock recipes based on available ingredients
      const mockRecipesToUse = mockRecipes.filter(recipe => {
        const availableIngredients = state.foodItems.map((item: FoodItem) => item.name.toLowerCase());
        const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
        
        return recipeIngredients.some(ingredient => 
          availableIngredients.some((available: string) => 
            available.includes(ingredient) || ingredient.includes(available)
          )
        );
      });
      
      set({ recipes: mockRecipesToUse, isLoadingRecipes: false });
      get().saveToStorage();
      return mockRecipesToUse;
    }
    
    console.log('Fetching personalized recipes from API...');
    set({ isLoadingRecipes: true });
    try {
      console.log('Current state:', {
        foodItemsCount: state.foodItems.length,
        dietaryPreferences: state.userProfile.dietPreferences,
        allergies: state.userProfile.allergies,
        favoriteCuisine: state.userProfile.favoriteCuisine
      });
      
      const recipes = await recipeAPI.getPersonalizedSuggestions(
        state.foodItems,
        state.userProfile.dietPreferences,
        state.userProfile.allergies,
        state.userProfile.favoriteCuisine
      );
      
      console.log('API returned recipes:', recipes.length);
      
      // Add new recipes to store
      set((state) => ({
        recipes: [...state.recipes, ...recipes],
        isLoadingRecipes: false,
      }));
      
      // Auto-save to storage
      get().saveToStorage();
      return recipes;
    } catch (error) {
      console.error('Error fetching personalized recipes:', error);
      console.log('🔄 Falling back to mock recipes for development...');
      
      // Use mock recipes when API fails
      const currentState = get();
      const mockRecipesToUse = mockRecipes.filter(recipe => {
        // Filter recipes based on available ingredients
        const availableIngredients = currentState.foodItems.map((item: FoodItem) => item.name.toLowerCase());
        const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
        
        // Check if recipe uses any available ingredients
        return recipeIngredients.some(ingredient => 
          availableIngredients.some((available: string) => 
            available.includes(ingredient) || ingredient.includes(available)
          )
        );
      });
      
      set((state) => ({
        recipes: [...state.recipes, ...mockRecipesToUse],
        isLoadingRecipes: false,
      }));
      
      // Auto-save to storage
      get().saveToStorage();
      return mockRecipesToUse;
    }
  },
  
  searchRecipes: async (query, filters = {}) => {
    const state = get();
    
    // Check if mock mode is enabled
    if (state.useMockRecipes) {
      console.log('🧪 Using mock recipes for search (mock mode enabled)');
      set({ isLoadingRecipes: true });
      
      // Filter mock recipes based on search query
      const mockRecipesToUse = mockRecipes.filter(recipe => {
        const queryLower = query.toLowerCase();
        const recipeNameLower = recipe.name.toLowerCase();
        const cuisineLower = recipe.cuisine.toLowerCase();
        
        // Check if recipe matches search query
        const matchesQuery = recipeNameLower.includes(queryLower) || 
                           cuisineLower.includes(queryLower) ||
                           recipe.tags?.some(tag => tag.toLowerCase().includes(queryLower));
        
        // Check cuisine filter
        const matchesCuisine = !filters.cuisine || 
                              recipe.cuisine.toLowerCase() === filters.cuisine.toLowerCase();
        
        return matchesQuery && matchesCuisine;
      });
      
      set((state) => ({
        recipes: [...state.recipes, ...mockRecipesToUse],
        isLoadingRecipes: false,
      }));
      
      get().saveToStorage();
      return mockRecipesToUse;
    }
    
    set({ isLoadingRecipes: true });
    try {
      const recipes = await recipeAPI.searchRecipes(
        query,
        filters.cuisine,
        filters.diet,
        filters.intolerances,
        filters.maxReadyTime
      );
      
      // Add new recipes to store
      set((state) => ({
        recipes: [...state.recipes, ...recipes],
        isLoadingRecipes: false,
      }));
      
      // Auto-save to storage
      get().saveToStorage();
      return recipes;
    } catch (error) {
      console.error('Error searching recipes:', error);
      console.log('🔄 Falling back to mock recipes for search...');
      
      // Use mock recipes when API fails
      const mockRecipesToUse = mockRecipes.filter(recipe => {
        const queryLower = query.toLowerCase();
        const recipeNameLower = recipe.name.toLowerCase();
        const cuisineLower = recipe.cuisine.toLowerCase();
        
        // Check if recipe matches search query
        const matchesQuery = recipeNameLower.includes(queryLower) || 
                           cuisineLower.includes(queryLower) ||
                           recipe.tags?.some(tag => tag.toLowerCase().includes(queryLower));
        
        // Check cuisine filter
        const matchesCuisine = !filters.cuisine || 
                              recipe.cuisine.toLowerCase() === filters.cuisine.toLowerCase();
        
        return matchesQuery && matchesCuisine;
      });
      
      set((state) => ({
        recipes: [...state.recipes, ...mockRecipesToUse],
        isLoadingRecipes: false,
      }));
      
      // Auto-save to storage
      get().saveToStorage();
      return mockRecipesToUse;
    }
  },
  
  clearRecipes: () => {
    console.log('🧹 Clearing recipes...');
    set({ recipes: [] });
    get().saveToStorage();
  },
  
  forceReloadRecipes: async () => {
    const state = get();
    
    // Check if mock mode is enabled
    if (state.useMockRecipes) {
      console.log('🔄 Force reloading mock recipes...');
      set({ recipes: [], isLoadingRecipes: true });
      
      // Clear recipes from storage to ensure fresh load
      await clearRecipesFromStorage();
      
      // Filter mock recipes based on available ingredients
      const mockRecipesToUse = mockRecipes.filter(recipe => {
        const availableIngredients = state.foodItems.map((item: FoodItem) => item.name.toLowerCase());
        const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
        
        return recipeIngredients.some(ingredient => 
          availableIngredients.some((available: string) => 
            available.includes(ingredient) || ingredient.includes(available)
          )
        );
      });
      
      console.log('📋 Mock force reload returned:', mockRecipesToUse.length, 'recipes');
      set({ recipes: mockRecipesToUse, isLoadingRecipes: false });
      get().saveToStorage();
      return mockRecipesToUse;
    }
    
    console.log('🔄 Force reloading recipes from API...');
    set({ recipes: [], isLoadingRecipes: true });
    
    // Clear recipes from storage to ensure fresh load
    await clearRecipesFromStorage();
    
    try {
      const recipes = await recipeAPI.getPersonalizedSuggestions(
        state.foodItems,
        state.userProfile.dietPreferences,
        state.userProfile.allergies,
        state.userProfile.favoriteCuisine
      );
      
      console.log('📋 Force reload returned:', recipes.length, 'recipes');
      
      set({ recipes, isLoadingRecipes: false });
      get().saveToStorage();
      return recipes;
    } catch (error) {
      console.error('❌ Error force reloading recipes:', error);
      console.log('🔄 Falling back to mock recipes for force reload...');
      
      // Use mock recipes when API fails
      const currentState = get();
      const mockRecipesToUse = mockRecipes.filter(recipe => {
        // Filter recipes based on available ingredients
        const availableIngredients = currentState.foodItems.map((item: FoodItem) => item.name.toLowerCase());
        const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
        
        // Check if recipe uses any available ingredients
        return recipeIngredients.some(ingredient => 
          availableIngredients.some((available: string) => 
            available.includes(ingredient) || ingredient.includes(available)
          )
        );
      });
      
      set({ recipes: mockRecipesToUse, isLoadingRecipes: false });
      get().saveToStorage();
      return mockRecipesToUse;
    }
  },
  
  // Meal Plan Actions
  addMealPlan: (mealPlan) => {
    const newMealPlan: MealPlan = {
      ...mealPlan,
      id: generateId(),
    };
    set((state) => ({
      mealPlans: [...state.mealPlans, newMealPlan],
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  updateMealPlan: (id, updates) => {
    set((state) => ({
      mealPlans: state.mealPlans.map((mealPlan) =>
        mealPlan.id === id ? { ...mealPlan, ...updates } : mealPlan
      ),
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  deleteMealPlan: (id) => {
    set((state) => ({
      mealPlans: state.mealPlans.filter((mealPlan) => mealPlan.id !== id),
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  getMealPlanByDate: (date) => {
    return get().mealPlans.find((mealPlan) => mealPlan.date === date);
  },
  
  getMealPlansByDateRange: (startDate, endDate) => {
    return get().mealPlans.filter((mealPlan) =>
      mealPlan.date >= startDate && mealPlan.date <= endDate
    );
  },
  
  // User Profile Actions
  updateUserProfile: (updates) => {
    set((state) => ({
      userProfile: { ...state.userProfile, ...updates, updatedAt: new Date() },
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  // Shopping List Actions
  addShoppingItem: (item) => {
    const newItem: ShoppingItem = {
      ...item,
      id: generateId(),
      addedDate: new Date(),
    };
    set((state) => ({
      shoppingList: [...state.shoppingList, newItem],
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  updateShoppingItem: (id, updates) => {
    set((state) => ({
      shoppingList: state.shoppingList.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  deleteShoppingItem: (id) => {
    set((state) => ({
      shoppingList: state.shoppingList.filter((item) => item.id !== id),
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  toggleShoppingItem: (id) => {
    set((state) => ({
      shoppingList: state.shoppingList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  getCompletedShoppingItems: () => {
    return get().shoppingList.filter((item) => item.completed);
  },
  
  getPendingShoppingItems: () => {
    return get().shoppingList.filter((item) => !item.completed);
  },
  
  // Utility Actions
  refreshFoodItemStatuses: () => {
    set((state) => ({
      foodItems: state.foodItems.map((item) => ({
        ...item,
        status: calculateStatus(item.expirationDate),
      })),
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  generateShoppingList: () => {
    // This could be enhanced to analyze meal plans and suggest items
    const expiringItems = get().getExpiringItems();
    const userProfile = get().userProfile;
    
    // Simple implementation - could be made more sophisticated
    const suggestedItems = expiringItems.map((item) => ({
      id: generateId(),
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      completed: false,
      addedDate: new Date(),
      notes: 'Suggested based on expiring items',
    }));
    
    set((state) => ({
      shoppingList: [...state.shoppingList, ...suggestedItems],
    }));
    // Auto-save to storage
    get().saveToStorage();
  },
  
  // Storage Actions
  saveToStorage: async () => {
    const state = get();
    await saveAllData({
      foodItems: state.foodItems,
      recipes: state.recipes,
      mealPlans: state.mealPlans,
      userProfile: state.userProfile,
      shoppingList: state.shoppingList,
    });
  },
  
  clearAllData: async () => {
    const { clearAllData } = await import('./persistence');
    await clearAllData();
    set({
      foodItems: mockFoodItems,
      recipes: [],
      mealPlans: mockMealPlans,
      userProfile: mockUserProfile,
      shoppingList: mockShoppingItems,
    });
  },
  
  // Reset recipes only - useful for debugging
  resetRecipes: async () => {
    console.log('🔄 Resetting recipes...');
    await clearRecipesFromStorage();
    set({ recipes: [] });
  },
  
  // Development helpers
  loadMockRecipes: () => {
    console.log('🧪 Loading mock recipes for development...');
    set({ recipes: mockRecipes });
    get().saveToStorage();
  },
  
  toggleMockRecipes: () => {
    const currentState = get();
    const newMockMode = !currentState.useMockRecipes;
    console.log('🔄 Toggling mock recipes mode:', newMockMode ? 'ON' : 'OFF');
    
    set({ useMockRecipes: newMockMode });
    
    // If switching to mock mode, load mock recipes
    if (newMockMode) {
      set({ recipes: mockRecipes });
    } else {
      // If switching to API mode, clear recipes to force API reload
      set({ recipes: [] });
    }
    
    get().saveToStorage();
  },
})); 