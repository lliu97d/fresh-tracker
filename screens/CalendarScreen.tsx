import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import HeaderBar from '../components/HeaderBar';
import RecipeCard from '../components/RecipeCard';
import { useStore } from '../store';
import { Recipe } from '../store/types';

function getRandomRecipe(recipes: Recipe[]): Recipe {
  return recipes[Math.floor(Math.random() * recipes.length)];
}

// Generate a meal plan for the current month
type MealPlan = { [date: string]: Recipe };

function generateMonthlyMealPlan(year: number, month: number, recipes: Recipe[]): MealPlan {
  const daysInMonth = new Date(year, month, 0).getDate();
  const plan: MealPlan = {};
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    plan[dateStr] = getRandomRecipe(recipes);
  }
  return plan;
}

export default function CalendarScreen({ navigation }: any) {
  const { recipes, mealPlans, getMealPlanByDate } = useStore();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<{ year: number; month: number }>({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });
  const [mealPlan, setMealPlan] = useState<MealPlan>(() =>
    generateMonthlyMealPlan(today.getFullYear(), today.getMonth() + 1, recipes)
  );

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const handleMonthChange = (monthObj: { year: number; month: number }) => {
    setCurrentMonth({ year: monthObj.year, month: monthObj.month });
    setMealPlan(generateMonthlyMealPlan(monthObj.year, monthObj.month, recipes));
  };

  const selectedMeal: Recipe | null = selectedDate ? mealPlan[selectedDate] : null;

  // Mark days with a dot if a meal is planned
  const markedDates: { [date: string]: any } = Object.keys(mealPlan).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: '#22c55e' };
    return acc;
  }, {} as { [date: string]: any });
  if (selectedDate) {
    markedDates[selectedDate] = { ...(markedDates[selectedDate] || {}), selected: true, selectedColor: '#2563eb' };
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderBar title="Meal Planner" />
      <Calendar
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#2563eb',
          todayTextColor: '#22c55e',
          arrowColor: '#2563eb',
        }}
        style={styles.calendar}
      />
      
      {/* Recipe List Section */}
      <View style={styles.recipeSection}>
        <Text style={styles.sectionTitle}>Available Recipes</Text>
        <ScrollView style={styles.recipeList} showsVerticalScrollIndicator={false}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </ScrollView>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Meal for {selectedDate}</Text>
            {selectedMeal ? (
              <View>
                <Text style={styles.mealName}>{selectedMeal.name}</Text>
                <Text style={styles.mealDetail}>Cuisine: {selectedMeal.cuisine}</Text>
                <Text style={styles.mealDetail}>Time: {selectedMeal.time}</Text>
                <Text style={styles.mealDetail}>Ingredients: {selectedMeal.ingredients.map(ing => ing.name).join(', ')}</Text>
              </View>
            ) : (
              <Text>No meal planned for this day.</Text>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  recipeSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  recipeList: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2563eb',
    textAlign: 'center',
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  mealDetail: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 30,
    backgroundColor: '#e0e7ef',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 