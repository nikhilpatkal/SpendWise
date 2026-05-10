import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { DetailsScreen } from "../screens/DetailsScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { SettingsScreen } from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

// This is the clean, reusable custom button component
const CustomTabBarButton = ({ children, onPress }: any) => (
    <TouchableOpacity
        style={styles.customButtonWrapper}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View style={styles.customButton}>
            {children}
        </View>
    </TouchableOpacity>
);

// We define a dummy component since we intercept the press anyway
const DummyScreen = () => null;

export function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#1F35E4',
                tabBarInactiveTintColor: '#9ca3af',
            }}
            initialRouteName="Home"
            id="MainTabs"
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" size={35} color={color} style={styles.TabIcons} />
                    )
                }}
            />
            <Tab.Screen
                name="Details"
                component={DetailsScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="pie-chart" size={35} color={color} style={styles.TabIcons} />
                    )
                }}
            />

            {/* The custom '+' Add Expense button perfectly in the middle */}
            <Tab.Screen
                name="AddExpensePlaceholder"
                component={DummyScreen}
                options={{
                    tabBarIcon: () => (
                        <Ionicons name="add" size={30} color="#FFFFFF" />
                    ),
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props} />
                    )
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        // Prevent the default action (which is trying to switch tabs)
                        e.preventDefault();
                        // Tell the parent Stack Navigator to open the "AddExpense" screen
                        navigation.navigate("AddExpense");
                    },
                })}
            />

            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings" size={35} color={color} style={styles.TabIcons} />
                    )
                }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person" size={35} color={color} style={styles.TabIcons} />
                    )
                }}

            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 20,
        left: 25,
        right: 20,
        elevation: 10,
        backgroundColor: '#ffffff',
        borderRadius: 30,
        height: 70,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        borderTopWidth: 0,
        paddingBottom: 0, // fixes vertical alignment on iOS
    },
    customButtonWrapper: {
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    customButton: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: '#2238dfff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#1F35E4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    TabIcons: {
        paddingTop: 15,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default TabNavigator;