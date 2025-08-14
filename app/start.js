// import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, Alert, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { setstart, setaddResult } from "../store/quizSlice";
import { useRouter } from "expo-router";
import FileUploadComponent from "../components/FileUploadComponent";

export default function Start() {
  const [questionLength, setquestionLength] = useState(10)
  const [customQuestion, setcustomQuestion] = useState(false)
  const [maxquestionLength, setmaxquestionLength] = useState(10)
  const result = useSelector((state) => state.quiz.result);
  const savedCustomQuestions = useSelector((state) => state.quiz.CustomQuestions);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const router = useRouter();
  const [value, setValue] = useState("10");
  const [questionGenerateInput, setquestionGenerateInput] = useState(false);
  const [questionGenerateInputText, setquestionGenerateInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState("");

  const handleChange = (text) => {
    // Only allow numeric input
    const numericValue = text.replace(/[^0-9]/g, '');
    setValue(numericValue);
  };

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

  const GenerateQuestion = () => {
    setLoading(true);

    fetch(`https://quiztimequestionapi.onrender.com/ask?prompt=${encodeURIComponent(questionGenerateInputText)}&count=${questionLength}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data) {
          dispatch(setaddResult({
            TestQuestion: {
              time: parseInt(data.time, 10) || 10,
              questions: data.question
            }
          }));
          setValue(String(data.time || 10));
          Alert.alert("Rejoice", `Question Generated`);
        } else {
          Alert.alert("Error", "No questions returned from AI");
        }
      })
      .catch(error => {
        let errStr = String(error);
        if (errStr.length > 30) {
          errStr = errStr.slice(0, 50) + "...";
        }
        seterror(errStr);
        Alert.alert("Please wait for 30sec", `AI waking up`);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const loadQuestions = async () => {
    try {
      if (result.subject === "custom") {
        setquestionGenerateInput(false);
        return;
      }

      if (result.subject === "generate question") {
        setquestionGenerateInput(true);
        setLoading(true);
        fetch(`https://quiztimequestionapi.onrender.com/questions/javascriptquestions`)
          .then(response => response.json())
          .then(data => {
            console.log(data, "waking up");
            seterror("");
          })
          .catch(error => {
            console.error(error);
            let errStr = String(error);
            const displayErr = errStr.length > 50 ? errStr.slice(0, 50) + "..." : errStr;
            seterror(displayErr);
            Alert.alert("Oops", displayErr);
          })
          .finally(() => {
            setLoading(false);
          });
        return;
      }

      if (questionModules[result.subject]) {
        setquestionGenerateInput(false);

        let module;
        try {
          module = await questionModules[result.subject]();
        } catch (err) {
          console.error("Error importing questions:", err);
          Alert.alert("Error", "Unable to load questions for " + result.subject);
          return;
        }

        const availableLength = module.default.questions.length;
        setmaxquestionLength(availableLength);

        const length = Math.min(questionLength, availableLength);
        const slicedQuestions = randomShuffle(module.default.questions).slice(0, length);

        dispatch(setaddResult({
          TestQuestion: {
            time: parseInt(value, 10) || 10,
            questions: slicedQuestions
          }
        }));
      } else {
        result.subject !== "generate question" &&
          Alert.alert("Notice", `No questions found for ${result.subject}`);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  };


  const startTest = async () => {
    // Check for empty custom questions before navigation
    if (result.subject === "custom" && savedCustomQuestions.length <= 0) {
      Alert.alert("No custom questions", "Switching to General Knowledge questions");
      dispatch(setaddResult({ subject: "indianGK" }));
      await loadQuestions();
    }

    // Prevent AI test start without generated questions
    if (result.subject === "generate question" && !result.TestQuestion?.questions?.length) {
      Alert.alert("Please generate questions first");
      return;
    }

    dispatch(setaddResult({
      correctresponse: 0,
      incorrectresponse: 0,
    }));

    await loadQuestions();
    dispatch(setstart(true));
    navigation.navigate("test");
  };

  const pickerHandler = (value) => {
    if (value == "custom") {
      setcustomQuestion(true)
    } else { setcustomQuestion(false) }
    dispatch(setaddResult({
      subject: value,
    }));
  };

  useEffect(() => {
    loadQuestions();
  }, [result.subject, questionLength]);

  useFocusEffect(
    React.useCallback(() => {
      // loadQuestions();
      setcustomQuestion(false)
    }, [])
  );

  let noarr = Array.from({ length: maxquestionLength }, (_, index) => index + 1)

  // console.log(" questions", value);

  return (
    <View style={styles.mainContainer}>
      <Image
        source={require("../assets/images/mainbg.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      {/* <TouchableOpacity onPress={() => router.dismissAll()} style={styles.backButton}> */}
      <TouchableOpacity onPress={() => router.dismissAll()} style={styles.backButton}>
        <Image
          source={{ uri: "https://img.icons8.com/stickers/50/back.png" }}
          style={{ width: 25, height: 25 }}
        />
      </TouchableOpacity>
      <Text style={styles.header}>Test Settings</Text>
      <View style={styles.settingsContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Subject</Text>
          <Picker
            selectedValue={result.subject}
            onValueChange={pickerHandler}
            style={styles.picker}
          >
            <Picker.Item label="Generate Questions" value="generate question" />
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
            <Picker.Item label="custom questions" value="custom" />
          </Picker>
        </View>

        <Text style={styles.label}>Time</Text>
        <TextInput
          style={styles.input}
          value={value}
          // defaultValue={questionLength}
          onChangeText={handleChange}
          keyboardType="numeric"
          placeholder={value.toString()}
          placeholderTextColor="#aaa"
        />
        {!customQuestion ? <View style={styles.pickerContainer}>
          <Text style={styles.label}>Question Length</Text>
          <Picker
            selectedValue={questionLength}
            onValueChange={(value) => setquestionLength(value)}
            style={styles.picker}
          >
            {noarr.map((num) => <Picker.Item key={num} label={num.toString()} value={num} />)}
          </Picker>
        </View>
          :
          <FileUploadComponent randomShuffle={randomShuffle} setmaxquestionLength={setmaxquestionLength} />
        }
        {questionGenerateInput &&
          <>
            {loading ? <Text style={styles.label}>Generate Questions</Text> :
              <Text style={styles.label}>Generate Questions</Text>}
            <TextInput
              style={styles.input}
              value={questionGenerateInputText}
              // defaultValue={questionLength}
              onChangeText={(val) => setquestionGenerateInputText(val.split(" ").join("_"))}
              placeholder={"Generate questions via AI"}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity disabled={loading} onPress={GenerateQuestion} style={styles.button}>
              <Text style={styles.buttonText}>{loading ? "Please wait..." : "Generate Question"}</Text>
            </TouchableOpacity>
          </>
        }

        <TouchableOpacity disabled={loading} onPress={startTest} style={styles.button}>
          <Text style={styles.buttonText}>Start Test</Text>
        </TouchableOpacity>

        {!customQuestion && <View style={styles.container}>
          <Text style={styles.title}>Test Rules</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              For AI generated questions first click on generate, after generating
              click on start test
            </Text>
            <Text style={styles.listItem}>
              Test has a specified time limit.
            </Text>
            <Text style={styles.listItem}>
              Once you move to the next question, you cannot return to the
              previous one.
            </Text>
            {/* <Text style={styles.listItem}>
              Do not close the page during the test; it may cancel your test.
            </Text> */}
            {/* <Text style={styles.listItem}>
              Do not navigate to other pages or minimize screen
            </Text>
            <Text style={styles.listItem}>
              Typing is not permitted, so do not use keyboard ( and you dont have one)
            </Text> */}
          </View>
        </View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "white",
    backgroundColor: '#575654',
  },
  button: {
    backgroundColor: "#008000",
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
    overflow:"scroll",
    backgroundColor: "#282c34",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  settingsContainer: {
    // overflow:"scroll",
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  pickerContainer: {
    marginVertical: 10,
    width: "100%",
  },
  label: {
    color: "#ffffff",
    marginBottom: 5,
    textAlign: "left",
    width: "100%",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#ffffff",
    backgroundColor: "#555",
    borderRadius: 5,
    paddingHorizontal: 10,
  },

  container: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  listContainer: {
    marginTop: 10,
  },
  listItem: {
    marginBottom: 5,
    color: "#333",
    textAlign: "left",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 10,
    padding: 10,
    zIndex: 10,
  },
});

