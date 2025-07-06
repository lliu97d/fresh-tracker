import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { useStore } from '../store';

export default function ProfileScreen({ navigation }: any) {
  const { userProfile, updateUserProfile } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editUser, setEditUser] = useState(userProfile);

  const handleSave = () => {
    updateUserProfile(editUser);
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.center}>
      <HeaderBar title="Profile" />
      <Image source={userProfile.avatar || require('../assets/icon.png')} style={styles.avatar} />
      <Text style={styles.name}>{userProfile.name}</Text>
      <Text style={styles.email}>{userProfile.email}</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Diet Preferences:</Text>
        <Text style={styles.value}>{userProfile.dietPreferences.join(', ')}</Text>
        <Text style={styles.label}>Favorite Cuisine:</Text>
        <Text style={styles.value}>{userProfile.favoriteCuisine}</Text>
        <Text style={styles.label}>Allergies:</Text>
        <Text style={styles.value}>{userProfile.allergies.join(', ')}</Text>
        <Text style={styles.label}>Daily Calorie Goal:</Text>
        <Text style={styles.value}>{userProfile.calorieGoal} kcal</Text>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={() => { setEditUser(userProfile); setModalVisible(true); }}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={() => {}}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      <Button title="Back" onPress={() => navigation.goBack()} />

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
});

 