import {
    Pressable,
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    Image,
    FlatList,
    ActivityIndicator,
    Alert,
    LogBox,
  } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { REACT_APP_API_URL } from "./../../config";


LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.',
]);
  
  

const applyLoan = () => {
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [duration, setDuration] = useState("");
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [interestRate, setInterestRate] = useState(0);
    const [selectedBank, setSelectedBank] = useState(null);
    const [emi, setEmi] = useState(0);
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const fetchBanks = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${REACT_APP_API_URL}/banks`);
          setBanks(response.data);
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };
      fetchBanks();
    }, []);
  
    const apply = async () => {
      try {
        if (!amount || !duration || !selectedBank) {
          return Alert.alert("All fields are required");
        }
        if (parseFloat(amount) < 1000) {
          return Alert.alert("Amount must be greater than 1000");
        }
        if (parseFloat(duration) < 6) {
          return Alert.alert("Duration must be greater than 6 months");
        }
        if (parseFloat(interestRate) > 100) {
          return Alert.alert("Interest rate must be less than 100%");
        }
        if (parseFloat(interestRate) < 0) {
          return Alert.alert("Interest rate must be greater than 0%");
        }
        if (user === null) {
          return Alert.alert("User not found");
        }
       
        setLoading(true);
        const response = await axios.post(
          `${REACT_APP_API_URL}/apply-loan`,
          {
            amount,
            duration,
            emi,
            interestRate,
            bank: selectedBank,
            userId: user._id,
          }
        );
        setLoading(false);
        router.push("/(home)/loansStatement");  
      } catch (error) {
        console.log(error);
        const message = error.response.data.message;
        Alert.alert("Error", message);
        setLoading(false);
      }
    };

    useEffect(() => {
        if (amount && duration && selectedBank) {
          //emi = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
          const P = parseFloat(amount);
          const r = parseFloat(interestRate) / 100 / 12;
          const n = parseFloat(duration);
          const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
          setEmi(emi.toFixed(2));
        }
          
    }, [amount, duration, selectedBank]);
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const user = await AsyncStorage.getItem("user");
          setUser(JSON.parse(user));
        } catch (error) {
          console.log(error);
        }
      };
      fetchUser();
    }
    , []);
  
    return (
      <ScrollView style={styles.container}>
        {/* go back */}
        <Pressable style={{ marginBottom: 20 }} onPress={() => router.canGoBack() ? router.back() : router.push("/(home)")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={(text) => setAmount(text)}
            placeholder="Enter amount"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Duration (in months)</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={(text) => setDuration(text)}
            placeholder="Enter duration"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Interest Rate (in %)</Text>
          <TextInput
            style={styles.input}
            value={interestRate}
            onChangeText={(text) => parseFloat(text) > 100 ? setInterestRate(100) : setInterestRate(text)}
            placeholder="Enter interest rate"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>EMI (in Rs) (not editable)</Text>
          <TextInput
            style={styles.input}
            value={emi}
            editable={false}
            placeholder="EMI"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Bank</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={banks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable
                style={[
                     styles.bankContainer,
                     selectedBank === item._id && styles.selectedBank,
                    ]}
                onPress={() => setSelectedBank(item._id)}
                >
                    <Image
                        source={{ uri: item.image }}
                        style={styles.bankImage}
                    />
                    <Text style={styles.bankName}>{item.bank.trim()}</Text>
                </Pressable>
            )}  
            />
            </View>
            <Pressable
                onPress={apply}
                style={styles.applyButton}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <Text style={styles.applyButtonText}>Apply</Text>
                )}
            </Pressable>
        </ScrollView>
    );
}

export default applyLoan;


const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
    },
    input: {
        padding: 10,
        borderColor: "#D0D0D0",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
    },
    bankContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    selectedBank: {
        backgroundColor: "#4b6cb7",
    },
    bankImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    bankName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    applyButton: {
        backgroundColor: "black",
        padding: 10,
        alignItems: "center",
        marginVertical: 10,
        borderRadius: 5,
        marginBottom: 50,
    },
    applyButtonText: {
        color: "white",
        fontSize: 16,
    },
});

