import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Image
} from "react-native";
import React, { useState, useEffect } from "react";
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_URL } from "./../../config";

const loansPayment = () => {
  const [banks, setBanks] = useState([]);
  const [bank, setBank] = useState("");
  const [loanId, setLoanId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentModes, setPaymentModes] = useState([
    {
      mode: "Bank Transfer",
    },
    {
      mode: "Mobile Money",
    }
  ]);
  const [paymentMode, setPaymentMode] = useState("");
      
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState(null);

  const MobileMoney = [
    {
      mode: "Bkash",
      img: 'https://freelogopng.com/images/all_img/1656234745bkash-app-logo-png.png'
    },
    {
      mode: "Rocket",
      img: 'https://play-lh.googleusercontent.com/sDY6YSDobbm_rX-aozinIX5tVYBSea1nAyXYI4TJlije2_AF5_5aG3iAS7nlrgo0lk8'
    },
    {
      mode: "Nagad",
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi9ZYjc-Owpeim944ocerx29cnTW-RHK0e7M5d_-6FZgxJ9yTIL16K0IYE3uVsJVJE15E&usqp=CAU'
    },
  ]



  const router = useRouter();



  const handlePayment = async () => {
    setLoading(true);
    const paymentData = {
      paymentMode: paymentMode,
      phone: phone,
      via: bank,
      loanId: loanId,
      amount: amount,
      userId: user?._id,
    };

    try {
      const response = await axios.post(
        `${REACT_APP_API_URL}/loansPayment`,
        paymentData
      );
      if (response.status === 201) {
        Alert.alert("Payment Successful", "Payment has been made successfully");
        setBank("");
        setLoanId("");
        setAmount("");
        setUser("");
        setPhone("");
        router.push("/(home)");
      }
    } catch (error) {
      Alert.alert("Payment Failed", "An error occurred during payment" + error);
      console.log("payment failed", error);
    }
    setLoading(false);
  };


  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/banks`);
      setBanks(response.data);
    }
    catch (error) {
      console.log("error fetching banks", error);
    }
  }
  useEffect(() => {
    fetchBanks();
  }, []);

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/loans`,
          {
            params: {
              userId: user._id,
            },
          }
        );
        setLoans(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("error fetching loan data", error);
      }
    };
    if (user?._id) fetchLoanData();
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem("user");
      if(user !== null) {
        setUser(JSON.parse(user));
        setPhone(JSON.parse(user)?.phone);
      }
    };
    fetchUser();
  }, []);





  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center", padding: 10 }}>
        {/* go back and title */}
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
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10, marginBottom: 10 }}>
            Make Payment
          </Text>
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>Payment Mode</Text>
          <Picker  
            selectedValue={paymentMode}
            onValueChange={(itemValue, itemIndex) =>
              setPaymentMode(itemValue)
            }
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
              color: "black",
              backgroundColor: "white",
            }}
            itemStyle={{ backgroundColor: "grey", color: "blue", fontFamily: "Ebrima", fontSize: 17 }}
            dropdownIconColor={"#D0D0D0"}
            prompt="Select Payment Mode"
            mode="dropdown"
          >
            <Picker.Item label="Select Payment Mode" value="" />
            {paymentModes.map((mode, index) => (
              <Picker.Item key={index} label={mode.mode.trim()} value={mode.mode.trim()} />
            ))}
          </Picker>
        </View>
        {paymentMode === "Bank Transfer" && (
         <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Select Bank</Text>
            <Picker
              selectedValue={bank}
              onValueChange={(itemValue, itemIndex) => {
                setBank(itemValue)
                let selected = banks.find((bank) => bank.bank.trim() === itemValue);
                setSelected(selected);
              }
              }
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
                color: "black",
                backgroundColor: "white",
              }}
              itemStyle={{ backgroundColor: "grey", color: "blue", fontFamily: "Ebrima", fontSize: 17 }}
              dropdownIconColor={"#D0D0D0"}
              prompt="Select Bank"
              mode="dropdown"

            >
              <Picker.Item label="Select Bank" value="" />
              {banks.map((bank, index) => (
                <Picker.Item key={index} label={bank.bank.trim()} value={bank.bank.trim()} />
              ))}
              
            </Picker>
          </View>
        )}

        {paymentMode === "Mobile Money" && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Select Mobile Money</Text>
            <Picker
              selectedValue={MobileMoney}
              onValueChange={(itemValue, itemIndex) => {
                setBank(itemValue)
                let selected = MobileMoney.find((mode) => mode.mode === itemValue);
                setSelected(selected);
              }
              }
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
                color: "black",
                backgroundColor: "white",
              }}
              itemStyle={{ backgroundColor: "grey", color: "blue", fontFamily: "Ebrima", fontSize: 17 }}
              dropdownIconColor={"#D0D0D0"}
              prompt="Select Mobile Money"
              mode="dropdown"

            >
              <Picker.Item label="Select Mobile Money" value="" />
              {MobileMoney.map((mode, index) => (
                <Picker.Item key={index} label={mode.mode.trim()} value={mode.mode.trim()} />
              ))}
              
            </Picker>
          </View>
        )}
        {paymentMode === "Mobile Money" && selected && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Mobile Money</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  padding: 10,
                  backgroundColor: "#4b6cb7",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: selected.img }}
                  style={{ width: 50, height: 50, borderRadius: 8, resizeMode: "cover" }}
                />
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {selected.mode}
                </Text>
              </View>
            </View>
          </View>
        )}
        {paymentMode === "Bank Transfer" && selected && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Bank</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  padding: 10,
                  backgroundColor: "#4b6cb7",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: selected.image }}
                  style={{ width: 50, height: 50, borderRadius: 8, resizeMode: "cover" }}
                />
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {selected.bank}
                </Text>
              </View>
            </View>
          </View>
        )}

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Phone</Text>
            <TextInput
              value={phone}
              onChangeText={(text) => setPhone(text)}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
                color: "black",
              }}
               placeholder="Enter Phone"
               placeholderTextColor={"black"}
               readOnly
            />
          </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>Select Loan</Text>
          <Picker
            selectedValue={loanId}
            onValueChange={(itemValue, itemIndex) =>{
              setLoanId(itemValue)
              let selected = loans.find((loan) => loan.loanId === itemValue);
              setSelectedLoan(selected);
            }
            }
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
              color: "black",
              backgroundColor: "white",
            }}
            itemStyle={{ backgroundColor: "grey", color: "blue", fontFamily: "Ebrima", fontSize: 17 }}
            dropdownIconColor={"#D0D0D0"}
            prompt="Select Loan"
            mode="dropdown"
          >
            <Picker.Item label="Select Loan" value="" />
            {loans.map((loan, index) => (
              <Picker.Item
                key={index}
                label={loan.bank.bank.trim() + " - " + loan.amount + " - " + loan.duration + " months"}
                value={loan.loanId} />
            ))}
          </Picker>
        </View>
        {loanId && selectedLoan && (
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Loan</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  padding: 10,
                  backgroundColor: "#4b6cb7",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "white" }}>
                  {selectedLoan.payments.length}
                </Text>
                {selectedLoan.bank?.image && (
                  <Image
                    source={{ uri: selectedLoan.bank.image }}
                    style={{ width: 50, height: 50, borderRadius: 8, resizeMode: "cover" }}
                  />
                )}
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {selectedLoan.bank?.bank.trim()}
                </Text>
                <Text style={{ color: "gray" }}>
                  {loanId}
                </Text>
              </View>
            </View>
          </View>
        )}
        <View>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>Amount</Text>
          <TextInput
            value={amount}
            onChangeText={(text) => setAmount(text)}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Enter Amount"
            placeholderTextColor={"black"}
            required
          />
        </View>
        
        
        
        <Pressable
          onPress={handlePayment}
          style={{
            backgroundColor: "#4b6cb7",
            padding: 10,
            marginTop: 20,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
          }}
          disabled={loading}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>
            {loading ? "Processing..." : "Make Payment"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default loansPayment;
