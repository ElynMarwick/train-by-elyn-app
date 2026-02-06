import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function SignupScreen(){
    //state to store form inpouts
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    //Get router for nav
    const router = useRouter();

    //Function that runs when user presses Sign Up button
    const handleSignup = async() => {
        // Validation check all fields are filled
        if (!email || !password || !confirmPassword){
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        //Validation check passwords match
        if (password !== confirmPassword){
            Alert.alert('Error', 'Passwords do not martch');
            return;
        }

        //Check password strength - length
        if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)){
            Alert.alert('Error', 'Password must be 6+ characters with upper, lower, and numeric characters');
            return;
        }
        
        setLoading(true);

        try{
            //Attempt to create an account with firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Get the new user ID
            const userID = userCredential.user.uid;

            //Saver user data to Firestore with role
            await setDoc(doc(db, 'users', userID),{
                email: email,
                role: 'client',
                createdAt: new Date(),
            });
            
            //Successful creation, navigate to log in.
            router.replace('/(tabs)')
        
        } catch(error: any){
                Alert.alert('SignUp Failed', error.message);
            
        } finally {
            setLoading(false);
        }         
    };
    

    //UI Design
    return (
        <View style = {styles.container}>
            {/* Title and Message*/}
            <Text style ={styles.title}>Train By Elyn</Text>
            <Text style = {styles.subtitle}>Create Your Account</Text>
            
            {/* Input */}
            <TextInput
                style={styles.input}
                placeholder = "Email"
                value={email}
                onChangeText = {setEmail}
                autoCapitalize = "none"
                keyboardType = "email-address"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Password (6+ characters, include upper, lower and numerical characters)"
                value={password}
                onChangeText = {setPassword}
                autoCapitalize= "none"
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText = {setConfirmPassword}
                autoCapitalize= "none"
                secureTextEntry
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleSignup}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.linkText}>
                    Already have an account? Log In
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#87cefa'
    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
        color: 'rgb(0,0,0)'
    },

    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: '#fff'
    },

    button: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
    },

    buttonText: {
        color: '#87cefa',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },

    linkText : {
        color: 'rgb(0,0,0)',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
    },
});