import { FoodItem, Recipe, UserProfile, MealPlan, ShoppingItem } from './types';

// Mock Food Items
export const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Fresh Spinach',
    quantity: 1,
    unit: 'bag',
    category: 'Vegetables',
    calories: 23,
    expirationDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    addedDate: new Date(),
    status: 'fresh',
    location: 'fresh',
  },
  {
    id: '2',
    name: 'Ground Beef',
    quantity: 1,
    unit: 'lb',
    category: 'Meat',
    calories: 250,
    expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    addedDate: new Date(),
    status: 'watch',
    location: 'fresh',
  },
  {
    id: '3',
    name: 'Milk',
    quantity: 1,
    unit: 'gallon',
    category: 'Dairy',
    calories: 42,
    expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    addedDate: new Date(),
    status: 'expiring',
    location: 'fresh',
  },
  {
    id: '4',
    name: 'Soy Sauce',
    quantity: 1,
    unit: 'bottle',
    category: 'Condiments',
    expirationDate: new Date('2026-03-14'),
    addedDate: new Date(),
    status: 'fresh',
    location: 'pantry',
  },
  {
    id: '5',
    name: 'Sea Salt',
    quantity: 500,
    unit: 'g',
    category: 'Spices',
    expirationDate: new Date('2026-12-31'),
    addedDate: new Date(),
    status: 'fresh',
    location: 'pantry',
  },
];

// Mock Recipes
export const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Chinese Beef Stir Fry',
    cuisine: 'Chinese',
    time: '20 mins',
    ingredients: [
      { name: 'Ground Beef', amount: 1, unit: 'lb' },
      { name: 'Spinach', amount: 2, unit: 'cups' },
      { name: 'Soy Sauce', amount: 2, unit: 'tbsp' },
      { name: 'Garlic', amount: 3, unit: 'cloves' },
      { name: 'Ginger', amount: 1, unit: 'tbsp' },
    ],
    instructions: [
      'Heat oil in a wok over high heat',
      'Add beef and stir-fry until browned',
      'Add garlic and ginger, stir for 30 seconds',
      'Add spinach and soy sauce',
      'Cook until spinach wilts, about 2 minutes',
    ],
    difficulty: 'easy',
    servings: 4,
    calories: 350,
    tags: ['quick', 'healthy', 'asian'],
  },
  {
    id: '2',
    name: 'Creamy Spinach Soup',
    cuisine: 'Western',
    time: '15 mins',
    ingredients: [
      { name: 'Spinach', amount: 4, unit: 'cups' },
      { name: 'Milk', amount: 2, unit: 'cups' },
      { name: 'Onion', amount: 1, unit: 'medium' },
      { name: 'Butter', amount: 2, unit: 'tbsp' },
      { name: 'Flour', amount: 2, unit: 'tbsp' },
    ],
    instructions: [
      'Sauté onion in butter until translucent',
      'Add flour and cook for 1 minute',
      'Gradually add milk while stirring',
      'Add spinach and cook until wilted',
      'Blend until smooth',
    ],
    difficulty: 'easy',
    servings: 4,
    calories: 180,
    tags: ['vegetarian', 'soup', 'quick'],
  },
  {
    id: '3',
    name: 'Grilled Chicken Salad',
    cuisine: 'American',
    time: '25 mins',
    ingredients: [
      { name: 'Chicken Breast', amount: 2, unit: 'pieces' },
      { name: 'Mixed Greens', amount: 4, unit: 'cups' },
      { name: 'Tomatoes', amount: 2, unit: 'medium' },
      { name: 'Cucumber', amount: 1, unit: 'medium' },
      { name: 'Olive Oil', amount: 2, unit: 'tbsp' },
    ],
    instructions: [
      'Season chicken with salt and pepper',
      'Grill chicken for 6-8 minutes per side',
      'Chop vegetables and mix in bowl',
      'Slice grilled chicken and add to salad',
      'Drizzle with olive oil and serve',
    ],
    difficulty: 'easy',
    servings: 2,
    calories: 320,
    tags: ['healthy', 'salad', 'protein'],
  },
];

// Mock User Profile
export const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  avatar: require('../assets/icon.png'),
  dietPreferences: ['Vegetarian', 'Gluten-Free'],
  favoriteCuisine: 'Italian',
  allergies: ['Peanuts'],
  calorieGoal: 2000,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock Meal Plans
export const mockMealPlans: MealPlan[] = [
  {
    id: '1',
    date: '2024-01-15',
    meals: {
      breakfast: mockRecipes[2], // Grilled Chicken Salad
      lunch: mockRecipes[0], // Chinese Beef Stir Fry
      dinner: mockRecipes[1], // Creamy Spinach Soup
    },
    notes: 'Using up spinach before it expires',
  },
  {
    id: '2',
    date: '2024-01-16',
    meals: {
      breakfast: mockRecipes[1], // Creamy Spinach Soup
      lunch: mockRecipes[2], // Grilled Chicken Salad
      dinner: mockRecipes[0], // Chinese Beef Stir Fry
    },
  },
];

// Mock Shopping List
export const mockShoppingItems: ShoppingItem[] = [
  {
    id: '1',
    name: 'Bananas',
    quantity: 6,
    unit: 'pieces',
    category: 'Fruits',
    completed: false,
    addedDate: new Date(),
  },
  {
    id: '2',
    name: 'Whole Wheat Bread',
    quantity: 1,
    unit: 'loaf',
    category: 'Bakery',
    completed: true,
    addedDate: new Date(),
  },
  {
    id: '3',
    name: 'Greek Yogurt',
    quantity: 2,
    unit: 'cups',
    category: 'Dairy',
    completed: false,
    addedDate: new Date(),
  },
]; 