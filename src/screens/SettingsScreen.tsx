import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function SettingsScreen() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [dailyReminders, setDailyReminders] = useState(true);
    const [monthlyReport, setMonthlyReport] = useState(true);

    const renderSettingRow = (icon: string, title: string, color: string, rightElement: JSX.Element, onPress?: () => void) => {
        const Wrapper = onPress ? TouchableOpacity : View;
        return (
            <Wrapper style={styles.settingRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <Ionicons name={icon as any} size={22} color={color} />
                </View>
                <Text style={styles.settingTitle}>{title}</Text>
                {rightElement}
            </Wrapper>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Preferences Section */}
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.card}>
                    {renderSettingRow("cash-outline", "Currency", "#10B981", (
                        <View style={styles.rowRight}>
                            <Text style={styles.settingValue}>USD ($)</Text>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </View>
                    ), () => {})}
                    
                    <View style={styles.divider} />

                    {renderSettingRow("moon-outline", "Dark Mode", "#8B5CF6", (
                        <Switch
                            value={isDarkMode}
                            onValueChange={setIsDarkMode}
                            trackColor={{ false: '#E5E7EB', true: '#1F35E4' }}
                            thumbColor={'#FFFFFF'}
                        />
                    ))}
                </View>

                {/* Notifications Section */}
                <Text style={styles.sectionTitle}>Notifications</Text>
                <View style={styles.card}>
                    {renderSettingRow("notifications-outline", "Daily Reminders", "#F59E0B", (
                        <Switch
                            value={dailyReminders}
                            onValueChange={setDailyReminders}
                            trackColor={{ false: '#E5E7EB', true: '#1F35E4' }}
                            thumbColor={'#FFFFFF'}
                        />
                    ))}
                    
                    <View style={styles.divider} />

                    {renderSettingRow("document-text-outline", "Monthly Report", "#3B82F6", (
                        <Switch
                            value={monthlyReport}
                            onValueChange={setMonthlyReport}
                            trackColor={{ false: '#E5E7EB', true: '#1F35E4' }}
                            thumbColor={'#FFFFFF'}
                        />
                    ))}
                </View>

                {/* Support Section */}
                <Text style={styles.sectionTitle}>Support & About</Text>
                <View style={styles.card}>
                    {renderSettingRow("help-circle-outline", "Help Center", "#6366F1", (
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    ), () => {})}
                    
                    <View style={styles.divider} />

                    {renderSettingRow("star-outline", "Rate the App", "#F59E0B", (
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    ), () => {})}
                    
                    <View style={styles.divider} />

                    {renderSettingRow("shield-checkmark-outline", "Privacy Policy", "#10B981", (
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    ), () => {})}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    container: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 120, // tab bar padding
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
        marginLeft: 8,
        marginTop: 8,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 8,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 2,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    settingTitle: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValue: {
        fontSize: 16,
        color: '#6B7280',
        marginRight: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 72, // Aligns with text, skipping the icon
        marginRight: 16,
    }
});

export default SettingsScreen;
