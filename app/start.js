// import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image} from "react-native";
import { DataContext } from "./_layout";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";

export default function Start() {
  const [loading, setLoading] = useState(false);

  const {
    signIn,
    CustomQuestions,
    setresult,
    setstart,
    start,
    timeover,
    setTimeover,
    storeData,
    result,
  } = useContext(DataContext);
  const navigation = useNavigation();

  const questionModules = {
    javascript: () => import("../assets/questions/javascriptquestions"),
    react: () => import("../assets/questions/reactquestions"),
    html: () => import("../assets/questions/htmlquestions"),
    css: () => import("../assets/questions/cssquestions"),
    indianGK: () => import("../assets/questions/indianGKquestions"),
    wordpress: () => import("../assets/questions/wordpressquestions"),
    math: () => import("../assets/questions/mathquestions"),
    python: () => import("../assets/questions/pythonquestions"),
    science: () => import("../assets/questions/sciencequestions"),
    reasoning: () => import("../assets/questions/reasoningquestions"),
  };

  const loadQuestions = async () => {
    try {
      if (questionModules[result.subject]) {
        const module = await questionModules[result.subject]();

        setresult((prevState) => ({
          ...prevState,
          TestQuestion: module.default,
        }));
      } else {
        Alert.alert("Notice", `No questions found for ${result.subject}`);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  };

  const startTest = () => {
    setstart(true);
    setresult((prevState) => ({
      ...prevState,
      correctresponse: 0,
      incorrectresponse: 0,
    }));
    loadQuestions();
    navigation.navigate("test");
  };

  const pickerHandler = (value) => {
    setresult((prevState) => ({
      ...prevState,
      subject: value,
    }));
  };

  useEffect(() => {
    loadQuestions();
  }, [result.subject]);

  useFocusEffect(
    React.useCallback(() => {
      loadQuestions();
    }, [])
  );

  return  (
    <View style={styles.mainContainer}>
      <Image
        source={{
          uri: "https://cdn.pixabay.com/photo/2017/02/05/04/24/question-2039124_1280.jpg",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <Text style={styles.header}>Test Settings</Text>
      <View style={styles.settingsContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Subject</Text>
          <Picker
            selectedValue={result.subject}
            onValueChange={pickerHandler}
            style={styles.picker}
          >
            <Picker.Item label="General Knowlwdge" value="indianGK" />
            <Picker.Item label="Math" value="math" />
            <Picker.Item label="Python" value="python" />
            <Picker.Item label="Science" value="science" />
            <Picker.Item label="Reasoning" value="reasoning" />
            <Picker.Item label="HTML" value="html" />
            <Picker.Item label="CSS" value="css" />
            <Picker.Item label="JavaScript" value="javascript" />
            <Picker.Item label="React" value="react" />
            <Picker.Item label="WordPress" value="wordpress" />
          </Picker>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Start Test" onPress={startTest} color="#4CAF50" />
        </View>

        <View style={styles.container}>
          <Text style={styles.title}>Test Rules</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              Test has a specified time limit. Ensure to complete it within the
              given time.
            </Text>
            <Text style={styles.listItem}>
              Once you move to the next question, you cannot return to the
              previous one.
            </Text>
            <Text style={styles.listItem}>
              Do not close the page during the test; it may cancel your test.
            </Text>
            <Text style={styles.listItem}>
              Make sure your internet connection is stable to avoid disruptions.
            </Text>
            <Text style={styles.listItem}>
              Do not navigate to other pages or minimize screen
            </Text>
            <Text style={styles.listItem}>
              Typing is not permitted, so do not use keyboard
            </Text>
            <Text style={styles.listItem}>
              Follow all instructions provided by the test administrator.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
    opacity: 0.7,
  },

  mainContainer: {
    flex: 1,
    backgroundColor: "#282c34",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    // color: "#FFD700",
    textAlign: "center",
    marginVertical: 20,
  },

  settingsContainer: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
  },
  pickerContainer: {
    marginVertical: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  label: {
    color: "#ffffff",
    marginBottom: 5,
    width: 300,
  },
  picker: {
    height: 40,
    width: 200,
    color: "#ffffff",
    backgroundColor: "#555",
    borderRadius: 5,
  },

  buttonContainer: {
    marginTop: 20,
  },
  notAvailableText: {
    textAlign: "center",
    color: "#cccccc",
    marginVertical: 10,
  },

  container: {
    backgroundColor: "#f2f2f2",
    padding: 24,
    marginTop: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  listContainer: {
    // paddingLeft: 20,
    textAlign: "center",
  },
  listItem: {
    marginBottom: 8,
  },
});
