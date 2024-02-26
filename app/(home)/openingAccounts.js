import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_URL } from "../../config";

const openingAccounts = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/userBanks`, {
          params: {
            userId: user._id,
          },
        });
        setAccounts(response.data);
      } catch (error) {
        console.log("error fetching accounts", error);
      }
    };
    if (user) {
      fetchAccounts();
    }
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons
          onPress={() => router.push("/(home)")}
          name="arrow-left"
          size={24}
          color="black"
          style={{ marginRight: 10 }}
       />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Opening Accounts</Text>
      </View>
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
            onPress={() => router.push("/(home)/(account)/" + account._id)}
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={{ uri: account.bank?.image }} style={{ width: 50, height: 50 }} />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {account.bank?.bank.trim()} 
              </Text>
              <Text style={{ color: "gray" }}>
                {account.accountNumber}
              </Text>
              <Text style={{ color: "gray" }}>
                {account.ifscCode}
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

        

















