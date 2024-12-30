// import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { setstart, setaddResult } from "../store/quizSlice";

export default function Start() {
  const [questionLength, setquestionLength] = useState(10)
  const [maxquestionLength, setmaxquestionLength] = useState(10)
  const result = useSelector((state) => state.quiz.result);
  const dispatch = useDispatch();
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
    funny: () => import("../assets/questions/funnyquestions"),
  };

  function randomShuffle(array) {
    const newArray = [];
    const copyArray = [...array]; 
    while (copyArray.length) {
        const randomIndex = Math.floor(Math.random() * copyArray.length);
        newArray.push(copyArray.splice(randomIndex, 1)[0]);
    }
    return newArray;
}

  const loadQuestions = async () => {
    try {
      if (questionModules[result.subject]) {
        const module = await questionModules[result.subject]();
        setmaxquestionLength(module.default.questions.length)
        let slicedQuestions = randomShuffle(module.default.questions).slice(0, questionLength)
        dispatch(setaddResult({ TestQuestion: { time: parseInt(questionLength), questions: slicedQuestions } }));
      } else {
        Alert.alert("Notice", `No questions found for ${result.subject}`);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  };

  const startTest = async () => {
    dispatch(setaddResult({
      correctresponse: 0,
      incorrectresponse: 0,
    }));
    await loadQuestions();
    dispatch(setstart(true));
    navigation.navigate("test");
  };

  const pickerHandler = (value) => {
    dispatch(setaddResult({
      subject: value,
    }));
  };

  useEffect(() => {
    loadQuestions();
  }, [result.subject, questionLength]);

  useFocusEffect(
    React.useCallback(() => {
      loadQuestions();
    }, [])
  );

  let noarr = Array.from({ length: maxquestionLength }, (_, index) => index + 1)

  // console.log(" questions", result.TestQuestion);

  return (
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
            <Picker.Item label="General Knowledge" value="indianGK" />
            <Picker.Item label="Math" value="math" />
            <Picker.Item label="Python" value="python" />
            <Picker.Item label="Science" value="science" />
            <Picker.Item label="funny" value="funny" />
            <Picker.Item label="Reasoning" value="reasoning" />
            <Picker.Item label="HTML" value="html" />
            <Picker.Item label="CSS" value="css" />
            <Picker.Item label="JavaScript" value="javascript" />
            <Picker.Item label="React" value="react" />
            <Picker.Item label="WordPress" value="wordpress" />
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Question Length</Text>
          <Picker
            selectedValue={questionLength}
            onValueChange={(value) => setquestionLength(value)}
            style={styles.picker}
          >
            {noarr.map((num) => <Picker.Item key={num} label={num.toString()} value={num} />)}
          </Picker>
        </View>

        <View style={styles.buttonContainer}>
          <Button title={"Start Test"} onPress={startTest} color="#4CAF50" />
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
              Do not navigate to other pages or minimize screen
            </Text>
            <Text style={styles.listItem}>
              Typing is not permitted, so do not use keyboard ( and you dont have one)
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
    textAlign: "center",
    marginVertical: 20,
    color: "#fffff",
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
  },
  label: {
    color: "#ffffff",
    marginBottom: 5,
    textAlign: "center",
  },
  picker: {
    height: 50,
    width: "90%",
    color: "#ffffff",
    backgroundColor: "#555",
    borderRadius: 5,
    marginVertical: 5,
  },

  buttonContainer: {
    marginTop: 20,
    // alignItems: "center",
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
    boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  listContainer: {
    textAlign: "center",
  },
  listItem: {
    marginBottom: 8,
  },
});
