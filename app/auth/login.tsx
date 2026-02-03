import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';

export default function LoginScreen() {
    // Create state variables to store what user types
    // Returns current value and a function to update value
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    //Get the router to allow navigation between screens
    const router = useRouter();

    //This function runs when user tries to log in (presses the button)
    const handleLogin = async () => {
        if (!email || !password){
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        
        setLoading(true);

        try{
            //Attempt to log in with FireBase
            await signInWithEmailAndPassword(auth, email, password);

            //If we pass the above log in is successful so reroute to tabs!
            router.replace('/(tabs)');

        } catch (error: any){
            //If logon fails show error message
            Alert.alert('Login Failed', error.message);

        } finally {
            //Run whether login successful or a failure - resets button
            setLoading(false)
        }
    };

    //Create UI for login page
    return (
        <View style = {styles.container}>

            {/*App title*/}
            <Text style={styles.title}>Train by Elyn</Text>

            {/* Welcome message */}
            <Text style={styles.subtitle}>Welcome Back!</Text>

            {/* Email input field */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            {/* Password input field */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* Login Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {/* Change text dependent on loading state */}
                    {loading ? 'Logging in...' : 'Log In'}
                </Text>
            </TouchableOpacity>

            {/* Link to sign up screen */}
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                <Text style={styles.linkText}>
                    Don't have an account? Sign Up
                </Text>
            </TouchableOpacity>

        </View>
    );
}

//Styles for components
const styles = StyleSheet.create({
    //Container Styling
    container: {
        flex: 1, //Take up all available space
        justifyContent: 'center', //Center content vertically
        padding: 20, //Add 20px padding on all sides
        backgroundColor: '#87cefa'
    },

    //Title Styling
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    //Subtitle styling
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
        color: 'rgb(0,0,0)',
    },

    //Input styling
    input: {
        borderWidth: 1, //1px border
        borderColor: '#ddd', //Light gray border
        padding: 15, //Space inside input box
        marginBottom: 15, //Space between inputs
        borderRadius: 8, //Rounded corners
        fontSize: 16,
    },

    //Button styling
    button: {
        backgroundColor: '#fff', //white
        padding: 15,
        borderRadius: 8, //rounded corners
        marginTop: 10, //Space above button
    },

    buttonText: {
        color: '#87cefa',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600', //semi-bold
    },

    //Link text styling
    linkText: {
        color: 'rgb(0,0,0)',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
    },
});