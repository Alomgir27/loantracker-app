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
  

const login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        const loginData = {
            email: email,
            password: password,
        };

        try {
            const response = await axios.post(
                "http://192.168.0.102:8000/login",
                loginData
            );
            if (response.data) {
                await AsyncStorage.setItem("user", JSON.stringify(response.data));
                Alert.alert("Login Successful", "Login has been made successfully");
                setEmail("");
                setPassword("");
                router.push("/(home)");
            }
        }
        catch (error) {
            console.log("error logging in", error);
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
                    onPress={() => router.canGoBack() ? router.back() : router.push("/(home)")}
                    style={{ marginLeft: 10 }}
                    name="arrow-back"
                    size={24}
                    color="black"
                />
                <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
                    Login
                </Text>
            </View>
            <View style={{ margin: 20 }}>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        style={styles.input}
                        placeholder="Enter Email"
                    />
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        style={styles.input}
                        placeholder="Enter Password"
                        secureTextEntry
                    />
                </View>
                <Pressable
                    onPress={handleLogin}
                    style={{
                        backgroundColor: "black",
                        padding: 10,
                        alignItems: "center",
                        marginVertical: 10,
                        borderRadius: 5,
                    }}
                    disabled={loading}
                >
                    <Text style={{ color: "white", fontSize: 16 }}>
                        {loading ? "Loading..." : "Login"}
                    </Text>
                </Pressable>
                <Text style={{ color: "red", justifyContent: 'center' }}>{error}</Text>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text>Don't have an account? </Text>
                    <Pressable onPress={() => router.push("/(home)/signup")}>
                        <Text style={{ color: "blue" }}>Sign Up</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    input: {
        padding: 10,
        borderColor: "#D0D0D0",
        borderWidth: 1,
        borderRadius: 5,
    },
});

export default login;