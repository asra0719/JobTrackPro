import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useJobStore } from '../store/jobStore';
import { useState, useEffect } from 'react';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const job = useJobStore((state) => state.getJobById(id as string));
  const updateJob = useJobStore((state) => state.updateJob);
  const deleteJob = useJobStore((state) => state.deleteJob);

  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [notes, setNotes] = useState('');
  const [url, setUrl] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    if (job) {
      setCompany(job.company);
      setPosition(job.position);
      setLocation(job.location);
      setSalary(job.salary || '');
      setNotes(job.notes || '');
      setUrl(job.url || '');
      setContactPerson(job.contactPerson || '');
      setContactEmail(job.contactEmail || '');
    }
  }, [job]);

  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Job not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (!company || !position || !location) {
      Alert.alert('Error', 'Please fill in Company, Position, and Location');
      return;
    }

    updateJob(job.id, {
      company,
      position,
      location,
      salary,
      notes,
      url,
      contactPerson,
      contactEmail,
    });

    setIsEditing(false);
    Alert.alert('Success', 'Job updated successfully!');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Job',
      `Are you sure you want to delete ${company}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteJob(job.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleStatusChange = () => {
    const statuses: Array<'applied' | 'interview' | 'offer' | 'rejected'> = [
      'applied',
      'interview',
      'offer',
      'rejected',
    ];
    const currentIndex = statuses.indexOf(job.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    updateJob(job.id, { status: nextStatus });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          {!isEditing && (
            <Pressable
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          )}
        </View>

        {!isEditing ? (
          <>
            <Text style={styles.position}>{job.position}</Text>
            <Text style={styles.company}>{job.company}</Text>
            <Pressable
              style={[styles.statusBadge, styles[`${job.status}Badge`]]}
              onPress={handleStatusChange}
            >
              <Text style={styles.statusText}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.editForm}>
            <Text style={styles.label}>Position *</Text>
            <TextInput
              style={styles.input}
              value={position}
              onChangeText={setPosition}
              placeholder="e.g., Software Engineer"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Company *</Text>
            <TextInput
              style={styles.input}
              value={company}
              onChangeText={setCompany}
              placeholder="e.g., Google"
              placeholderTextColor="#999"
            />
          </View>
        )}
      </View>

      <View style={styles.content}>
        {!isEditing ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📍 Location</Text>
              <Text style={styles.sectionText}>{job.location}</Text>
            </View>

            {job.salary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>💰 Salary</Text>
                <Text style={styles.sectionText}>{job.salary}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📅 Applied Date</Text>
              <Text style={styles.sectionText}>
                {new Date(job.appliedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>

            {job.url && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔗 Job URL</Text>
                <Text style={styles.linkText}>{job.url}</Text>
              </View>
            )}

            {job.contactPerson && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>👤 Contact Person</Text>
                <Text style={styles.sectionText}>{job.contactPerson}</Text>
              </View>
            )}

            {job.contactEmail && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📧 Contact Email</Text>
                <Text style={styles.linkText}>{job.contactEmail}</Text>
              </View>
            )}

            {job.notes && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📝 Notes</Text>
                <Text style={styles.sectionText}>{job.notes}</Text>
              </View>
            )}

            <Pressable style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteText}>🗑️ Delete Application</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.editForm}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g., Remote"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Salary</Text>
            <TextInput
              style={styles.input}
              value={salary}
              onChangeText={setSalary}
              placeholder="e.g., $80,000 - $100,000"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Job URL</Text>
            <TextInput
              style={styles.input}
              value={url}
              onChangeText={setUrl}
              placeholder="https://..."
              placeholderTextColor="#999"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Contact Person</Text>
            <TextInput
              style={styles.input}
              value={contactPerson}
              onChangeText={setContactPerson}
              placeholder="e.g., John Smith"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Contact Email</Text>
            <TextInput
              style={styles.input}
              value={contactEmail}
              onChangeText={setContactEmail}
              placeholder="e.g., john@company.com"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />

            <View style={styles.buttonRow}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => {
                  setIsEditing(false);
                  // Reset fields
                  if (job) {
                    setCompany(job.company);
                    setPosition(job.position);
                    setLocation(job.location);
                    setSalary(job.salary || '');
                    setNotes(job.notes || '');
                    setUrl(job.url || '');
                    setContactPerson(job.contactPerson || '');
                    setContactEmail(job.contactEmail || '');
                  }
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  position: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  company: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 15,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  appliedBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  interviewBadge: {
    backgroundColor: '#FFF3E0',
  },
  offerBadge: {
    backgroundColor: '#E8F5E9',
  },
  rejectedBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
    lineHeight: 24,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editForm: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#000',
  },
  notesInput: {
    height: 100,
    paddingTop: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 30,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});