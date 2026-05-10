import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionType, useTransactionStore } from "../store/useTransactionStore";

import { expenseTypes, incomeTypes, transferTypes } from "../constants/categories";

export function AddExpenseScreen({ navigation }: any) {
    const [type, setType] = useState<TransactionType>("expense");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const addTransaction = useTransactionStore((state) => state.addTransaction);

    const getCategories = () => {
        if (type === "expense") return expenseTypes;
        if (type === "income") return incomeTypes;
        return transferTypes;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add Transaction</Text>
                    <View style={styles.headerButton} />
                    {/* Empty view for alignment */}
                </View>

                {/* Segmented Control */}
                <View style={styles.segmentContainer}>
                    {['expense', 'income', 'transfer'].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[styles.segmentButton, type === item && styles.segmentButtonActive]}
                            onPress={() => {
                                setType(item as TransactionType);
                                setSelectedCategory(null);
                            }}
                        >
                            <Text style={[styles.segmentText, type === item && styles.segmentTextActive]}>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Amount Input */}
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0.00"
                        placeholderTextColor="#D1D5DB"
                        keyboardType="decimal-pad"
                        value={amount}
                        onChangeText={setAmount}
                        autoFocus
                    />
                </View>

                {/* Categories and Note */}
                <View style={styles.categoriesSection}>
                    {/* Note Input */}
                    <View style={styles.noteContainer}>
                        <Ionicons name="document-text-outline" size={20} color="#9CA3AF" />
                        <TextInput
                            style={styles.noteInput}
                            placeholder="Add a note (optional)"
                            placeholderTextColor="#9CA3AF"
                            value={note}
                            onChangeText={setNote}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Category</Text>
                    <FlatList
                        data={getCategories()}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={4}
                        columnWrapperStyle={styles.categoryRow}
                        renderItem={({ item }) => {
                            const isSelected = selectedCategory === item.id;
                            return (
                                <TouchableOpacity
                                    style={styles.categoryItem}
                                    onPress={() => setSelectedCategory(item.id)}
                                >
                                    <View style={[
                                        styles.iconContainer,
                                        { backgroundColor: isSelected ? item.color : '#F3F4F6' },
                                        isSelected && styles.iconContainerSelected
                                    ]}>
                                        <Ionicons
                                            name={item.icon as any}
                                            size={28}
                                            color={isSelected ? '#FFFFFF' : item.color}
                                        />
                                    </View>
                                    <Text style={[styles.categoryName, isSelected && styles.categoryNameSelected]}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>

                {/* Save Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        activeOpacity={0.8}
                        onPress={() => {
                            if (!amount.trim()) {
                                Alert.alert("Required Field", "Please enter an amount.");
                                return;
                            }
                            // if (!note.trim()) {
                            //     Alert.alert("Required Field", "Please add a note describing this transaction.");
                            //     return;
                            // }
                            if (selectedCategory === null) {
                                Alert.alert("Required Field", "Please select a category.");
                                return;
                            }

                            addTransaction({
                                type,
                                amount: parseFloat(amount),
                                note: note.trim(),
                                categoryId: selectedCategory,
                            });

                            navigation.goBack();
                        }}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerButton: {
        width: 60,
    },
    cancelText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    segmentContainer: {
        flexDirection: 'row',
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        marginHorizontal: 20,
        padding: 4,
        marginBottom: 30,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    segmentButtonActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    segmentTextActive: {
        color: '#111827',
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    currencySymbol: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#111827',
        marginRight: 8,
    },
    amountInput: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#111827',
        minWidth: 100,
    },
    categoriesSection: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 24,
    },
    noteInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#111827',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 20,
    },
    categoryRow: {
        justifyContent: 'flex-start',
    },
    categoryItem: {
        alignItems: 'center',
        width: '25%',
        marginBottom: 20,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconContainerSelected: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    categoryName: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    categoryNameSelected: {
        color: '#111827',
        fontWeight: 'bold',
    },
    footer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 10 : 20,
        paddingTop: 10,
    },
    saveButton: {
        backgroundColor: '#1F35E4',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#1F35E4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddExpenseScreen;