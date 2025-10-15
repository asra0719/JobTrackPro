import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useJobStore } from '../../store/jobStore';
import { useRouter } from 'expo-router';
import { useState, useMemo } from 'react';

export default function JobsScreen() {
  const jobs = useJobStore((state) => state.jobs);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'applied' | 'interview' | 'offer' | 'rejected'>('all');

  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((job) => job.status === filterStatus);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.company.toLowerCase().includes(query) ||
          job.position.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [jobs, searchQuery, filterStatus]);

  const statusCounts = useMemo(() => {
    return {
      all: jobs.length,
      applied: jobs.filter((j) => j.status === 'applied').length,
      interview: jobs.filter((j) => j.status === 'interview').length,
      offer: jobs.filter((j) => j.status === 'offer').length,
      rejected: jobs.filter((j) => j.status === 'rejected').length,
    };
  }, [jobs]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by company, position, or location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <Pressable
          style={[styles.filterChip, filterStatus === 'all' && styles.filterChipActive]}
          onPress={() => setFilterStatus('all')}
        >
          <Text style={[styles.filterText, filterStatus === 'all' && styles.filterTextActive]}>
            All ({statusCounts.all})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, styles.appliedChip, filterStatus === 'applied' && styles.filterChipActive]}
          onPress={() => setFilterStatus('applied')}
        >
          <Text style={[styles.filterText, filterStatus === 'applied' && styles.filterTextActive]}>
            Applied ({statusCounts.applied})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, styles.interviewChip, filterStatus === 'interview' && styles.filterChipActive]}
          onPress={() => setFilterStatus('interview')}
        >
          <Text style={[styles.filterText, filterStatus === 'interview' && styles.filterTextActive]}>
            Interview ({statusCounts.interview})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, styles.offerChip, filterStatus === 'offer' && styles.filterChipActive]}
          onPress={() => setFilterStatus('offer')}
        >
          <Text style={[styles.filterText, filterStatus === 'offer' && styles.filterTextActive]}>
            Offer ({statusCounts.offer})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, styles.rejectedChip, filterStatus === 'rejected' && styles.filterChipActive]}
          onPress={() => setFilterStatus('rejected')}
        >
          <Text style={[styles.filterText, filterStatus === 'rejected' && styles.filterTextActive]}>
            Rejected ({statusCounts.rejected})
          </Text>
        </Pressable>
      </ScrollView>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No jobs match your search'
              : filterStatus !== 'all'
              ? `No jobs with status: ${filterStatus}`
              : 'No job applications yet'}
          </Text>
          <Text style={styles.emptySubText}>
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Start tracking your applications by tapping "Add"'}
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.listContainer}>
            {filteredJobs.map((job) => (
              <Pressable
                key={job.id}
                style={styles.jobCard}
                onPress={() => router.push(`/job-details?id=${job.id}`)}
              >
                <View style={styles.jobHeader}>
                  <View style={styles.jobInfo}>
                    <Text style={styles.position}>{job.position}</Text>
                    <Text style={styles.company}>{job.company}</Text>
                    <Text style={styles.location}>{job.location}</Text>
                    {job.salary && (
                      <Text style={styles.salary}>💰 {job.salary}</Text>
                    )}
                  </View>
                  <View style={[styles.statusBadge, styles[`${job.status}Badge`]]}>
                    <Text style={styles.statusText}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.date}>
                    Applied: {new Date(job.appliedDate).toLocaleDateString()}
                  </Text>
                  <Text style={styles.tapText}>Tap to view details →</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  clearIcon: {
    fontSize: 20,
    color: '#999',
    padding: 5,
  },
  filterContainer: {
    maxHeight: 50,
    marginBottom: 10,
  },
  filterContent: {
    paddingHorizontal: 15,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
  },
  appliedChip: {
    backgroundColor: '#E3F2FD',
  },
  interviewChip: {
    backgroundColor: '#FFF3E0',
  },
  offerChip: {
    backgroundColor: '#E8F5E9',
  },
  rejectedChip: {
    backgroundColor: '#FFEBEE',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  listContainer: {
    padding: 15,
    paddingTop: 0,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  position: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  company: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 3,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  salary: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
  },
  appliedBadge: {
    backgroundColor: '#E3F2FD',
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
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  tapText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
});