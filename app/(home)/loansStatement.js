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
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_URL } from "../../config";




const loansStatement = () => {
  const [loans, setLoans] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState({});
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        setUser(JSON.parse(user));
      } catch (error) {
        console.log("error getting user", error);
      }
    })();
  }
  , []);

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

  const handleSearch = () => {
    const filteredLoans = loans.filter((loan) => {
      return loan.loanId.toLowerCase().includes(input.toLowerCase());
    });
    setLoans(filteredLoans);
  };

  useEffect(() => {
    handleSearch();
  }, [input]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
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
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 40,
            flex: 1,
          }}
        >
          <AntDesign
            style={{ marginLeft: 10 }}
            name="search1"
            size={20}
            color="black"
          />
          <TextInput
            value={input}
            onChangeText={(text) => setInput(text)}
            style={{ flex: 1 }}
            placeholder="Search loans by loan id"
          />
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          backgroundColor: "white",
          borderRadius: 3,
          marginHorizontal: 10,
          paddingHorizontal: 10,
          justifyContent: "center",
        }}
      >
        <Pressable
          onPress={() => router.push("/(home)/applyLoan")}
          style={{
            flexDirection: "row",
            backgroundColor: "black",
            padding: 10,
            alignItems: "center",
            marginVertical: 10,
            borderRadius: 5,
          }}
        >
          <MaterialCommunityIcons
            name="plus"
            size={24}
            color="white"
          />
          <Text style={{ color: "white", fontSize: 16 }}>Hey, {user?.name} click here to apply for a loan</Text>
        </Pressable>
      </View>
         

      {loans.length > 0 ? (
        <FlatList
          data={loans}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push("/(home)/(loan)/" + item._id)}
              style={{
                marginHorizontal: 10,
                padding: 10,
                backgroundColor: "white",
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginVertical: 10,
                }}
              >
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
                    source={{ uri: item.bank.image }}
                    style={{ width: 50, height: 50, resizeMode: 'cover' }}
                  />
                </View>
                <View 
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    {item.loanId}
                  </Text>
                  <Text style={{ color: "gray" }}>
                    {item.amount} - {item.duration} months
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <ActivityIndicator size="large" color="#4b6cb7" />
        </View>
      )}
    </View>
  );
}

export default loansStatement;

