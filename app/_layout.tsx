import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useJobStore } from '../store/jobStore';

export default function RootLayout() {
  const loadJobs = useJobStore((state) => state.loadJobs);

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}