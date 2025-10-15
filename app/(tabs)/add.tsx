import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useJobStore } from '../../store/jobStore';
import { useRouter } from 'expo-router';

export default function AddJobScreen() {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [notes, setNotes] = useState('');
  const [url, setUrl] = useState('');

  const addJob = useJobStore((state) => state.addJob);
  const router = useRouter();

  const handleSubmit = () => {
    if (!company || !position || !location) {
      Alert.alert('Error', 'Please fill in Company, Position, and Location');
      return;
    }

    addJob({
      company,
      position,
      location,
      salary,
      notes,
      url,
      status: 'applied',
      appliedDate: new Date().toISOString(),
    });

    Alert.alert('Success', 'Job application added!', [
      {
        text: 'OK',
        onPress: () => {
          // Clear form
          setCompany('');
          setPosition('');
          setLocation('');
          setSalary('');
          setNotes('');
          setUrl('');
          // Navigate to jobs tab
          router.push('/jobs');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Company Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Google, Microsoft, Apple"
          value={company}
          onChangeText={setCompany}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Position *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Frontend Developer"
          value={position}
          onChangeText={setPosition}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Location *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Remote, New York, London"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Salary (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., $80,000 - $100,000"
          value={salary}
          onChangeText={setSalary}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Job URL (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., https://company.com/jobs/123"
          value={url}
          onChangeText={setUrl}
          placeholderTextColor="#999"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Add any notes about this application..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor="#999"
        />

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Add Application</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    color: '#000',
  },
  notesInput: {
    height: 100,
    paddingTop: 15,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});