import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import ProgressBar from '../components/ProgressBar';

export default function ProfileScreen({ route }) {
  const { user } = route.params;

  // Independent scope states for each box
  const [inProgressFilter, setInProgressFilter] = useState('cursus'); // 'cursus' | 'piscine'
  const [finishedFilter, setFinishedFilter] = useState('cursus');     // 'cursus' | 'piscine'

  // Modal visibility states
  const [activeModal, setActiveModal] = useState(null); // 'inProgress' | 'finished' | null

  // Locate primary 42 cursus
  const cursusUser = user.cursus_users?.find((c) => c.cursus.slug === '42cursus') 
    || user.cursus_users?.[0];

  const level = cursusUser ? cursusUser.level : 0;
  const levelPercentage = (level % 1) * 100;
  const skills = cursusUser?.skills || [];

  // Filter root projects
  const rootProjects = useMemo(() => {
    return (user.projects_users || []).filter((p) => !p.project.parent_id);
  }, [user.projects_users]);

  // Helper to identify Piscine projects
  const isPiscineProject = (proj) => {
    const ids = proj.cursus_ids || [];
    return ids.includes(1) || ids.includes(9) || proj.project.slug?.startsWith('c-piscine');
  };

  // Split, filter, and sort alphabetically
  const inProgressProjects = useMemo(() => {
    return rootProjects
      .filter((p) => p.status !== 'finished')
      .filter((p) => inProgressFilter === 'piscine' ? isPiscineProject(p) : !isPiscineProject(p))
      .sort((a, b) => a.project.name.localeCompare(b.project.name));
  }, [rootProjects, inProgressFilter]);

  const finishedProjects = useMemo(() => {
    return rootProjects
      .filter((p) => p.status === 'finished')
      .filter((p) => finishedFilter === 'piscine' ? isPiscineProject(p) : !isPiscineProject(p))
      .sort((a, b) => a.project.name.localeCompare(b.project.name));
  }, [rootProjects, finishedFilter]);

  const filterOptions = [
    { label: 'Cursus Projects', value: 'cursus' },
    { label: 'Piscine Projects', value: 'piscine' },
  ];

  const renderProjectBox = (title, projectList, currentFilter, modalKey) => (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithBadge}>
          <Text style={styles.sectionHeader}>{title}</Text>
          <Text style={styles.counterBadge}>{projectList.length}</Text>
        </View>

        <TouchableOpacity 
          style={styles.dropdownButton} 
          onPress={() => setActiveModal(modalKey)}
        >
          <Text style={styles.dropdownButtonText}>
            {currentFilter === 'cursus' ? 'Cursus' : 'Piscine'} ▾
          </Text>
        </TouchableOpacity>
      </View>

      {projectList.length === 0 ? (
        <Text style={styles.emptyText}>No projects to display.</Text>
      ) : (
        projectList.map((proj) => {
          const isValidated = proj['validated?'];
          const mark = proj.final_mark;

          return (
            <View key={proj.id} style={styles.projectRow}>
              <Text style={styles.projectName} numberOfLines={1}>
                {proj.project.name}
              </Text>
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
  );

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

      {/* Box 1: In Progress Projects */}
      {renderProjectBox('In Progress', inProgressProjects, inProgressFilter, 'inProgress')}

      {/* Box 2: Finished Projects */}
      {renderProjectBox('Finished', finishedProjects, finishedFilter, 'finished')}

      {/* Scope Selector Modal */}
      <Modal
        visible={activeModal !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setActiveModal(null)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Project Scope</Text>
            {filterOptions.map((opt) => {
              const isSelected = activeModal === 'inProgress' 
                ? inProgressFilter === opt.value 
                : finishedFilter === opt.value;

              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                  onPress={() => {
                    if (activeModal === 'inProgress') {
                      setInProgressFilter(opt.value);
                    } else if (activeModal === 'finished') {
                      setFinishedFilter(opt.value);
                    }
                    setActiveModal(null);
                  }}
                >
                  <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#27272a',
    paddingBottom: 8,
    marginBottom: 12,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f4f4f5',
  },
  counterBadge: {
    backgroundColor: '#27272a',
    color: '#00babc',
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  dropdownButton: {
    backgroundColor: '#27272a',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  dropdownButtonText: {
    color: '#00babc',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  modalTitle: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  modalOptionSelected: {
    backgroundColor: '#27272a',
  },
  modalOptionText: {
    color: '#f4f4f5',
    fontSize: 15,
  },
  modalOptionTextSelected: {
    color: '#00babc',
    fontWeight: 'bold',
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
    color: '#00ffff',
  },
  markFailed: {
    color: '#ff00ff',
  },
  markPending: {
    color: '#eab308',
  },
});
