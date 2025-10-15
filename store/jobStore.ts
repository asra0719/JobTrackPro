import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Job } from '../types';

interface JobStore {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id'>) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  getJobById: (id: string) => Job | undefined;
  loadJobs: () => Promise<void>;
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],

  addJob: (job) => {
    const newJob: Job = {
      ...job,
      id: Date.now().toString(),
    };
    
    const updatedJobs = [...get().jobs, newJob];
    set({ jobs: updatedJobs });
    AsyncStorage.setItem('jobs', JSON.stringify(updatedJobs));
  },

  updateJob: (id, updates) => {
    const updatedJobs = get().jobs.map((job) =>
      job.id === id ? { ...job, ...updates } : job
    );
    set({ jobs: updatedJobs });
    AsyncStorage.setItem('jobs', JSON.stringify(updatedJobs));
  },

  deleteJob: (id) => {
    const updatedJobs = get().jobs.filter((job) => job.id !== id);
    set({ jobs: updatedJobs });
    AsyncStorage.setItem('jobs', JSON.stringify(updatedJobs));
  },

  getJobById: (id) => {
    return get().jobs.find((job) => job.id === id);
  },

  loadJobs: async () => {
    try {
      const stored = await AsyncStorage.getItem('jobs');
      if (stored) {
        set({ jobs: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  },
}));