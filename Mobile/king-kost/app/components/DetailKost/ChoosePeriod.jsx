import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../utils/Colors';
import { Picker } from '@react-native-picker/picker';

export default ChoosePeriod = ({ title, selectedMonths, setSelectedMonths }) => {
    return (
        <View style={styles.container}>
            <View style={styles.choosePeriodContent}>
                <Text style={styles.choosePeriodText}>{title}</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        style={styles.monthPicker}
                        selectedValue={selectedMonths}
                        onValueChange={(itemValue) => setSelectedMonths(itemValue)}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                            <Picker.Item key={month} label={`${month} Month`} value={month} />
                        ))}
                    </Picker>
                </View>
            </View>
        </View>
    );
};

const styles = {
    container: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: Colors.WEAK_COLOR,
        borderRadius: 10,
    },
    choosePeriodContent: {
        marginVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    choosePeriodText: {
        fontSize: 16,
        color: Colors.BLACK,
        fontWeight: "bold",
        marginLeft: 20,
    },
    pickerContainer: {
        backgroundColor: Colors.PRIMARY_COLOR,
        borderRadius: 10,
        width: '40%',
        marginRight: 10,
    },
    monthPicker: {
        width: '100%',
        height: 50,
        color: Colors.BLACK,
    },
};

