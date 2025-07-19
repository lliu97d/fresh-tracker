import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, Modal, TextInput, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { useStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../services/firebase';
import { Settings } from '@tamagui/lucide-icons';

interface ProfileScreenProps {
  onLoginPress?: () => void;
  onSignUpPress?: () => void;
}

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation, onLoginPress, onSignUpPress }: ProfileScreenProps & any) {
  const { userProfile, updateUserProfile } = useStore();
  const { user, isAuthenticated } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [editUser, setEditUser] = useState(userProfile);
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

  const handleSave = () => {
    updateUserProfile(editUser);
    setModalVisible(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await signOutUser();
              if (error) {
                Alert.alert('Error', 'Failed to logout. Please try again.');
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred.');
            }
          },
        },
      ]
    );
  };

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
      
      {!isAuthenticated ? (
        // Unlock content for unauthenticated users
        <ScrollView contentContainerStyle={styles.unlockContainer}>
          <View style={styles.profileSection}>
            <View style={styles.randomAvatarContainer}>
              <Text style={styles.randomAvatar}>{randomProfilePic}</Text>
              <TouchableOpacity style={styles.editIcon}>
                <Text style={styles.editIconText}>✏️</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.userInfoSection}>
              <View style={styles.userInfoContainer}>
                <Text style={styles.userName}>Fresh User</Text>
                <TouchableOpacity style={styles.editIcon}>
                  <Text style={styles.editIconText}>✏️</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.userTagline}>Eat healthy</Text>
              <View style={styles.calorieGoalButton}>
                <Text style={styles.calorieGoalText}>2000 Cal / day</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.unlockTitle}>Unlock Your Food Journey</Text>
          <Text style={styles.unlockDescription}>
            Sign in to track your own food items, get personalized recipes, and never waste food again!
          </Text>
          <View style={styles.unlockButtonContainer}>
            <TouchableOpacity 
              style={[styles.unlockButton, styles.signInButton]}
              onPress={onLoginPress}
            >
              <Text style={styles.unlockButtonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.unlockButton, styles.signUpButton]}
              onPress={onSignUpPress}
            >
              <Text style={styles.unlockButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        // Authenticated user content
        <ScrollView style={styles.scrollView}>
          {/* User Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={userProfile.avatar || require('../assets/icon.png')} style={styles.avatar} />
            </View>
            <View style={styles.userInfoSection}>
              <View style={styles.userInfoRow}>
                <View style={styles.userInfoContainer}>
                  <Text style={styles.userName}>{userProfile.name}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.settingsIcon} 
                  onPress={() => { setEditUser(userProfile); setModalVisible(true); }}
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

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton} onPress={() => { setEditUser(userProfile); setModalVisible(true); }}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <ScrollView>
              <TextInput
                style={styles.input}
                value={editUser.name}
                onChangeText={name => setEditUser({ ...editUser, name })}
                placeholder="Name"
              />
              <TextInput
                style={styles.input}
                value={editUser.email}
                onChangeText={email => setEditUser({ ...editUser, email })}
                placeholder="Email"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                value={editUser.dietPreferences.join(', ')}
                onChangeText={text => setEditUser({ ...editUser, dietPreferences: text.split(',').map(s => s.trim()) })}
                placeholder="Diet Preferences (comma separated)"
              />
              <TextInput
                style={styles.input}
                value={editUser.favoriteCuisine}
                onChangeText={favoriteCuisine => setEditUser({ ...editUser, favoriteCuisine })}
                placeholder="Favorite Cuisine"
              />
              <TextInput
                style={styles.input}
                value={editUser.allergies.join(', ')}
                onChangeText={text => setEditUser({ ...editUser, allergies: text.split(',').map(s => s.trim()) })}
                placeholder="Allergies (comma separated)"
              />
              <TextInput
                style={styles.input}
                value={editUser.calorieGoal.toString()}
                onChangeText={calorieGoal => setEditUser({ ...editUser, calorieGoal: parseInt(calorieGoal) || 0 })}
                placeholder="Daily Calorie Goal"
                keyboardType="numeric"
              />
            </ScrollView>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={handleSave} />
            </View>
          </View>
        </View>
      </Modal>
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
  actionButtons: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  editButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e40af',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
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

 