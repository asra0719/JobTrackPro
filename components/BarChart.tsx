import { View, Text, StyleSheet } from 'react-native';

interface BarChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  maxValue: number;
}

export default function BarChart({ data, maxValue }: BarChartProps) {
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        
        return (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <Text style={styles.valueText}>{item.value}</Text>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${Math.max(heightPercentage, 5)}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.labelText}>{item.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  barWrapper: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '80%',
    borderRadius: 8,
    minHeight: 10,
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  labelText: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});