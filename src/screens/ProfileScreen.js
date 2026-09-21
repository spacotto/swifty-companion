import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import ProgressBar from "../components/ProgressBar";

export default function ProfileScreen({ route }) {
  const { user } = route.params;

  // Filter root projects
  const rootProjects = useMemo(() => {
    return (user.projects_users || []).filter((p) => !p.project?.parent_id);
  }, [user.projects_users]);

  // Piscine match
  const isPiscineProject = (proj) => {
    const name = (proj.project?.name || "").trim();
    const slug = (proj.project?.slug || "").trim();

    if (/^exam[\s_-]*rank/i.test(name) || /^exam[\s_-]*rank/i.test(slug)) {
      return false;
    }

    const piscinePattern =
      /^(C Piscine\b|Day\s*\d{2}\b|BSQ\b|Rush\s*\d{2}|Exam\s*(?:\d{2}|Final)\b|Sastantua\b|Match-N-Match\b|EvalExpr\b)/i;
    return piscinePattern.test(name);
  };

  const hasCursusProjects = useMemo(() => {
    return rootProjects.some((p) => !isPiscineProject(p));
  }, [rootProjects]);

  const [projectFilter, setProjectFilter] = useState(hasCursusProjects ? "cursus" : "piscine");
  const [modalOpen, setModalOpen] = useState(false);

  // Locate primary 42 cursus
  const cursusUser =
    user.cursus_users?.find((c) => c.cursus.slug === "42cursus") ||
    user.cursus_users?.[0];

  const level = cursusUser ? cursusUser.level : 0;
  const levelPercentage = (level % 1) * 100;
  const skills = cursusUser?.skills || [];

  // Filter by selected scope and sort alphabetically
  const visibleProjects = useMemo(() => {
    return rootProjects
      .filter((p) => {
        if (projectFilter === "all") return true;
        return projectFilter === "piscine"
          ? isPiscineProject(p)
          : !isPiscineProject(p);
      })
      .sort((a, b) => (a.project?.name || "").localeCompare(b.project?.name || ""));
  }, [rootProjects, projectFilter]);

  const filterOptions = [
    { label: "Cursus Projects", value: "cursus" },
    { label: "Piscine Projects", value: "piscine" },
    { label: "All Projects", value: "all" },
  ];

  const currentFilterLabel =
    filterOptions.find((opt) => opt.value === projectFilter)?.label.replace(" Projects", "") || "Projects";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header Profile Section */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: user.image?.link || "https://via.placeholder.com/120",
          }}
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
            <Text style={styles.statValue}>
              {user.location || "Unavailable"}
            </Text>
          </View>
        </View>

        <View style={styles.levelContainer}>
          <ProgressBar
            label={`Level ${Math.floor(level)}`}
            percentage={levelPercentage}
            valueText={`${level.toFixed(2)} (${Math.round(levelPercentage)}%)`}
          />
        </View>
      </View>

      {/* Skills Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Skills</Text>
        {skills.length === 0 ? (
          <Text style={styles.emptyText}>No skills recorded.</Text>
        ) : (
          skills.map((skill) => {
            const skillPercentage = Math.min(Math.max((skill.level / 21) * 100, 0), 100);
            return (
              <ProgressBar
                key={skill.id}
                label={skill.name}
                percentage={skillPercentage}
                valueText={`lvl ${skill.level.toFixed(2)} (${skillPercentage.toFixed(0)}%)`}
              />
            );
          })
        )}
      </View>

      {/* Merged Projects Box */}
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <View style={styles.titleWithBadge}>
            <Text style={styles.sectionHeader}>Projects</Text>
            <Text style={styles.counterBadge}>{visibleProjects.length}</Text>
          </View>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setModalOpen(true)}
          >
            <Text style={styles.dropdownButtonText}>
              {currentFilterLabel} ▾
            </Text>
          </TouchableOpacity>
        </View>

        {visibleProjects.length === 0 ? (
          <Text style={styles.emptyText}>No projects to display.</Text>
        ) : (
          visibleProjects.map((proj) => {
            const isValidated = proj["validated?"];
            const mark = proj.final_mark;

            return (
              <View key={proj.id} style={styles.projectRow}>
                <Text style={styles.projectName} numberOfLines={1}>
                  {proj.project?.name || "Unknown Project"}
                </Text>
                <Text
                  style={[
                    styles.projectMark,
                    isValidated === true && styles.markSuccess,
                    isValidated === false && styles.markFailed,
                    isValidated === null && styles.markPending,
                  ]}
                >
                  {mark !== null ? mark : "In progress"}
                </Text>
              </View>
            );
          })
        )}
      </View>

      {/* Scope Selector Modal */}
      <Modal
        visible={modalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Project Scope</Text>
            {filterOptions.map((opt) => {
              const isSelected = projectFilter === opt.value;

              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.modalOption,
                    isSelected && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setProjectFilter(opt.value);
                    setModalOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      isSelected && styles.modalOptionTextSelected,
                    ]}
                  >
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
    backgroundColor: "#09090b",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: "#18181b",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#27272a",
    marginBottom: 12,
  },
  displayName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f4f4f5",
  },
  login: {
    fontSize: 14,
    color: "#00babc",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#27272a",
    marginBottom: 12,
  },
  statBox: {
    alignItems: "center",
  },
  statLabel: {
    color: "#a1a1aa",
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: "#f4f4f5",
    fontWeight: "bold",
    fontSize: 14,
  },
  levelContainer: {
    width: "100%",
    paddingTop: 8,
  },
  section: {
    backgroundColor: "#18181b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#27272a",
    paddingBottom: 8,
    marginBottom: 12,
  },
  titleWithBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f4f4f5",
  },
  counterBadge: {
    backgroundColor: "#27272a",
    color: "#00babc",
    fontWeight: "bold",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  dropdownButton: {
    backgroundColor: "#27272a",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#3f3f46",
  },
  dropdownButtonText: {
    color: "#00babc",
    fontSize: 13,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 280,
    backgroundColor: "#18181b",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  modalTitle: {
    color: "#a1a1aa",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  modalOptionSelected: {
    backgroundColor: "#27272a",
  },
  modalOptionText: {
    color: "#f4f4f5",
    fontSize: 15,
  },
  modalOptionTextSelected: {
    color: "#00babc",
    fontWeight: "bold",
  },
  emptyText: {
    color: "#71717a",
    fontStyle: "italic",
  },
  projectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#27272a",
  },
  projectName: {
    color: "#ddd",
    fontSize: 14,
    flex: 1,
  },
  projectMark: {
    fontWeight: "bold",
    fontSize: 14,
  },
  markSuccess: {
    color: "#00ffff",
  },
  markFailed: {
    color: "#ff00ff",
  },
  markPending: {
    color: "#eab308",
  },
});
