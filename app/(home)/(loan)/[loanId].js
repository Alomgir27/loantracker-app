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
import { REACT_APP_API_URL } from "./../../../config";



const loanDetails = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loanId, setLoanId] = useState(params?.loanId);
    const [loan, setLoan] = useState([]);
    const [payments, setPayments] = useState([]);
    const [user, setUser] = useState({});
    const [bank, setBank] = useState({});
    const [loading, setLoading] = useState(false);
    const [totalAmountPaid, setTotalAmountPaid] = useState(0);
    const [totalAmountRemaining, setTotalAmountRemaining] = useState(0);

  
    
    useEffect(() => {
        if (params?.loanId) {
            setLoanId(params.loanId);
        }
    }
        , [params]);
    


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

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${REACT_APP_API_URL}/loan/${loanId}`);
                setLoan(res.data);
                setLoading(false);
            } catch (error) {
                console.log("error getting loan", error);
                setLoading(false);
            }
        })();
    }, [loanId]);

      



    useEffect(() => {
        if(loan?.payments) {
            setPayments(loan.payments);
        }

        if(loan?.bank) {
            setBank(loan.bank)
        }

        if(payments.length > 0) {
            const totalPaid = payments.reduce((acc, payment) => {
                return acc + payment.amount;
            }, 0);
            setTotalAmountPaid(totalPaid);
        }
    }
        
        , [loan, payments]);
    
    useEffect(() => {
        if(loan?.amount) {
            setTotalAmountRemaining(loan.amount - totalAmountPaid);
        }
    }, [loan, totalAmountPaid]);

    

    const handlePayment = async () => {
        router.push(`/(home)/loansPayment`);
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4b6cb7" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Ionicons
                onPress={() => router.canGoBack() ? router.back() : router.push("/(home)")}
                name="arrow-back"
                size={24}
                color="black"
            />
            <View style={styles.loanDetails}>
                <Text style={styles.loanId}>Loan ID: {loan.loanId}</Text>
                <Text style={styles.amount}>Amount: {loan.amount}</Text>
                <Text style={styles.interestRate}>Interest Rate: {loan.interestRate}</Text>
                <Text style={styles.duration}>Duration: {loan.duration}</Text>
                <Text style={styles.emi}>EMI: {loan?.emi}</Text>
                <Text style={styles.totalAmountPaid}>Total Amount Paid: {totalAmountPaid}</Text>
                <Text style={styles.totalAmountRemaining}>Total Amount Remaining: {totalAmountRemaining}</Text>
                <Text style={styles.bank}>Bank: {bank?.bank?.trim()}</Text>
            </View>
            <View style={styles.paymentsDetails}>
                <Text style={styles.paymentsTitle}>Payments</Text>
                <FlatList
                    data={payments}
                    keyExtractor={(item) => item._id}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.payment}>
                            <Text style={styles.amount}>Amount: {item.amount}</Text>
                            <Text style={styles.transactionId}>Transaction ID: {item.transactionId}</Text>
                            <Text style={styles.via}>Via: {item.via}</Text>
                            <Text style={styles.paymentMode}>Payment Mode: {item.paymentMode}</Text>
                            <Text style={styles.phone}>Phone: {item.phone}</Text>
                        </View>
                    )}
                />
            </View>
            <Pressable
                onPress={handlePayment}
                style={styles.payButton}
            >
                <Text style={styles.payButtonText}>Pay</Text>
            </Pressable>
        </View>
    );
}

export default loanDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 10,
    },
    loanDetails: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    loanId: {
        fontSize: 16,
        fontWeight: "bold",
    },
    amount: {
        color: "gray",
    },
    interestRate: {
        color: "gray",
    },
    duration: {
        color: "gray",
    },
    emi: {
        color: "gray",
    },
    totalAmountPaid: {
        color: "gray",
    },
    totalAmountRemaining: {
        color: "gray",
    },
    bank: {
        color: "gray",
    },
    paymentsDetails: {
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    paymentsTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    payment: {
        marginVertical: 10,
    },
    payButton: {
        backgroundColor: "#4b6cb7",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,

    },
    payButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    amount: {
        color: "gray",
    },
    transactionId: {
        color: "gray",
    },
    via: {
        color: "gray",
    },
    paymentMode: {
        color: "gray",
    },
    phone: {
        color: "gray",
    },
});
    
    
    


    