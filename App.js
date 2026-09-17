import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { fetchUserProfile } from './src/api/user';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your own 42 login to verify
    fetchUserProfile('norminet')
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#00babc" />}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {data && (
        <View>
          <Text style={styles.success}>Connected to 42 API!</Text>
          <Text style={styles.text}>Login: {data.login}</Text>
          <Text style={styles.text}>Email: {data.email}</Text>
          <Text style={styles.text}>Wallet: {data.wallet}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e24',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 4,
  },
  success: {
    color: '#00babc',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  error: {
    color: '#ff5555',
    fontSize: 16,
  },
});
