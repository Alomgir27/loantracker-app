import {
    Pressable,
    StyleSheet,
    Text,
    View,
    TextInput,
    ActivityIndicator,
    Button,
    Image,
    ScrollView,
    FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import {
    AntDesign,
    Entypo,
    FontAwesome5,
    FontAwesome,
    MaterialCommunityIcons,
    Ionicons
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";



const addAccount = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [banks, setBanks] = useState([]);
    const [bankId, setBankId] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [balance, setBalance] = useState("");
    const [loading, setLoading] = useState(false);
    const [documents, setDocuments] = useState(null);
    useEffect(() => {
        (async () => {
        try {
            const user = await AsyncStorage.getItem("user");
            setUser(JSON.parse(user));
        } catch (error) {
            console.log("error getting user", error);
        }
        })();
    }, []);
    const handleAddAccount = async () => {
        try {
            const response = await axios.post("http://192.168.0.102:8000/userBank", {
                user: user._id,
                bank: bankId,
                accountNumber,
                ifscCode,
                balance,
                documents,
            });
            console.log(response.data);
            router.push("/(home)/openingAccounts");
        } catch (error) {
            console.log("error adding account", error);
        }
    }
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://192.168.0.102:8000/banks");
                setBanks(response.data);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        fetchBanks();
    }
        , []);
    
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <MaterialCommunityIcons 
                onPress={() => router.push("/(home)")}
                name="arrow-left"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
            />
           
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "white",
                    padding: 20,
                }}
            >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Add Account</Text>
            </View>
            <View style={{ marginHorizontal: 12 }}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Select Bank</Text>
                    <View style={styles.input}>
                        <FontAwesome5 name="university" size={24} color="black" />
                        <Picker
                            selectedValue={bankId}
                            onValueChange={(itemValue, itemIndex) =>
                                setBankId(itemValue)
                            }
                            style={{ flex: 1 }}

                        >
                            <Picker.Item label="Select Bank" value="" />
                            {banks.map((bank, index) => (
                                <Picker.Item
                                    key={index}
                                    label={bank.bank?.trim()}
                                    value={bank._id}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Account Number</Text>
                    <View style={styles.input}>
                        <FontAwesome name="credit-card" size={24} color="black" />
                        <TextInput
                            style={{ flex: 1, marginLeft: 10 }}
                            placeholder="Account Number"
                            value={accountNumber}
                            onChangeText={(text) => setAccountNumber(text)}
                        />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>IFSC Code</Text>
                    <View style={styles.input}>
                        <MaterialCommunityIcons
                            name="bank" size={24} color="black" />
                        <TextInput
                            style={{ flex: 1, marginLeft: 10 }}
                            placeholder="IFSC Code"
                            value={ifscCode}
                            onChangeText={(text) => setIfscCode(text)}
                        />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Balance</Text>
                    <View style={styles.input}>
                        <FontAwesome5 name="rupee-sign" size={24} color="black" />
                        <TextInput
                            style={{ flex: 1, marginLeft: 10 }}
                            placeholder="Balance"   
                            value={balance}
                            onChangeText={(text) => setBalance(text)}
                        />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Documents</Text>
                    <View style={styles.input}>
                        <Entypo name="documents" size={24} color="black" />
                        <Button
                            title="Upload Documents"
                            onPress={() => setDocuments("documents")}
                        />
                    </View>
                </View>
                <Pressable
                    onPress={handleAddAccount}
                    style={{
                        backgroundColor: "#4b6cb7",
                        padding: 10,
                        marginHorizontal: 10,
                        borderRadius: 5,
                        alignItems: "center",
                        marginVertical: 10,
                    }}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={{ color: "white" }}>Add Account</Text>
                    )}
                </Pressable>
            </View>
        </ScrollView>
    );
}

export default addAccount;

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
    },
    input: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderColor: "#D0D0D0",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
    },
});

        