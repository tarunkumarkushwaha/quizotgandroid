import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Modal,
    Image,
    ScrollView,
} from "react-native";
// import { useDispatch } from "react-redux";
import * as Clipboard from 'expo-clipboard';

export default function ShowQuestionFormat({ showQuestionFormatModal, setShowQuestionFormatModal }) {
    // const dispatch = useDispatch();

    // const schema = ["question", "option1", "option2", "option3", "option4", "correctresponse", "time"];

    const textToCopy = `Step 1. Convert questions in csv in the following schema:
      - **question**: The question text.
      - **option1, option2, option3, option4**: Multiple-choice answers.
      - **correctresponse**: The correct answer text.
      - **time**: fill all this field with 1`;

    const handleCopy = async () => {
        await Clipboard.setStringAsync(textToCopy);
        Alert.alert("Text copied", "paste on any ai tool (chatgpt will be best) with your text questions and answers to convert them to csv");
    };


    return (
        <>
            <Modal
                visible={showQuestionFormatModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowQuestionFormatModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <ScrollView style={styles.modalContent}>
                        <TouchableOpacity style={styles.button} onPress={() => setShowQuestionFormatModal(false)}>
                            <Text style={styles.buttonText}>close</Text>
                        </TouchableOpacity>
                        <View style={styles.listContainer}>
                        <Text style={styles.listItem}>
                                Method 1.
                            </Text>
                            <TouchableOpacity onPress={handleCopy}>
                                <Text style={styles.listItem}>{textToCopy}</Text>
                            </TouchableOpacity>
                            <Text style={{color:"red",margin:5}}>
                                copy format by clicking above ^.
                            </Text>
                            <Text style={{color:"blue",margin:5}}>
                                OR
                            </Text>
                            <Text style={styles.listItem}>
                                Method 2
                            </Text>
                            <Text style={styles.listItem}>
                                Step 1. create excel file with below format in image.
                            </Text>
                            <Text style={styles.listItem}>
                                Step 2. Convert the file to `.csv` or `.json`.
                            </Text>
                            <Text style={styles.listItem}>
                                Example of excel/csv is given below.
                            </Text>
                            <View style={styles.container}>
                                <ScrollView
                                    horizontal
                                    contentContainerStyle={styles.scrollView}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    <Image
                                        source={require("../assets/images/examplecsv.png")}
                                        style={styles.image}
                                        resizeMode="contain"
                                    />
                                </ScrollView>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    scrollView: {
        flexDirection: "row",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 800,
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
        maxHeight: "85%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        paddingTop:30
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
        top: -20,
        right: 0,
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