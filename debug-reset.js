const AsyncStorage = require('@react-native-async-storage/async-storage');

const STORAGE_KEYS = {
  FOOD_ITEMS: 'fresh_tracker_food_items',
  RECIPES: 'fresh_tracker_recipes',
  MEAL_PLANS: 'fresh_tracker_meal_plans',
  USER_PROFILE: 'fresh_tracker_user_profile',
  SHOPPING_LIST: 'fresh_tracker_shopping_list',
};

async function clearAllData() {
  console.log('🧹 Clearing all stored data...');
  
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    console.log('✅ All data cleared successfully!');
    
    // Verify data is cleared
    for (const [key, value] of Object.entries(STORAGE_KEYS)) {
      const data = await AsyncStorage.getItem(value);
      console.log(`${key}: ${data ? 'STILL EXISTS' : 'CLEARED'}`);
    }
    
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
}

clearAllData(); 