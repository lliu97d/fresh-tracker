import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert } from 'react-native';
import { useStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../services/firebase';
import { Settings, ChevronRight, ArrowLeft } from '@tamagui/lucide-icons';

interface EditProfileScreenProps {
  navigation: any;
}

export default function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const { userProfile, updateUserProfile } = useStore();
  const { user } = useAuth();
  const [editUser, setEditUser] = useState(userProfile);



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

  const renderField = (label: string, value: string, onPress?: () => void, isEditable: boolean = true) => (
    <TouchableOpacity 
      style={styles.fieldContainer} 
      onPress={onPress}
      disabled={!isEditable}
    >
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValueContainer}>
        <Text style={styles.fieldValue} numberOfLines={1}>
          {value || 'Not set'}
        </Text>
        {isEditable && <ChevronRight size={16} color="#9ca3af" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={userProfile.avatar || require('../assets/icon.png')} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Settings size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Information Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.card}>
            {renderField(
              'Name', 
              editUser.name, 
              () => {
                Alert.prompt('Edit Name', 'Enter your name', [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Save', 
                    onPress: (name) => {
                      if (name) {
                        const updatedUser = { ...editUser, name };
                        setEditUser(updatedUser);
                        updateUserProfile(updatedUser);
                      }
                    }
                  }
                ], 'plain-text', editUser.name);
              }
            )}
            {renderField(
              'Email', 
              user?.email || editUser.email || 'No email', 
              undefined, 
              false
            )}

          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diet Preferences</Text>
          <View style={styles.card}>
            {renderField(
              'Diet Preferences', 
              editUser.dietPreferences.join(', ') || 'None set', 
              () => {
                Alert.prompt('Edit Diet Preferences', 'Enter your diet preferences (comma separated)', [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Save', 
                    onPress: (prefs) => {
                      const preferences = prefs ? prefs.split(',').map(p => p.trim()) : [];
                      const updatedUser = { ...editUser, dietPreferences: preferences };
                      setEditUser(updatedUser);
                      updateUserProfile(updatedUser);
                    }
                  }
                ], 'plain-text', editUser.dietPreferences.join(', '));
              }
            )}
            {renderField(
              'Favorite Cuisine', 
              editUser.favoriteCuisine || 'Not set', 
              () => {
                Alert.prompt('Edit Favorite Cuisine', 'Enter your favorite cuisine', [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Save', 
                    onPress: (cuisine) => {
                      if (cuisine) {
                        const updatedUser = { ...editUser, favoriteCuisine: cuisine };
                        setEditUser(updatedUser);
                        updateUserProfile(updatedUser);
                      }
                    }
                  }
                ], 'plain-text', editUser.favoriteCuisine || '');
              }
            )}
            {renderField(
              'Allergies', 
              editUser.allergies.join(', ') || 'None', 
              () => {
                Alert.prompt('Edit Allergies', 'Enter your allergies (comma separated)', [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Save', 
                    onPress: (allergies) => {
                      const allergyList = allergies ? allergies.split(',').map(a => a.trim()) : [];
                      const updatedUser = { ...editUser, allergies: allergyList };
                      setEditUser(updatedUser);
                      updateUserProfile(updatedUser);
                    }
                  }
                ], 'plain-text', editUser.allergies.join(', '));
              }
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals</Text>
          <View style={styles.card}>
            {renderField(
              'Daily Calorie Goal', 
              `${editUser.calorieGoal} calories`, 
              () => {
                Alert.prompt('Edit Calorie Goal', 'Enter your daily calorie goal', [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Save', 
                    onPress: (goal) => {
                      const calorieGoal = parseInt(goal || '2000') || 2000;
                      const updatedUser = { ...editUser, calorieGoal };
                      setEditUser(updatedUser);
                      updateUserProfile(updatedUser);
                    }
                  }
                ], 'plain-text', editUser.calorieGoal.toString());
              }
            )}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer for bottom padding */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#388E3C',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  fieldLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  fieldValue: {
    fontSize: 16,
    color: '#6b7280',
    marginRight: 8,
    textAlign: 'right',
    flex: 1,
  },
  bottomSpacer: {
    height: 100,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
}); 