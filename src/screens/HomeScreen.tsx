import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactionStore } from "../store/useTransactionStore";
import { getCategoryDetails } from "../constants/categories";

export function HomeScreen() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [tempYear, setTempYear] = useState(new Date().getFullYear());

    const transactions = useTransactionStore((state) => state.transactions);

    const { income, expense, balance, filteredTransactions } = useMemo(() => {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        let inc = 0;
        let exp = 0;
        const filtered: typeof transactions = [];

        transactions.forEach((tx) => {
            const txDate = new Date(tx.date);
            if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
                filtered.push(tx);
                if (tx.type === 'income') {
                    inc += tx.amount;
                } else if (tx.type === 'expense') {
                    exp += tx.amount;
                }
            }
        });

        // Sort by date newest first
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return {
            income: inc,
            expense: exp,
            balance: inc - exp,
            filteredTransactions: filtered,
        };
    }, [transactions, currentDate]);

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const openPicker = () => {
        setTempYear(currentDate.getFullYear());
        setShowPicker(true);
    };

    const selectMonth = (monthIndex: number) => {
        setCurrentDate(new Date(tempYear, monthIndex, 1));
        setShowPicker(false);
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hello, User 👋</Text>

                    {/* Month Selector */}
                    <View style={styles.monthSelector}>
                        <TouchableOpacity onPress={goToPreviousMonth} style={styles.chevronButton}>
                            <Ionicons name="chevron-back" size={24} color="#111827" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={openPicker} activeOpacity={0.7}>
                            <Text style={styles.monthText}>{formattedDate}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={goToNextMonth} style={styles.chevronButton}>
                            <Ionicons name="chevron-forward" size={24} color="#111827" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Horizontal Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Income</Text>
                        <Text style={styles.incomeText}>${income.toFixed(2)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Expense</Text>
                        <Text style={styles.expenseText}>${expense.toFixed(2)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Balance</Text>
                        <Text style={styles.balanceText}>${balance.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Recent Transactions */}
                <View style={styles.transactionsHeader}>
                    <Text style={styles.transactionsTitle}>Recent Transactions</Text>
                </View>

                {filteredTransactions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
                        <Text style={styles.emptyStateText}>No transactions this month</Text>
                    </View>
                ) : (
                    filteredTransactions.map((tx) => {
                        const category = getCategoryDetails(tx.type, tx.categoryId);
                        const isIncome = tx.type === 'income';
                        return (
                            <View key={tx.id} style={styles.transactionItem}>
                                <View style={[styles.transactionIconContainer, { backgroundColor: category.color + '20' }]}>
                                    <Ionicons name={category.icon as any} size={24} color={category.color} />
                                </View>
                                <View style={styles.transactionDetails}>
                                    <Text style={styles.transactionName}>{category.name}</Text>
                                    <Text style={styles.transactionDate}>
                                        {new Date(tx.date).toLocaleDateString()} {tx.note ? `• ${tx.note}` : ''}
                                    </Text>
                                </View>
                                <Text style={[
                                    styles.transactionAmount,
                                    { color: isIncome ? '#10B981' : (tx.type === 'expense' ? '#EF4444' : '#6B7280') }
                                ]}>
                                    {isIncome ? '+' : (tx.type === 'expense' ? '-' : '')}${tx.amount.toFixed(2)}
                                </Text>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            {/* Custom Month/Year Picker Modal */}
            <Modal visible={showPicker} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {/* Year Navigator */}
                        <View style={styles.modalYearSelector}>
                            <TouchableOpacity onPress={() => setTempYear(y => y - 1)} style={styles.chevronButton}>
                                <Ionicons name="chevron-back" size={24} color="#111827" />
                            </TouchableOpacity>
                            <Text style={styles.modalYearText}>{tempYear}</Text>
                            <TouchableOpacity onPress={() => setTempYear(y => y + 1)} style={styles.chevronButton}>
                                <Ionicons name="chevron-forward" size={24} color="#111827" />
                            </TouchableOpacity>
                        </View>

                        {/* Months Grid */}
                        <View style={styles.monthsGrid}>
                            {monthNames.map((month, index) => {
                                const isSelected = currentDate.getMonth() === index && currentDate.getFullYear() === tempYear;
                                return (
                                    <TouchableOpacity
                                        key={month}
                                        style={[styles.monthItem, isSelected && styles.monthItemSelected]}
                                        onPress={() => selectMonth(index)}
                                    >
                                        <Text style={[styles.monthItemText, isSelected && styles.monthItemTextSelected]}>
                                            {month.substring(0, 3)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowPicker(false)}>
                            <Text style={styles.modalCloseText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 100, // padding for the bottom tab bar
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    greeting: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 12,
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chevronButton: {
        padding: 8,
    },
    monthText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        width: 160,
        textAlign: 'center',
    },
    summaryCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    summaryItem: {
        alignItems: 'center',
        flex: 1,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
        fontWeight: '600',
    },
    incomeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#10B981', // Green for income
    },
    expenseText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#EF4444', // Red for expense
    },
    balanceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F35E4', // Theme blue for balance
    },
    divider: {
        width: 1,
        height: '80%',
        backgroundColor: '#E5E7EB',
    },
    transactionsHeader: {
        marginTop: 32,
        marginBottom: 16,
    },
    transactionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 2,
    },
    transactionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 13,
        color: '#6B7280',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 360,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    modalYearSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalYearText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
    },
    monthsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    monthItem: {
        width: '30%',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#F3F4F6',
    },
    monthItemSelected: {
        backgroundColor: '#1F35E4',
        shadowColor: '#1F35E4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    monthItemText: {
        fontSize: 16,
        color: '#4B5563',
        fontWeight: '600',
    },
    monthItemTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    modalCloseButton: {
        marginTop: 16,
        alignItems: 'center',
        paddingVertical: 12,
    },
    modalCloseText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '600',
    }
});

export default HomeScreen;

