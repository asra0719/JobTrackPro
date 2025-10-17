import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BarChart from '../../components/BarChart';
import { useJobStore } from '../../store/jobStore';

export default function DashboardScreen() {
  const jobs = useJobStore((state) => state.jobs);
  const router = useRouter();
  
  const stats = useMemo(() => {
    return {
      total: jobs.length,
      applied: jobs.filter((j) => j.status === 'applied').length,
      interview: jobs.filter((j) => j.status === 'interview').length,
      offer: jobs.filter((j) => j.status === 'offer').length,
      rejected: jobs.filter((j) => j.status === 'rejected').length,
    };
  }, [jobs]);

  const chartData = useMemo(() => {
    return [
      { label: 'Applied', value: stats.applied, color: '#2196F3' },
      { label: 'Interview', value: stats.interview, color: '#FF9800' },
      { label: 'Offer', value: stats.offer, color: '#4CAF50' },
      { label: 'Rejected', value: stats.rejected, color: '#F44336' },
    ];
  }, [stats]);

  const maxChartValue = Math.max(...chartData.map(d => d.value), 1);

  const conversionRate = useMemo(() => {
    if (stats.total === 0) return 0;
    return ((stats.offer / stats.total) * 100).toFixed(1);
  }, [stats]);

  const responseRate = useMemo(() => {
    if (stats.total === 0) return 0;
    const responded = stats.interview + stats.offer + stats.rejected;
    return ((responded / stats.total) * 100).toFixed(1);
  }, [stats]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome Back! 👋</Text>
        <Text style={styles.subText}>Track your job applications</Text>
      </View>

      {/* Main Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Applications</Text>
        </View>

        <View style={[styles.statCard, styles.appliedCard]}>
          <Text style={styles.statNumber}>{stats.applied}</Text>
          <Text style={styles.statLabel}>Applied</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.interviewCard]}>
          <Text style={styles.statNumber}>{stats.interview}</Text>
          <Text style={styles.statLabel}>Interviews</Text>
        </View>

        <View style={[styles.statCard, styles.offerCard]}>
          <Text style={styles.statNumber}>{stats.offer}</Text>
          <Text style={styles.statLabel}>Offers</Text>
        </View>
      </View>

      {/* Analytics */}
      {stats.total > 0 && (
        <View style={styles.analyticsSection}>
          <Text style={styles.sectionTitle}>📊 Analytics</Text>
          
          <View style={styles.analyticsCard}>
            <View style={styles.analyticsRow}>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsValue}>{conversionRate}%</Text>
                <Text style={styles.analyticsLabel}>Offer Rate</Text>
              </View>
              <View style={styles.analyticsDivider} />
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsValue}>{responseRate}%</Text>
                <Text style={styles.analyticsLabel}>Response Rate</Text>
              </View>
            </View>
          </View>

          {/* Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Application Status Breakdown</Text>
            <BarChart data={chartData} maxValue={maxChartValue} />
          </View>
        </View>
      )}
{/*dfuheighjeiofgkwop*/}
      {/* Recent Applications */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Applications</Text>
          {jobs.length > 5 && (
            <Pressable onPress={() => router.push('/(tabs)/jobs')}>
              <Text style={styles.seeAllText}>See All →</Text>
            </Pressable>
          )}
        </View>

        {jobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No applications yet</Text>
            <Text style={styles.emptySubText}>
              Tap "Add" to create your first job application
            </Text>
          </View>
        ) : (
          jobs.slice(0, 5).map((job) => (
            <Pressable
              key={job.id}
              style={styles.jobCard}
              onPress={() => router.push(`/job-details?id=${job.id}`)}
            >
              <View style={styles.jobHeader}>
                <Text style={styles.jobPosition}>{job.position}</Text>
                <View style={[styles.statusBadge, styles[`${job.status}Badge`]]}>
                  <Text style={styles.statusText}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Text>
                </View>
              </View>
              <Text style={styles.jobCompany}>{job.company}</Text>
              <Text style={styles.jobLocation}>{job.location}</Text>
            </Pressable>
          ))
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
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
    paddingTop: 20,
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: 15,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appliedCard: {
    backgroundColor: '#E3F2FD',
  },
  interviewCard: {
    backgroundColor: '#FFF3E0',
  },
  offerCard: {
    backgroundColor: '#E8F5E9',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  analyticsSection: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  analyticsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  analyticsItem: {
    flex: 1,
    alignItems: 'center',
  },
  analyticsDivider: {
    width: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 20,
  },
  analyticsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  recentSection: {
    padding: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 15,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobPosition: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
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
  jobCompany: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  jobLocation: {
    fontSize: 12,
    color: '#999',
  },
});