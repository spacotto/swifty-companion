import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressBar({ label, percentage, valueText }) {
  const clamped = Math.min(Math.max(percentage, 0), 100);

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.valueText}>{valueText}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: '#ddd',
    fontSize: 14,
    fontWeight: '500',
  },
  valueText: {
    color: '#00babc',
    fontSize: 14,
    fontWeight: 'bold',
  },
  track: {
    height: 8,
    backgroundColor: '#27272a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#00babc',
    borderRadius: 4,
  },
});
