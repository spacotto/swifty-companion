import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Keyboard 
} from 'react-native';
import { fetchUserProfile } from '../api/user';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSearch = async () => {
    const login = query.trim().toLowerCase();
    if (!login) return;

    Keyboard.dismiss();
    setLoading(true);
    setErrorMsg(null);

    try {
      const userData = await fetchUserProfile(login);
      setLoading(false);
      navigation.navigate('Profile', { user: userData });
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search 42 Student</Text>
      
      <TextInput
        style={styles.input}
        placeholder="e.g. norminet, sheldon"
        placeholderTextColor="#71717a"
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          if (errorMsg) setErrorMsg(null);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSearch} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#09090b" />
        ) : (
          <Text style={styles.buttonText}>Search</Text>
        )}
      </TouchableOpacity>

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f4f4f5',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#18181b',
    color: '#f4f4f5',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#00babc',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#09090b',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#ef4444',
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
  },
});
