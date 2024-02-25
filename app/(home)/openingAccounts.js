import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const openingAccounts = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`http://192.168.0.102:8000/userBanks`, {
          params: {
            userId: user._id,
          },
        });
        setAccounts(response.data);
      } catch (error) {
        console.log("error fetching accounts", error);
      }
    };
    fetchAccounts();
  }, [user]);
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
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Opening Accounts</Text>
        <Pressable
          onPress={() => router.push("/(home)/addAccount")}
          style={{
            backgroundColor: "#4b6cb7",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white" }}>Add Account</Text>
        </Pressable>
      </View>
      <View style={{ marginHorizontal: 12 }}>
        {accounts.map((account, index) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/[account]",
                params: {
                  accountNumber: account.accountNumber,
                  balance: account.balance,
                  ifscCode: account.ifscCode,
                },
              })
            }
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              marginVertical: 10,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          >
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {account.bank?.bank.trim()} 
              </Text>
              <Text style={{ color: "gray" }}>
                {account.accountNumber}
              </Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              ₹{account.balance}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default openingAccounts;

const styles = StyleSheet.create({});

        

















