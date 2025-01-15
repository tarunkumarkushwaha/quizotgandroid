import React, { useState } from "react";
import {
    View,
    Text,
    Button,
    FlatList,
    StyleSheet,
    Alert,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    Image,
    ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

export default function ShowQuestionFormat({ showQuestionFormatModal, setShowQuestionFormatModal }) {
    const dispatch = useDispatch();

    const schema = ["question", "option1", "option2", "option3", "option4", "correctresponse", "time"];

    // Alert.alert(
    //     "Generate CSV Instructions",
    //     `You can generate a CSV file by structuring your questions as per this schema:\n\n${schema.join(
    //         ", "
    //     )}\n\nIf you have a list of questions, you can use AI tools (like ChatGPT) to format them into CSV. For example, provide your questions and request a CSV in the required schema.`
    // );


    return (
        <>
            <Modal
                visible={showQuestionFormatModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowQuestionFormatModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.button} onPress={() => setShowQuestionFormatModal(false)}>
                            <Text style={styles.buttonText}>close</Text>
                        </TouchableOpacity>
                        <View style={styles.listContainer}>
                            <Text style={styles.listItem}>
                                1. Prepare your questions in the following schema:
                                {"\n"}
                                - **Question**: The question text.
                                {"\n"}
                                - **Option1, Option2, Option3, Option4**: Multiple-choice answers.
                                {"\n"}
                                - **Correct Response**: The correct answer text.
                                {"\n"}
                                - **Time**: Time allowed for the question (in seconds).
                            </Text>
                            <Text style={styles.listItem}>
                                2. Use any spreadsheet software or AI tool to format your questions into CSV.
                            </Text>
                            <Text style={styles.listItem}>
                                3. Save the file as a `.csv` or `.json` with the required schema.
                            </Text>
                            <Text style={styles.listItem}>
                                4. Use the "Upload CSV/JSON" button below to upload your file.
                            </Text>
                            <Text style={styles.listItem}>
                                5. You can also create excel file and convert it into csv by using any online converters.
                            </Text>
                            <Text style={styles.listItem}>
                                6. Example of csv is given below.
                            </Text>
                            <ScrollView contentContainerStyle={styles.scrollView}>
                                <Image
                                    source={require("../assets/images/examplecsv.png")}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex:1,
    },
    image: {
        width: "100%",
        height: 100, 
    },
    modalOverlay: {
        flex: 1,
        gap: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        maxHeight: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
    },
    listContainer: {
        marginBottom: 20,
    },
    listItem: {
        fontSize: 16,
        marginBottom: 10,
        color: "#333",
    },
    button: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "#007bff",
        padding: 2,
        width: 50,
        borderRadius: 8,
        marginBottom: 2,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});