import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, Modal, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { useStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../services/firebase';

interface ProfileScreenProps {
  onLoginPress?: () => void;
  onSignUpPress?: () => void;
}

export default function ProfileScreen({ navigation, onLoginPress, onSignUpPress }: ProfileScreenProps & any) {
  const { userProfile, updateUserProfile } = useStore();
  const { user, isAuthenticated } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [editUser, setEditUser] = useState(userProfile);
  const [randomProfilePic, setRandomProfilePic] = useState('');

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

  return (
    <ScrollView contentContainerStyle={styles.center}>
      <HeaderBar title="Profile" />
      
      {!isAuthenticated ? (
        // Unlock content for unauthenticated users
        <View style={styles.unlockContainer}>
          {/* Random fresh-themed profile picture */}
          <View style={styles.randomAvatarContainer}>
            <Text style={styles.randomAvatar}>{randomProfilePic}</Text>
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
        </View>
      ) : (
        // Authenticated user content
        <>
          <Image source={userProfile.avatar || require('../assets/icon.png')} style={styles.avatar} />
          <Text style={styles.name}>{userProfile.name}</Text>
          <Text style={styles.email}>{user?.email || userProfile.email}</Text>
        </>
      )}
      
      {/* Firebase User Info */}
      {isAuthenticated && user && (
        <View style={styles.firebaseInfoBox}>
          <Text style={styles.firebaseInfoTitle}>Account Information</Text>
          <Text style={styles.firebaseInfoText}>User ID: {user.uid}</Text>
          <Text style={styles.firebaseInfoText}>
            Email Verified: {user.emailVerified ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.firebaseInfoText}>
            Account Created: {user.metadata.creationTime ? 
              new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'
            }
          </Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.label}>Diet Preferences:</Text>
        <Text style={styles.value}>{isAuthenticated ? userProfile.dietPreferences.join(', ') : 'Vegetarian, Mediterranean'}</Text>
        <Text style={styles.label}>Favorite Cuisine:</Text>
        <Text style={styles.value}>{isAuthenticated ? userProfile.favoriteCuisine : 'Mediterranean'}</Text>
        <Text style={styles.label}>Allergies:</Text>
        <Text style={styles.value}>{isAuthenticated ? userProfile.allergies.join(', ') : 'None'}</Text>
        <Text style={styles.label}>Daily Calorie Goal:</Text>
        <Text style={styles.value}>{isAuthenticated ? userProfile.calorieGoal : 2000} kcal</Text>
      </View>
      
      {isAuthenticated && (
        <>
          <TouchableOpacity style={styles.editButton} onPress={() => { setEditUser(userProfile); setModalVisible(true); }}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: 8,
  },
  value: {
    color: '#222',
    marginBottom: 4,
  },
  editButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    color: '#2563eb',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  firebaseInfoBox: {
    width: '100%',
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  firebaseInfoTitle: {
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
    fontSize: 18,
  },
  firebaseInfoText: {
    color: '#222',
    marginBottom: 4,
    fontSize: 16,
  },
  unlockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  unlockDescription: {
    fontSize: 16,
    color: '#1565C0',
    lineHeight: 22,
  },
  unlockButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  unlockContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  unlockButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
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
    backgroundColor: '#2196F3',
  },
  signUpButton: {
    backgroundColor: '#4CAF50',
  },
  randomAvatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  randomAvatar: {
    fontSize: 48,
    textAlign: 'center',
  },
});

 