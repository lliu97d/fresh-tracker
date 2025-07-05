import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem, Recipe, UserProfile, MealPlan, ShoppingItem } from './types';

// Storage keys
const STORAGE_KEYS = {
  FOOD_ITEMS: 'fresh_tracker_food_items',
  RECIPES: 'fresh_tracker_recipes',
  MEAL_PLANS: 'fresh_tracker_meal_plans',
  USER_PROFILE: 'fresh_tracker_user_profile',
  SHOPPING_LIST: 'fresh_tracker_shopping_list',
};

// Helper function to serialize dates for storage
const serializeForStorage = (data: any): any => {
  if (data === null || data === undefined) return data;
  
  if (data instanceof Date) {
    return { __type: 'Date', value: data.toISOString() };
  }
  
  if (Array.isArray(data)) {
    return data.map(serializeForStorage);
  }
  
  if (typeof data === 'object') {
    const serialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeForStorage(value);
    }
    return serialized;
  }
  
  return data;
};

// Helper function to deserialize dates from storage
const deserializeFromStorage = (data: any): any => {
  if (data === null || data === undefined) return data;
  
  if (typeof data === 'object' && data.__type === 'Date') {
    return new Date(data.value);
  }
  
  if (Array.isArray(data)) {
    return data.map(deserializeFromStorage);
  }
  
  if (typeof data === 'object') {
    const deserialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      deserialized[key] = deserializeFromStorage(value);
    }
    return deserialized;
  }
  
  return data;
};

// Save data to AsyncStorage
export const saveToStorage = async (key: string, data: any): Promise<void> => {
  try {
    const serializedData = serializeForStorage(data);
    await AsyncStorage.setItem(key, JSON.stringify(serializedData));
  } catch (error) {
    console.error(`Error saving data to storage (${key}):`, error);
  }
};

// Load data from AsyncStorage
export const loadFromStorage = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const storedData = await AsyncStorage.getItem(key);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return deserializeFromStorage(parsedData);
    }
  } catch (error) {
    console.error(`Error loading data from storage (${key}):`, error);
  }
  return defaultValue;
};

// Save all store data
export const saveAllData = async (storeData: {
  foodItems: FoodItem[];
  recipes: Recipe[];
  mealPlans: MealPlan[];
  userProfile: UserProfile;
  shoppingList: ShoppingItem[];
}): Promise<void> => {
  try {
    await Promise.all([
      saveToStorage(STORAGE_KEYS.FOOD_ITEMS, storeData.foodItems),
      saveToStorage(STORAGE_KEYS.RECIPES, storeData.recipes),
      saveToStorage(STORAGE_KEYS.MEAL_PLANS, storeData.mealPlans),
      saveToStorage(STORAGE_KEYS.USER_PROFILE, storeData.userProfile),
      saveToStorage(STORAGE_KEYS.SHOPPING_LIST, storeData.shoppingList),
    ]);
  } catch (error) {
    console.error('Error saving all data:', error);
  }
};

// Load all store data
export const loadAllData = async (defaultData: {
  foodItems: FoodItem[];
  recipes: Recipe[];
  mealPlans: MealPlan[];
  userProfile: UserProfile;
  shoppingList: ShoppingItem[];
}): Promise<{
  foodItems: FoodItem[];
  recipes: Recipe[];
  mealPlans: MealPlan[];
  userProfile: UserProfile;
  shoppingList: ShoppingItem[];
}> => {
  try {
    const [foodItems, recipes, mealPlans, userProfile, shoppingList] = await Promise.all([
      loadFromStorage(STORAGE_KEYS.FOOD_ITEMS, defaultData.foodItems),
      loadFromStorage(STORAGE_KEYS.RECIPES, defaultData.recipes),
      loadFromStorage(STORAGE_KEYS.MEAL_PLANS, defaultData.mealPlans),
      loadFromStorage(STORAGE_KEYS.USER_PROFILE, defaultData.userProfile),
      loadFromStorage(STORAGE_KEYS.SHOPPING_LIST, defaultData.shoppingList),
    ]);

    return {
      foodItems,
      recipes,
      mealPlans,
      userProfile,
      shoppingList,
    };
  } catch (error) {
    console.error('Error loading all data:', error);
    return defaultData;
  }
};

// Clear all stored data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};

// Clear just recipes from storage
export const clearRecipesFromStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.RECIPES);
  } catch (error) {
    console.error('Error clearing recipes from storage:', error);
  }
}; 