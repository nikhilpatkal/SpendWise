import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AddExpenseScreen } from "../screens/AddExpenseScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";
import { IntroPage } from "../screens/IntroPage";
import { LoginScreen } from "../screens/LoginScreen";
import { SignUpScreen } from "../screens/Sign_up";
import { TabNavigator } from "./TabNavigator";

const Stack = createNativeStackNavigator();
export function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Intro">
            <Stack.Screen name="Intro" component={IntroPage} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
        </Stack.Navigator>
    );
}
export default StackNavigator;

