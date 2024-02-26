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
import {
    useRouter,
    useLocalSearchParams,
} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_API_URL } from "../../../config";



const userBankDetails = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [userBankId, setUserBankId] = useState(params?._id);
    const [userBank, setUserBank] = useState({});
    const [loading, setLoading] = useState(false);


    

    useEffect(() => {
        if (params?.userBankId) {
            setUserBankId(params._id);
        }
    }
        , [params]);
    
    
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${REACT_APP_API_URL}/userBank/${userBankId}`);
                setUserBank(res.data);
            } catch (error) {
                console.log("error getting userBank", error);
            }
        }
        )();
    }
        , [userBankId]);
    
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="black"
                style={{ margin: 10 }}
                onPress={() => router.canGoBack() ? router.back() : router.push("/(home)")}
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
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>User Bank Details</Text>
            </View>
            <View style={{ marginHorizontal: 12 }}>
                 <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 0.5, borderBottomColor: "grey", padding: 10 }}>
                    <View style={{ marginHorizontal: 5 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{userBank?.bank?.bank?.trim()}</Text>
                    </View>
                    <View style={{ marginHorizontal: 5 }}>
                        <Image source={{ uri: userBank?.bank?.image }} style={{ width: 50, height: 50, borderRadius: 5, resizeMode: "cover" }} />
                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 0.5, borderBottomColor: "grey", padding: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Account Number</Text>
                    <Text style={{ fontSize: 16 }}>{userBank.accountNumber}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 0.5, borderBottomColor: "grey", padding: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>IFSC Code</Text>
                    <Text style={{ fontSize: 16 }}>{userBank.ifscCode}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 0.5, borderBottomColor: "grey", padding: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Balance</Text>
                    <Text style={{ fontSize: 16 }}>{userBank.balance}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 0.5, borderBottomColor: "grey", padding: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Documents Provided</Text>
                    <Text style={{ fontSize: 16}}>{userBank.documents ? "Yes" : "No"}</Text>
                </View>
            </View>
            <View style={{ marginHorizontal: 12, marginTop: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Loans</Text>
                <FlatList
                    data={userBank.loans}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderBottomWidth: 0.5,
                                borderBottomColor: "grey",
                                padding: 10,
                            }}
                        >
                            <View style={{ marginHorizontal: 5 }}>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.loanId}</Text>
                            </View>
                            <View style={{ marginHorizontal: 5 }}>
                                <Text style={{ fontSize: 16 }}>{item.amount}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}


export default userBankDetails;
                       