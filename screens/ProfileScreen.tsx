import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions, Image } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { useStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../services/firebase';
import { Settings } from '@tamagui/lucide-icons';

interface ProfileScreenProps {
}

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }: ProfileScreenProps & any) {
  const { userProfile, updateUserProfile } = useStore();
  const { user, isAuthenticated } = useAuth();

  const [randomProfilePic, setRandomProfilePic] = useState('');
  const [activeTab, setActiveTab] = useState<'weight' | 'nutrition'>('nutrition');

  // Generate random fresh-themed profile picture for unauthenticated users
  React.useEffect(() => {
    if (!isAuthenticated) {
      const freshFoodEmojis = [
        '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🥝',
        '🥑', '🥕', '🥬', '🥦', '🥒', '🍅', '🌽', '🥜', '🌰', '🥑',
        '🥝', '🍍', '🥭', '🍑', '🍒', '🍓', '🫐', '🥥', '🥝', '🍈'
      ];
      const randomEmoji = freshFoodEmojis[Math.floor(Math.random() * freshFoodEmojis.length)];
      setRandomProfilePic(randomEmoji);
    }
  }, [isAuthenticated]);





  const renderWeightGraph = () => {
    return (
      <View style={styles.graphContainer}>
        <View style={styles.graphHeader}>
          <Text style={styles.graphTitle}>Weight</Text>
        </View>
        <View style={styles.graph}>
          {/* Y-axis labels */}
          <View style={styles.yAxis}>
            <Text style={styles.yAxisLabel}>198</Text>
            <Text style={styles.yAxisLabel}>196</Text>
            <Text style={styles.yAxisLabel}>194</Text>
            <Text style={styles.yAxisLabel}>192</Text>
            <Text style={styles.yAxisLabel}>190</Text>
          </View>
          
          {/* Graph area */}
          <View style={styles.graphArea}>
            {/* Dashed line at current weight */}
            <View style={styles.dashedLine} />
            
            {/* Data point */}
            <View style={styles.dataPoint} />
            
            {/* Current weight label */}
            <Text style={styles.currentWeightLabel}>194.0 lbs</Text>
          </View>
          
          {/* X-axis labels */}
          <View style={styles.xAxis}>
            <Text style={styles.xAxisLabel}>12/03</Text>
            <Text style={styles.xAxisLabel}>13/03</Text>
          </View>
        </View>
      </View>
    );
  };



  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
          {/* User Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={require('../assets/icon.png')} style={styles.avatar} />
            </View>
            <View style={styles.userInfoSection}>
              <View style={styles.userInfoRow}>
                <View style={styles.userInfoContainer}>
                  <Text style={styles.userName}>{userProfile.name}</Text>
                </View>
                            <TouchableOpacity 
              style={styles.settingsIcon} 
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Settings size={20} color="#6b7280" />
            </TouchableOpacity>
              </View>
              <Text style={styles.userTagline}>Eat healthy</Text>
              <View style={styles.calorieGoalButton}>
                <Text style={styles.calorieGoalText}>{userProfile.calorieGoal} Cal / day</Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'nutrition' && styles.activeTab]} 
              onPress={() => setActiveTab('nutrition')}
            >
              <Text style={[styles.tabText, activeTab === 'nutrition' && styles.activeTabText]}>Nutrition</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'weight' && styles.activeTab]} 
              onPress={() => setActiveTab('weight')}
            >
              <Text style={[styles.tabText, activeTab === 'weight' && styles.activeTabText]}>Weight</Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'weight' ? (
            <View style={styles.tabContent}>
              <TouchableOpacity style={styles.addWeightButton}>
                <Text style={styles.addWeightButtonText}>Add a weight entry</Text>
              </TouchableOpacity>
              {renderWeightGraph()}
            </View>
          ) : (
            <View style={styles.tabContent}>
              <View style={styles.infoBox}>
                <Text style={styles.label}>Diet Preferences:</Text>
                <Text style={styles.value}>{userProfile.dietPreferences.join(', ')}</Text>
                <Text style={styles.label}>Favorite Cuisine:</Text>
                <Text style={styles.value}>{userProfile.favoriteCuisine}</Text>
                <Text style={styles.label}>Allergies:</Text>
                <Text style={styles.value}>{userProfile.allergies.join(', ') || 'None'}</Text>
              </View>
            </View>
          )}

        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#f0f9ff',
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfoSection: {
    flex: 1,
    justifyContent: 'center',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editIconText: {
    fontSize: 12,
  },
  userInfoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 8,
  },
  userTagline: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  calorieGoalButton: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  calorieGoalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginHorizontal: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1f2937',
  },
  tabText: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1f2937',
  },
  tabContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  addWeightButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  addWeightButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  graphContainer: {
    marginBottom: 24,
  },
  graphHeader: {
    marginBottom: 16,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  graph: {
    height: 200,
    flexDirection: 'row',
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  graphArea: {
    flex: 1,
    position: 'relative',
    marginLeft: 8,
  },
  dashedLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  dataPoint: {
    position: 'absolute',
    top: '50%',
    left: '30%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0d9488',
    marginTop: -6,
    marginLeft: -6,
  },
  currentWeightLabel: {
    position: 'absolute',
    top: '50%',
    left: '35%',
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: -10,
  },
  xAxis: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  xAxisLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontWeight: '600',
    color: '#1e40af',
    marginTop: 12,
    marginBottom: 4,
  },
  value: {
    color: '#1f2937',
    marginBottom: 8,
  },

  unlockContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  unlockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    marginTop: 24,
    marginBottom: 8,
  },
  unlockDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  unlockButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  unlockButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButton: {
    backgroundColor: '#1e40af',
  },
  signUpButton: {
    backgroundColor: '#059669',
  },
  unlockButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  randomAvatarContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#059669',
  },
  randomAvatar: {
    fontSize: 36,
    textAlign: 'center',
  },
});

 