# Recipe API Setup Guide

## Getting Started with Spoonacular API

Your FreshTracker app now includes recipe API integration using Spoonacular! Here's how to set it up:

### 1. Get Your Free API Key

1. Go to [Spoonacular API](https://spoonacular.com/food-api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. **Free tier includes 150 requests/day** - perfect for development!

### 2. Configure the API Key

Open `services/recipeAPI.ts` and replace the placeholder:

```typescript
const SPOONACULAR_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
```

### 3. Features Available

✅ **Smart Recipe Suggestions**
- Based on your expiring food items
- Respects dietary preferences and allergies
- Prioritizes ingredients you need to use

✅ **Recipe Search**
- Search by name, cuisine, diet
- Filter by cooking time
- Exclude allergens

✅ **Personalized Recommendations**
- Uses your food inventory
- Considers your profile preferences
- Suggests recipes to reduce food waste

### 4. How It Works

1. **Personalized Suggestions**: The app analyzes your expiring items and suggests recipes to use them
2. **Smart Search**: Search for any recipe with filters
3. **Integration**: Recipes automatically save to your local storage
4. **Meal Planning**: Use suggested recipes in your calendar

### 5. API Limits & Costs

- **Free Tier**: 150 requests/day
- **Paid Plans**: Start at $10/month for 1,500 requests/day
- **Enterprise**: Custom pricing for high-volume usage

### 6. Alternative APIs

If you want to explore other options:

- **Edamam Recipe API**: Good for nutrition-focused recipes
- **Food2Fork API**: Simple recipe search
- **Recipe Puppy**: Free but limited data

### 7. Testing

1. Add some food items to your inventory
2. Set some items as "expiring" or "watch"
3. Go to Recipes tab
4. Tap "Refresh Suggestions"
5. Try searching for specific recipes

### 8. Next Steps

Once you have the API working, consider:

- **AI Integration**: Add ChatGPT API for more personalized suggestions
- **Nutrition APIs**: Integrate detailed nutrition analysis
- **Shopping APIs**: Connect with grocery delivery services
- **Social Features**: Share recipes with friends

## Why Recipe API vs AI API?

**Recipe API (Recommended First):**
- ✅ Structured, reliable data
- ✅ Fast integration
- ✅ Cost-effective
- ✅ Proven quality recipes
- ✅ Works with your existing features

**AI API (Future Enhancement):**
- 🔄 More personalized suggestions
- 🔄 Creative recipe generation
- 🔄 Natural language interaction
- 🔄 Higher cost per request
- 🔄 Requires more complex integration

Start with the Recipe API to get immediate value, then consider adding AI features later for enhanced personalization! 