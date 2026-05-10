import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function IntroPage({ navigation }: any) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    {/* Placeholder for an illustration or logo */}
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>💸</Text>
                    </View>

                    <Text style={styles.title}>Welcome to SpendWise</Text>
                    <Text style={styles.subtitle}>
                        Take control of your finances. Track your expenses, set budgets, and achieve your financial goals with ease.
                    </Text>
                </View>

                <View style={styles.footerContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.8}
                        onPress={() => navigation.replace('Login')} // Use replace so user can't swipe back to intro
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 60,
    },
    contentContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    logoPlaceholder: {
        width: 120,
        height: 120,
        backgroundColor: '#E0E7FF',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        shadowColor: '#1F35E4',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    logoText: {
        fontSize: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    footerContainer: {
        width: '100%',
    },
    button: {
        backgroundColor: '#1F35E4',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#1F35E4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

export default IntroPage;
