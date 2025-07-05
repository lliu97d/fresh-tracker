const axios = require('axios');

const SPOONACULAR_API_KEY = '10f3c6ab3ce6470faa705a6151db778a';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

async function testAPI() {
  console.log('🧪 Testing Recipe API...\n');
  
  try {
    // Test 1: Simple search
    console.log('1. Testing simple search...');
    const searchResponse = await axios.get(`${SPOONACULAR_BASE_URL}/complexSearch`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        query: 'chicken',
        number: 3,
        addRecipeInformation: true,
        fillIngredients: true,
      }
    });
    console.log(`✅ Search returned ${searchResponse.data.results.length} recipes\n`);
    
    // Test 2: Ingredients search
    console.log('2. Testing ingredients search...');
    const ingredientsResponse = await axios.get(`${SPOONACULAR_BASE_URL}/findByIngredients`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        ingredients: 'chicken,rice',
        ranking: 2,
        ignorePantry: true,
        number: 3,
      }
    });
    console.log(`✅ Ingredients search returned ${ingredientsResponse.data.length} recipes\n`);
    
    // Test 3: Get detailed recipe
    if (ingredientsResponse.data.length > 0) {
      console.log('3. Testing detailed recipe fetch...');
      const recipeId = ingredientsResponse.data[0].id;
      const detailResponse = await axios.get(`${SPOONACULAR_BASE_URL}/${recipeId}/information`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
        }
      });
      console.log(`✅ Detailed recipe: ${detailResponse.data.title}\n`);
    }
    
    console.log('🎉 All API tests passed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testAPI(); 