import React, { useState } from "react";
import {
    View,
    Text,
    Button,
    FlatList,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Modal,
} from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from "papaparse";
import { useSelector, useDispatch } from "react-redux";
import { setaddResult, setCustomQuestions } from "../store/quizSlice"
import ShowQuestionFormat from "./ShowQuestionFormat";
import { PermissionsAndroid } from 'react-native';

export default function UploadQuestions({ setmaxquestionLength, randomShuffle }) {
    const [showQuestionFormatModal, setShowQuestionFormatModal] = useState(false);
    const [validData, setValidData] = useState([]);
    const [invalidData, setInvalidData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showList, setShowList] = useState(true);
    const dispatch = useDispatch();

    const schema = ["question", "option1", "option2", "option3", "option4", "correctresponse", "time"];

    const handleUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["*/*"],
            });

            // console.log(result)
            if (!result.canceled) {
                const { uri, name } = result.assets[0];
                const fileType = name.endsWith(".csv") ? "csv" : "json";

                const fileContent = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.UTF8,
                });

                if (fileType === "csv") {
                    parseCSV(fileContent);
                } else if (fileType === "csv") {
                    parseJSON(fileContent);
                } else {
                    Alert.alert("It is not a csv or json file");
                }
            }
        } catch (error) {
            Alert.alert("Error", "Failed to upload or process the file.");
            console.error(error);
        }
    };

    const parseCSV = (data) => {
        Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                validateData(results.data);
            },
            error: (error) => {
                Alert.alert("Parsing Error", error.message);
                console.error(error);
            },
        });
    };

    const parseJSON = (data) => {
        try {
            const jsonData = JSON.parse(data);
            validateData(jsonData);
        } catch (error) {
            Alert.alert("Parsing Error", "Invalid JSON format.");
            console.error(error);
        }
    };

    const validateData = (data) => {
        const valid = [];
        const invalid = [];

        const normalizeKey = (key) => key.toLowerCase(); 
        const normalizedSchema = schema.map(normalizeKey);

        data.forEach((row, index) => {
            const normalizedRow = {};
            Object.entries(row).forEach(([key, value]) => {
                normalizedRow[normalizeKey(key)] = value;
            });

            const missingFields = normalizedSchema.filter(
                (field) => !(field in normalizedRow) || !normalizedRow[field]
            );

            if (missingFields.length === 0) {
                // Ensure options are in correct order and exist
                const options = [
                    normalizedRow["option1"],
                    normalizedRow["option2"],
                    normalizedRow["option3"],
                    normalizedRow["option4"],
                ];

                if (options.some((option) => !option)) {
                    invalid.push({
                        row: normalizedRow,
                        error: `Row ${index + 1}: One or more options are missing or incorrect.`,
                    });
                } else {
                    valid.push(row); 
                }
            } else {
                invalid.push({
                    row,
                    error: `Row ${index + 1} is missing fields: ${missingFields.join(", ")}.`,
                });
            }
        });

        setValidData(valid);
        setInvalidData(invalid);
        // console.log(invalid)

        if (invalid.length > 0) {
            Alert.alert("Validation Complete", `${invalid.length} invalid rows found.`);
        }
        else {
            setmaxquestionLength(valid.length)
            let slicedQuestions = randomShuffle(valid).slice(0, valid.length)
            dispatch(setaddResult({ TestQuestion: { time: parseInt(valid.length), questions: slicedQuestions } }));
            dispatch(setCustomQuestions({ TestQuestion: { time: parseInt(valid.length), questions: slicedQuestions } }));
        }
    };

    const handleGenerateCsvInfo = () => {
        setShowQuestionFormatModal(true)
    };


    return (
        <View style={styles.safeArea}>
            <Text style={styles.header}>Upload Questions</Text>
            <TouchableOpacity onPress={handleUpload} style={styles.button}>
                <Text style={styles.buttonText}>Upload CSV/JSON File</Text>
            </TouchableOpacity>
            {!validData.length > 0 && <TouchableOpacity style={styles.button} onPress={handleGenerateCsvInfo}>
                <Text style={styles.buttonText}>How to Generate CSV?</Text>
            </TouchableOpacity>}
            <ShowQuestionFormat setShowQuestionFormatModal={setShowQuestionFormatModal} showQuestionFormatModal={showQuestionFormatModal} />
            {validData.length > 0 && <TouchableOpacity onPress={() => setShowModal(true)} style={styles.button}>
                <Text style={styles.buttonText}>show Questions</Text>
            </TouchableOpacity>}
            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* <Text style={styles.header}>Upload Questions</Text>
                        <Button title="Upload File" onPress={handleUpload} /> */}
                        <Text style={styles.subHeader}>Questions uploaded</Text>
                        <Button
                            title={showList ? "Hide Questions" : "Show Questions"}
                            onPress={() => setShowList(!showList)}
                        />
                        {showList && validData.length > 0 ? (
                            <FlatList
                                data={validData}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.card}>
                                        <Text>Question: {item.question}</Text>
                                        {["option1", "option2", "option3", "option4"].map(
                                            (key) => (
                                                <Text key={key}>Option: {item[key]}</Text>
                                            )
                                        )}
                                        <Text>Answer: {item.correctresponse}</Text>
                                    </View>
                                )}
                                initialNumToRender={5}
                                windowSize={10}
                                contentContainerStyle={styles.flatListContent}
                                keyboardShouldPersistTaps="handled"
                            />
                        ) : (
                            <Text style={styles.noData}>
                                {showList ? "No valid questions uploaded yet." : ""}
                            </Text>
                        )}
                        {invalidData.length > 0 && (
                            <TouchableOpacity
                                style={styles.errorButton}
                                onPress={() =>
                                    Alert.alert(
                                        "Invalid Rows",
                                        JSON.stringify(invalidData, null, 2)
                                    )
                                }
                            >
                                <Text style={styles.errorButtonText}>View Invalid Rows</Text>
                            </TouchableOpacity>
                        )}
                        <Button title="Close" onPress={() => setShowModal(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        marginVertical: 20,
        padding: 10,
        width: "100%",
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
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
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 18,
        marginTop: 20,
        marginBottom: 10,
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    noData: {
        fontSize: 16,
        color: "#999",
    },
    flatListContent: {
        paddingBottom: 20,
    },
    errorButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#ff4d4d",
        borderRadius: 8,
    },
    errorButtonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        margin: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

