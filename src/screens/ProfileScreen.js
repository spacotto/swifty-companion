import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import ProgressBar from '../components/ProgressBar';

export default function ProfileScreen({ route }) {
  const { user } = route.params;

  // Locate the primary 42 cursus (or fallback to first available cursus)
  const cursusUser = user.cursus_users?.find((c) => c.cursus.slug === '42cursus') 
    || user.cursus_users?.[0];

  const level = cursusUser ? cursusUser.level : 0;
  const levelPercentage = (level % 1) * 100;
  const skills = cursusUser?.skills || [];
  const projects = user.projects_users || [];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header Profile Section */}
      <View style={styles.profileCard}>
        <Image 
          source={{ uri: user.image?.link || 'https://via.placeholder.com/120' }} 
          style={styles.avatar} 
        />
        <Text style={styles.displayName}>{user.displayname || user.login}</Text>
        <Text style={styles.login}>@{user.login}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Wallet</Text>
            <Text style={styles.statValue}>{user.wallet} ₳</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Eval Points</Text>
            <Text style={styles.statValue}>{user.correction_point}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Location</Text>
            <Text style={styles.statValue}>{user.location || 'Unavailable'}</Text>
          </View>
        </View>

        <View style={styles.levelContainer}>
          <ProgressBar 
            label={`Level ${Math.floor(level)}`} 
            percentage={levelPercentage} 
            valueText={`${level.toFixed(2)}`} 
          />
        </View>
      </View>

      {/* Skills Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Skills</Text>
        {skills.length === 0 ? (
          <Text style={styles.emptyText}>No skills recorded.</Text>
        ) : (
          skills.map((skill) => (
            <ProgressBar
              key={skill.id}
              label={skill.name}
              percentage={(skill.level / 21) * 100}
              valueText={`lvl ${skill.level.toFixed(2)}`}
            />
          ))
        )}
      </View>

      {/* Projects Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Projects</Text>
        {projects.length === 0 ? (
          <Text style={styles.emptyText}>No project data available.</Text>
        ) : (
          projects.map((proj) => {
            const isValidated = proj['validated?'];
            const mark = proj.final_mark;

            return (
              <View key={proj.id} style={styles.projectRow}>
                <Text style={styles.projectName}>{proj.project.name}</Text>
                <Text
                  style={[
                    styles.projectMark,
                    isValidated === true && styles.markSuccess,
                    isValidated === false && styles.markFailed,
                    isValidated === null && styles.markPending,
                  ]}
                >
                  {mark !== null ? mark : 'In progress'}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#27272a',
    marginBottom: 12,
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f4f4f5',
  },
  login: {
    fontSize: 14,
    color: '#00babc',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#27272a',
    marginBottom: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#a1a1aa',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#f4f4f5',
    fontWeight: 'bold',
    fontSize: 14,
  },
  levelContainer: {
    width: '100%',
    paddingTop: 8,
  },
  section: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f4f4f5',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#27272a',
    paddingBottom: 6,
  },
  emptyText: {
    color: '#71717a',
    fontStyle: 'italic',
  },
  projectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#27272a',
  },
  projectName: {
    color: '#ddd',
    fontSize: 14,
    flex: 1,
  },
  projectMark: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  markSuccess: {
    color: '#22c55e',
  },
  markFailed: {
    color: '#ef4444',
  },
  markPending: {
    color: '#eab308',
  },
});
