import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    Pressable,
    Alert,
    Image,
    Linking
  } from "react-native";
import React, { useState, useEffect } from "react";
import {
    AntDesign,
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

import axios from "axios";
  

const banksList = () => {
    const [banks, setBanks] = useState([]);
    const [search, setSearch] = useState("");
    const router = useRouter();

    const fetchBanks = async () => {
        try {
            const response = await axios.get("http://192.168.0.102:8000/banks");
            setBanks(response.data);
        }
        catch (error) {
            console.log("error fetching banks", error);
        }
    }
    useEffect(() => {
        fetchBanks();
    }, []);

    const handleSearch = () => {
        const filteredBanks = banks.filter((bank) => {
            return bank.bank.toLowerCase().includes(search.toLowerCase());
        });
        setBanks(filteredBanks);
    }

    useEffect(() => {
        handleSearch();
    }, [search]);

    


    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            {/* go back  & search*/}
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
                        value={search}
                        onChangeText={(text) => setSearch(text)}
                        style={{ flex: 1 }}
                        placeholder="Search"
                    />
                </Pressable>
            </View>

                
            {/* entity -> name, links, and image */}
            {/* //make two pressables, one for the image and one for the name and links
            //the image pressable will navigate to the bank's website
            //the name and links pressable will navigate to the bank's details page */}
            {banks.map((bank) => {
                return (
                    <Pressable
                        // onPress={() => router.push("/(home)/bankdetails", { bank: bank })}
                        key={bank._id}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            marginVertical: 10,
                            marginHorizontal: 12,
                        }}
                    >
                        <Pressable
                            onPress={() => Linking.openURL(bank.link)}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 8,
                                padding: 10,
                                backgroundColor: "#4b6cb7",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 20,
                            }}
                        >
                            <Image
                                source={{ uri: bank.image }}
                                style={{ width: 50, height: 50, borderRadius: 8, resizeMode: "cover" }}
                            />
                        </Pressable>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                                {bank.bank}
                            </Text>
                            <Text style={{ marginTop: 5, color: "gray" }}>
                                {bank.link.split("/")[2]}
                            </Text>
                        </View>
                    </Pressable>
                );
            }
            )}
        </ScrollView>
    );
}


export default banksList;
            
                        
                    