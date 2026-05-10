import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactionStore } from "../store/useTransactionStore";

export function ProfileScreen({ navigation }: any) {
    const transactions = useTransactionStore((state) => state.transactions);

    // Calculate all-time stats
    const { allTimeIncome, allTimeExpense } = useMemo(() => {
        let income = 0;
        let expense = 0;
        transactions.forEach((tx) => {
            if (tx.type === 'income') income += tx.amount;
            else if (tx.type === 'expense') expense += tx.amount;
        });
        return { allTimeIncome: income, allTimeExpense: expense };
    }, [transactions]);

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Log Out", 
                    style: "destructive",
                    onPress: () => {
                        // Navigate up through TabNavigator to the Stack root, then to Login
                        // We use navigation.getParent() to go to the root StackNavigator
                        const parent = navigation.getParent();
                        if (parent) {
                            parent.replace("Login");
                        } else {
                            navigation.replace("Login");
                        }
                    } 
                }
            ]
        );
    };

    const renderMenuItem = (icon: string, title: string, color: string, onPress: () => void) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={[styles.menuIconContainer, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon as any} size={22} color={color} />
            </View>
            <Text style={styles.menuTitle}>{title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header / Avatar Section */}
                <View style={styles.headerContainer}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>JD</Text>
                    </View>
                    <Text style={styles.userName}>John Doe</Text>
                    <Text style={styles.userEmail}>john.doe@example.com</Text>
                </View>

                {/* Stats Section */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Lifetime Income</Text>
                        <Text style={[styles.statValue, { color: '#10B981' }]}>
                            ${allTimeIncome.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Lifetime Expense</Text>
                        <Text style={[styles.statValue, { color: '#EF4444' }]}>
                            ${allTimeExpense.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Account Section */}
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.menuCard}>
                    {renderMenuItem("person-outline", "Edit Profile", "#3B82F6", () => {})}
                    {renderMenuItem("shield-checkmark-outline", "Security", "#10B981", () => {})}
                    {renderMenuItem("notifications-outline", "Notifications", "#F59E0B", () => {})}
                </View>

                {/* Data Section */}
                <Text style={styles.sectionTitle}>Data</Text>
                <View style={styles.menuCard}>
                    {renderMenuItem("download-outline", "Export Transactions", "#8B5CF6", () => {})}
                    {renderMenuItem("trash-outline", "Clear All Data", "#EF4444", () => {
                        Alert.alert("Careful!", "This will permanently delete your data in a real app.");
                    })}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>SpendWise App v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    container: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 120, // Tab bar padding
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1F35E4',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#1F35E4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#6B7280',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginHorizontal: 6,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
        marginLeft: 8,
    },
    menuCard: {
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
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuTitle: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        paddingVertical: 16,
        borderRadius: 16,
        marginTop: 8,
        marginBottom: 24,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#EF4444',
        marginLeft: 8,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
    }
});

export default ProfileScreen;
