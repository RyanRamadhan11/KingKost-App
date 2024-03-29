import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import Colors from "../../utils/Colors";
import { StatusBar } from "expo-status-bar";
import BackButton from "../../components/DetailKost/BackButton";
import TransactionItem from "../../components/PopularKostArea/TransactionItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiInstance from "../../config/apiInstance";
import LoadingComponent from "../../components/LoadingComponent";
import { RefreshControl } from "react-native";

export default TransactionScreen = ({ navigation }) => {
  const [transactionData, setTransactionData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeFilter]);

  async function fetchData() {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      const responseCustomer = await apiInstance.get(
        `/customer/user/${userId}`
      );
      const customerId = responseCustomer.data.data.id;
      const responseTransactions = await apiInstance.get(
        `/transactions?customerId=${customerId}`
      );
      setTransactionData(responseTransactions.data.data);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
  };

  const transactionIds = transactionData.map((transaction) => transaction.id);
  console.log(transactionIds);
  const filteredData =
    activeFilter === "all"
      ? transactionData
      : transactionData.filter((item) => item.aprStatus === activeFilter);

  let noDataText = "";
  if (activeFilter === 0 && filteredData.length === 0) {
    noDataText = (
      <View style={styles.noDataContainer}>
        <Image
          source={require("../../../assets/images/data-notfound.jpg")}
          style={styles.image}
        />
        <Text style={styles.noDataText}>No pending transaction</Text>
      </View>
    );
  } else if (activeFilter === 1 && filteredData.length === 0) {
    noDataText = (
      <View style={styles.noDataContainer}>
        <Image
          source={require("../../../assets/images/data-notfound.jpg")}
          style={styles.image}
        />
        <Text style={styles.noDataText}>No transaction cancelled</Text>
      </View>
    );
  } else if (activeFilter === 3 && filteredData.length === 0) {
    noDataText = (
      <View style={styles.noDataContainer}>
        <Image
          source={require("../../../assets/images/data-notfound.jpg")}
          style={styles.image}
        />
        <Text style={styles.noDataText}>No transaction approved</Text>
      </View>
    );
  } else if (activeFilter === 2 && filteredData.length === 0) {
    noDataText = (
      <View style={styles.noDataContainer}>
        <Image
          source={require("../../../assets/images/data-notfound.jpg")}
          style={styles.image}
        />
        <Text style={styles.noDataText}>No transaction rejected</Text>
      </View>
    );
  } else {
    noDataText = "No transaction record yet";
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={false}
        backgroundColor={Colors.WHITE}
        barStyle="dark-content"
      />
      <View style={styles.appBar}>
        <View style={styles.header}>
          <BackButton onPress={navigation.goBack} />
          <Text style={styles.title}>Transaction History</Text>
        </View>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "all" && styles.activeFilter,
          ]}
          onPress={() => handleFilter("all")}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 0 && styles.activeFilter,
          ]}
          onPress={() => handleFilter(0)}
        >
          <Text style={styles.filterText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 3 && styles.activeFilter,
          ]}
          onPress={() => handleFilter(3)}
        >
          <Text style={styles.filterText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 1 && styles.activeFilter,
          ]}
          onPress={() => handleFilter(1)}
        >
          <Text style={styles.filterText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 2 && styles.activeFilter,
          ]}
          onPress={() => handleFilter(2)}
        >
          <Text style={styles.filterText}>Rejected</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listCard}>
        {loading ? (
          <LoadingComponent />
        ) : filteredData.length === 0 ? (
          <Text style={styles.emptyText}>{noDataText}</Text>
        ) : (
          <FlatList
            data={filteredData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TransactionItem
                item={item}
                onPress={() =>
                  navigation.navigate("DetailTransactionScreen", {
                    transactionId: item.id,
                  })
                }
              />
            )}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WEAK_COLOR,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: Colors.WHITE,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 16,
  },
  activeFilter: {
    backgroundColor: Colors.PRIMARY_COLOR,
  },
  listCard: {
    marginHorizontal: 20,
    marginTop: 20,
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: Colors.GREY,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  noDataContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    borderRadius: 20,
  },
  noDataText: {
    marginTop: 7,
    color: "grey",
  },
});
