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
import { REACT_APP_API_URL } from "../../config";


const ngosList = () => {
    const [ngos, setNgos] = useState([]);
    const [search, setSearch] = useState("");
    const router = useRouter();

    const fetchBanks = async () => {
        try {
            const response = await axios.get(`${REACT_APP_API_URL}/ngos`);
            setNgos(response.data);
        }
        catch (error) {
            console.log("error fetching banks", error);
        }
    }
    useEffect(() => {
        fetchBanks();
    }, []);

    const handleSearch = () => {
        const filteredNgos = ngos.filter((ngo) =>
            ngo.name.toLowerCase().includes(search.toLowerCase())
        );
        setNgos(filteredNgos);
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

            {/* ngos */}
            <View style={{ margin: 10 }}>
                {ngos.map((ngo, index) => (
                    <View
                        key={index}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "white",
                            marginVertical: 10,
                        }}
                    >
                        <Image
                            source={{ uri: ngo.image }}
                            style={{ width: 100, height: 100, borderRadius: 10 }}
                        />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                                {ngo.name}
                            </Text>
                            <Text>{ngo.description}</Text>
                            <Pressable
                                onPress={() => Linking.openURL(ngo.link)}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: "white",
                                    padding: 5,
                                    borderRadius: 5,
                                    marginTop: 10,
                                    width: 100,
                                    justifyContent: "center",
                                }}
                            >
                                <Text style={{ color: "blue" }}>Visit</Text>
                                <MaterialIcons
                                    name="keyboard-arrow-right"
                                    size={24}
                                    color="blue"
                                />
                            </Pressable>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

export default ngosList;

                
           