import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { REACT_APP_API_URL } from "../../config";

const holidaysList = () => {
  const router = useRouter();
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment());

  const goToNextMonth = () => {
    const nextMonth = moment(currentDate).add(1, "months");
    setCurrentDate(nextMonth);
  };

  const goToPrevMonth = () => {
    const prevMonth = moment(currentDate).subtract(1, "months");
    setCurrentDate(prevMonth);
  };

  const formatDate = (date) => {
    return date.format("MMMM, YYYY");
  };
  const fetchAttendanceReport = async () => {
    try {
      const respone = await axios.get(
        `${REACT_APP_API_URL}/attendance-report-all-employees`,
        {
          params: {
            month: 11,
            year: 2023,
          },
        }
      );

      setAttendanceData(respone.data.report);
    } catch (error) {
      console.log("Error fetching attendance");
    }
  };
  useEffect(() => {
    fetchAttendanceReport();
  }, []);
  console.log(attendanceData);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      {/* go back */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          padding: 20,
        }}
      >
        <AntDesign
          name="arrowleft"
          size={24}
          color="black"
          onPress={() => router.push("/(home)")}
          style={{ marginRight: 10 }}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Holidays</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          padding: 20,
        }}
      >
        <AntDesign
          name="arrowleft"
          size={24}
          color="black"
          onPress={goToPrevMonth}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {formatDate(currentDate)}
        </Text>
        <AntDesign
          name="arrowright"
          size={24}
          color="black"
          onPress={goToNextMonth}
        />
      </View>

     
      <View style={{ marginHorizontal: 12 }}>
        {/* holiday */}
        <View style={{ marginVertical: 10 }}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>Day</DataTable.Title>
              <DataTable.Title>Name</DataTable.Title>
            </DataTable.Header>
            <DataTable.Row>
              <DataTable.Cell>1</DataTable.Cell>
              <DataTable.Cell>Monday</DataTable.Cell>
              <DataTable.Cell>New Year</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>26</DataTable.Cell>
              <DataTable.Cell>Monday</DataTable.Cell>
              <DataTable.Cell>Republic Day</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>15</DataTable.Cell>
              <DataTable.Cell>Monday</DataTable.Cell>
              <DataTable.Cell>Independence Day</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>2</DataTable.Cell>
              <DataTable.Cell>Monday</DataTable.Cell>
              <DataTable.Cell>Gandhi Jayanti</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>25</DataTable.Cell>
              <DataTable.Cell>Monday</DataTable.Cell>
              <DataTable.Cell>Christmas</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </View>
      </View>
      
    </ScrollView>
  );
}

export default holidaysList;

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
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  applyButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
         





