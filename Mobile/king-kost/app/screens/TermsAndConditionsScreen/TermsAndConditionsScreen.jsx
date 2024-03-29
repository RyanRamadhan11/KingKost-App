import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";

export default function TermsAndConditionsScreen() {
  const [sections, setSections] = useState({
    section1: false,
    section2: false,
  });

  const toggleSection = (section) => {
    setSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Terms and Conditions</Text>

        <Text style={styles.paragraph}>
          Hello, thank you for visiting the kingkos website or Kingkos
          application, which is a web platform for booking boarding houses.
        </Text>
        <Text style={styles.paragraph}>
          This platform is owned and operated by Kingkos and its affiliates. We
          advise users, namely customers (boarding house residents) and sellers
          (boarding house lessors), to read these Terms and Conditions
          regularly, including the Privacy Policy and User Penalty Policy, which
          are an integral part of these Terms and Conditions as they may affect
          your rights and obligations.
        </Text>
        <Text style={styles.paragraph}>
          By visiting, using, accessing, and/or registering yourself on Our
          Platform, you are deemed to have read, understood, comprehended, and
          agreed to all the contents contained in these Terms and Conditions
          ("T&C"). If you do not agree to be bound by these T&C, then you are
          not allowed to access and/or use Our Platform.
        </Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity onPress={() => toggleSection("section1")}>
          <View style={styles.header}>
            <Text style={styles.sectionTitle}>Definitions</Text>
            <Icon
              name={sections.section1 ? "chevron-up" : "chevron-down"}
              size={20}
              color="#000"
            />
          </View>
        </TouchableOpacity>
        {sections.section1 && (
          <View>
            <Text style={styles.definition}>
              1.1 "Apply for Rent" means that the Tenant can make a reservation
              and/or apply for rent on the property for the available and
              selected dates by the Tenant.
            </Text>
            <Text style={styles.definition}>
              1.2 "Kingkos User Account" means the registered account owned by
              you and managed by Kingkos.
            </Text>
            <Text style={styles.definition}>
              1.3 "Tenant" means prospective or existing residents of the
              Property who use the Apply for Rent feature.
            </Text>
            <Text style={styles.definition}>
              1.4 "Owner" means the owner or authorized party of the Property
              that is valid and can be proven based on the laws of the Republic
              of Indonesia who intends to rent out the Units located on the
              Property.
            </Text>
            <Text style={styles.definition}>
              1.5 "Property" means a boarding house building, rented house, or
              one apartment unit managed by the Owner listed on Our Platform.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.separator}></View>

      <View style={styles.section}>
        <TouchableOpacity onPress={() => toggleSection("section2")}>
          <View style={styles.header}>
            <Text style={styles.sectionTitle}>
              Booking, Check-in, Relocation, and Reschedule
            </Text>
            <Icon
              name={sections.section2 ? "chevron-up" : "chevron-down"}
              size={20}
              color="#000"
            />
          </View>
        </TouchableOpacity>
        {sections.section2 && (
          <View>
            <Text style={styles.definition}>
              2.1 The Tenant selects a Property listed on the Listing according
              to the Tenant's needs.
            </Text>
            <Text style={styles.definition}>
              2.2 Completing the Tenant's personal data according to the form
              provided on the Platform.
            </Text>
            <Text style={styles.definition}>
              2.3 The Tenant can make a reservation for the selected Property by
              applying for rent and making payments according to the provisions
              in Clause 7 of these T&C.
            </Text>
            <Text style={styles.definition}>
              2.4 The Tenant must check in using the "check-in" feature through
              Our Platform according to the date stated on the Contract. If
              within 5x24 hours since the Start Date of Renting, the Tenant does
              not change the status, then We cannot assist in the refund
              process. This provision does not apply to Properties that have the
              "Singgahsini, APIK, and/or Kos Pilihan" logo/flagging on the
              Platform.
            </Text>
          </View>
        )}

        <View style={styles.separator}></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  paragraph: {
    marginBottom: 10,
    fontSize: 16,
    textAlign: "justify",
  },
  definition: {
    marginBottom: 5,
    textAlign: "justify",
  },
  subSectionTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "justify",
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
  },
});
