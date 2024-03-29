import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Fontisto, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default Facility = ({ wifi, parking, airConditioner }) => {
    return (
        <View style={styles.container}>
            <View style={styles.facilityContainer}>
                {wifi !== false && (
                    <View style={styles.facility}>
                        <Fontisto name="wifi-logo" size={20} color="black" />
                    </View>
                )}
                {parking !== false && (
                    <View style={styles.facility}>
                        <FontAwesome5 name="parking" size={20} color="black" />
                    </View>
                )}
                {airConditioner !== false && (
                    <View style={styles.facility}>
                        <MaterialCommunityIcons name="air-conditioner" size={20} color="black" />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
    },
    facilityContainer: {
        marginTop: 10,
        flexDirection: "row",
    },
    facility: {
        flexDirection: "row",
        marginRight: 15
    },
});

