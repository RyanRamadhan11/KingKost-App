import React from "react";
import { Modal, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../utils/Colors";

export default ImageModal = ({ visible, closeModal, imageSource }) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalContainer}>
        <Image source={imageSource} style={styles.modalImageLarge} />
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <AntDesign
            name="closecircle"
            size={35}
            color={Colors.PRIMARY_COLOR}
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalImageLarge: {
    width: "80%",
    height: "70%",
    borderRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: "16%",
    right: "12%",
  },
});
