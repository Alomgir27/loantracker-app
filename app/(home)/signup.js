import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    Pressable,
    Alert,
  } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
  

const signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSignup = async () => {
        setLoading(true);
        const signupData = {
            name: name,
            email: email,
            password: password,
            phone: phone,
        };

        try {
            const response = await axios.post(
                "http://192.168.0.102:8000/signup",
                signupData
            );
            if (response.data) {
                await AsyncStorage.setItem("user", JSON.stringify(response.data));
                Alert.alert("Signup Successful", "Signup has been made successfully");
                setName("");
                setEmail("");
                setPassword("");
                setPhone("");
                router.push("/(home)");
            }
        }
        catch (error) {
            console.log("error signing up", error);
            setError("Invalid Credentials");
        }
        setLoading(false);
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "white",
                }}
            >
                <Ionicons
                    onPress={() => router.canGoBack() ? router.back() : router.push("/(home)/login")}
                    style={{ marginLeft: 10 }}
                    name="arrow-back"
                    size={24}
                    color="black"
                />
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        marginLeft: 10,
                        color: "black",
                    }}
                >
                    Signup
                </Text>
            </View>
            <View style={{ margin: 20 }}>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Signup</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ color: "gray" }}>
                        Please enter your details to signup
                    </Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    value={phone}
                    onChangeText={(text) => setPhone(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry
                />
                <Pressable style={styles.button} onPress={handleSignup} disabled={loading}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                        {loading ? "Loading..." : "Signup"}
                    </Text>
                </Pressable>
                <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    input: {
        padding: 10,
        borderColor: "#D0D0D0",
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: "black",
        padding: 10,
        alignItems: "center",
        marginVertical: 10,
        borderRadius: 5,
    },
});


export default signup;