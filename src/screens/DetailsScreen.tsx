import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCategoryDetails } from "../constants/categories";
import { useTransactionStore } from "../store/useTransactionStore";

export function DetailsScreen() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [tempYear, setTempYear] = useState(new Date().getFullYear());

    const transactions = useTransactionStore((state) => state.transactions);

    const { totalExpense, categoryBreakdown } = useMemo(() => {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        let total = 0;
        const categoryMap: Record<number, number> = {};

        transactions.forEach((tx) => {
            const txDate = new Date(tx.date);
            if (tx.type === 'expense' && txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
                total += tx.amount;
                if (!categoryMap[tx.categoryId]) {
                    categoryMap[tx.categoryId] = 0;
                }
                categoryMap[tx.categoryId] += tx.amount;
            }
        });

        // Convert map to array and sort by amount descending
        const breakdown = Object.keys(categoryMap).map(id => {
            const numId = parseInt(id);
            const amount = categoryMap[numId];
            return {
                categoryId: numId,
                amount: amount,
                percentage: total > 0 ? (amount / total) * 100 : 0
            };
        }).sort((a, b) => b.amount - a.amount);

        return {
            totalExpense: total,
            categoryBreakdown: breakdown,
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
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Analytics</Text>
                
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

            <ScrollView contentContainerStyle={styles.container}>
                {/* Total Summary Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total Spent</Text>
                    <Text style={styles.summaryValue}>${totalExpense.toFixed(2)}</Text>
                </View>

                {/* Category Breakdown */}
                <Text style={styles.sectionTitle}>Category Breakdown</Text>
                
                {categoryBreakdown.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="pie-chart-outline" size={48} color="#D1D5DB" />
                        <Text style={styles.emptyStateText}>No expenses this month</Text>
                    </View>
                ) : (
                    <View style={styles.breakdownContainer}>
                        {categoryBreakdown.map((item) => {
                            const category = getCategoryDetails('expense', item.categoryId);
                            return (
                                <View key={item.categoryId} style={styles.breakdownItem}>
                                    <View style={styles.breakdownHeader}>
                                        <View style={styles.breakdownLeft}>
                                            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
                                                <Ionicons name={category.icon as any} size={18} color={category.color} />
                                            </View>
                                            <Text style={styles.categoryName}>{category.name}</Text>
                                        </View>
                                        <View style={styles.breakdownRight}>
                                            <Text style={styles.categoryAmount}>${item.amount.toFixed(2)}</Text>
                                        </View>
                                    </View>
                                    
                                    {/* Progress Bar */}
                                    <View style={styles.progressBarBackground}>
                                        <View 
                                            style={[
                                                styles.progressBarFill, 
                                                { width: `${item.percentage}%`, backgroundColor: category.color }
                                            ]} 
                                        />
                                    </View>
                                    <Text style={styles.percentageText}>{item.percentage.toFixed(1)}%</Text>
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            {/* Custom Month/Year Picker Modal */}
            <Modal visible={showPicker} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalYearSelector}>
                            <TouchableOpacity onPress={() => setTempYear(y => y - 1)} style={styles.chevronButton}>
                                <Ionicons name="chevron-back" size={24} color="#111827" />
                            </TouchableOpacity>
                            <Text style={styles.modalYearText}>{tempYear}</Text>
                            <TouchableOpacity onPress={() => setTempYear(y => y + 1)} style={styles.chevronButton}>
                                <Ionicons name="chevron-forward" size={24} color="#111827" />
                            </TouchableOpacity>
                        </View>

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
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6B7280',
        marginBottom: 16,
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
    container: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 120, // tab bar padding
    },
    summaryCard: {
        backgroundColor: '#1F35E4',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#1F35E4',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#E0E7FF',
        marginBottom: 8,
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
        marginLeft: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
    },
    breakdownContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 2,
    },
    breakdownItem: {
        marginBottom: 20,
    },
    breakdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    breakdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    breakdownRight: {
        alignItems: 'flex-end',
    },
    categoryAmount: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111827',
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    percentageText: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'right',
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

export default DetailsScreen;