import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Colors from "../../utils/Colors";
import apiInstance from "../../config/apiInstance";

export default TotalPriceAndCancel = ({
  calculateTotalPrice,
  transactionStatus,
  transactionId,
  customerId,
  onCancelBooking,
}) => {
  const isPending = transactionStatus === 0;
  const statusText = getTransactionStatusText(transactionStatus);
  const [cancellingTransaction, setCancellingTransaction] = useState(false);

  const cancelTransaction = async () => {
    Alert.alert(
      "Are You Sure?",
      "Do you want to cancel this booking?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setCancellingTransaction(true);
              transactionId = `&transactionId=${transactionId}`;
              customerId = `&customerId=${customerId}`;
              let url = `/transactions/cancel?`;
              if (customerId) {
                url += customerId;
              }
              if (transactionId) {
                url += transactionId;
              }
              const response = await apiInstance.post(url);
              console.log("Cancellation successfully:", response.data);
              onCancelBooking();
              Alert.alert(
                "Cancellation Successful",
                "The booking has been successfully cancelled.",
                [
                  {
                    text: "OK",
                    onPress: () => console.log("OK Pressed"),
                  },
                ]
              );
            } catch (error) {
              console.error("Error cancelling transaction:", error);
            } finally {
              setCancellingTransaction(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.totalPriceText}>Total Price</Text>
        <Text style={styles.totalPriceValue}>{calculateTotalPrice()}</Text>
      </View>
      <View style={styles.bookNowContainer}>
        {isPending && (
          <TouchableOpacity
            style={[
              styles.bookNowButton,
              { backgroundColor: Colors.PRIMARY_COLOR },
            ]}
            onPress={cancelTransaction}
            disabled={cancellingTransaction}
          >
            {cancellingTransaction ? (
              <ActivityIndicator size="small" color={Colors.BLACK} />
            ) : (
              <Text style={{ color: Colors.BLACK, fontWeight: "bold" }}>
                Cancel Booking
              </Text>
            )}
          </TouchableOpacity>
        )}
        {!isPending && (
          <View
            style={{
              backgroundColor: getStatusColor(statusText),
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: Colors.WHITE, fontWeight: "bold" }}>
              {statusText}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const getTransactionStatusText = (statusCode) => {
  switch (statusCode) {
    case 1:
      return "Cancelled";
    case 2:
      return "Rejected";
    case 3:
      return "Approved";
    default:
      return "Unknown";
  }
};

const getStatusColor = (statusText) => {
  switch (statusText) {
    case "Rejected":
      return Colors.RED;
    case "Cancelled":
      return Colors.GREY;
    case "Approved":
      return Colors.GREEN;
    default:
      return Colors.BLACK;
  }
};

const styles = {
  container: {
    height: 70,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  totalPriceText: {
    fontSize: 16,
    color: Colors.BLACK,
    fontWeight: "bold",
  },
  totalPriceValue: {
    color: Colors.GREEN,
    fontWeight: "bold",
    fontSize: 18,
  },
  bookNowButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 20,
  },
};
