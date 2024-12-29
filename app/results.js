import React, {  useState } from "react";
import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
// import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { setstart, setaddResult, resetState, saveResultToStorage } from "../store/quizSlice";
import { useRouter } from "expo-router";

const Result = () => {
  const [haspastresult, sethaspastresult] = useState(false);
  const [pastresult, setpastresult] = useState({});
  // const navigation = useNavigation();
  const router = useRouter();

  const result = useSelector((state) => state.quiz.result);
  const signIn = useSelector((state) => state.quiz.signIn);
  // const start = useSelector((state) => state.quiz.start);
  const dark = useSelector((state) => state.quiz.dark);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      const getPastResult = async () => {
        const pastResult = await AsyncStorage.getItem("pastresult");
        if (pastResult) setpastresult(JSON.parse(pastResult));
        if (pastResult) sethaspastresult(true);
      };
      getPastResult();

      if (result.TestQuestion.questions.length >= 1) {
        dispatch(saveResultToStorage({key:"result", value:result}));
        dispatch(setstart(false));
      }

      return () => {
        let key = "pastresult"
        result.TestQuestion.questions.length >= 1 &&
          dispatch(saveResultToStorage({ key: key, value: result }));

      };
    }, [])
  );

  // console.log(pastresult.TestQuestion.questions.length,"past result")

  return (
    <View style={[styles.container]}>
      <Image
        source={{
          uri: "https://cdn.pixabay.com/photo/2017/02/05/04/24/question-2039124_1280.jpg",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {signIn ? (
        result.TestQuestion.questions.length >= 1 ? (
          <View style={styles.contentContainer}>
            <Text style={[styles.title, { color: !dark ? "#333" : "#333" }]}>
              Result of {result.subject} quiz
            </Text>
            <View style={styles.resultBox}>
              <View style={styles.resultText}>
                <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                  Correct Responses: <Text style={styles.value}>{result.correctresponse}</Text>
                </Text>
              </View>
              <View style={styles.resultText}>
                <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                  Incorrect Responses: <Text style={styles.value}>{result.incorrectresponse}</Text>
                </Text>
              </View>
              <View style={styles.resultText}>
                <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                  Unattempted Questions:{" "}
                  <Text style={styles.value}>
                    {result.TestQuestion.questions.length -
                      (result.incorrectresponse + result.correctresponse)}
                  </Text>
                </Text>
              </View>
              <View style={styles.resultText}>
                <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                  Total Questions: <Text style={styles.value}>{result.TestQuestion.questions.length}</Text>
                </Text>
              </View>
              <View style={styles.resultText}>
                <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                  Percentage:{" "}
                  <Text style={styles.value}>
                    {parseFloat(
                      (
                        (result.correctresponse / result.TestQuestion.questions.length) *
                        100
                      ).toFixed(2)
                    )}
                    %
                  </Text>
                </Text>
              </View>
              <View style={styles.resultText}>
                <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                  Time Left:{" "}
                  <Text style={styles.value}>
                    {`${result.timeLeft.min} min : ${result.timeLeft.sec === 0 ? "00" : result.timeLeft.sec
                      } sec`}
                  </Text>
                </Text>
              </View>
              <View style={styles.resultText}>
                <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                  Time Taken:{" "}
                  <Text style={styles.value}>
                    {`${result.timeTaken.min} min : ${result.timeTaken.sec === 0 ? "00" : result.timeTaken.sec
                      } sec`}
                  </Text>
                </Text>
              </View>

              <Text style={styles.resultTitleText}>Past Results</Text>

              {haspastresult ? (
                <>
                  <View style={styles.resultText}>
                    <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                      Test subject: <Text style={styles.value}>{pastresult.subject}</Text>
                    </Text>
                  </View>
                  <View style={styles.resultText}>
                    <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                      Percentage:{" "}
                      <Text style={styles.value}>
                        {parseFloat(
                          ((pastresult.correctresponse / pastresult.TestQuestion.questions.length) * 100
                          ).toFixed(2)
                        )}
                        %
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.resultText}>
                    <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                    correct response out of questions:{" "}
                      <Text style={styles.value}>
                        {`${pastresult.correctresponse} / ${pastresult.TestQuestion.questions.length}`}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.resultText}>
                    <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                      Time taken:{" "}
                      <Text style={styles.value}>
                        {`${pastresult.timeLeft.min} min : ${result.timeLeft.sec === 0 ? "00" : result.timeLeft.sec
                          } sec`}
                      </Text>
                    </Text>
                  </View>
                  {result.subject === pastresult.subject && (
                    <View style={styles.resultText}>
                      {(() => {
                        if (
                          result?.TestQuestion?.questions?.length &&
                          pastresult?.TestQuestion?.questions?.length
                        ) {
                          const currentPercentage =
                            (result.correctresponse / result.TestQuestion.questions.length) * 100;

                          const pastPercentage =
                            (pastresult.correctresponse / pastresult.TestQuestion.questions.length) * 100;

                          const improvement = (currentPercentage - pastPercentage).toFixed(2);

                          if (improvement > 0) {
                            return (
                              <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                                Improvement: <Text style={styles.value}>{`${improvement}%`}</Text>
                              </Text>
                            );
                          } else if (improvement < 0) {
                            return (
                              <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                                Demotion: <Text style={styles.value}>{`${Math.abs(improvement)}%`}</Text>
                              </Text>
                            );
                          } else {
                            return (
                              <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                                No Change: <Text style={styles.value}>0.00%</Text>
                              </Text>
                            );
                          }
                        } else {
                          return (
                            <Text style={{ color: !dark ? "#ffffff" : "#333" }}>
                              Improvement Not Available
                            </Text>
                          );
                        }
                      })()}
                    </View>
                  )}
                </>
              ) : (
                <Text style={{ color: !dark ? "#ffffff" : "#333" }}>No past results</Text>
              )}
            </View>


          </View>
        ) : (
          <View style={styles.contentContainer}>
            <View style={styles.resultBox}>
              <Text
                style={[styles.title, { color: !dark ? "#ffffff" : "#333" }]}
              >
                No current results
              </Text>

            </View>
          </View>
        )
      ) : (
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: !dark ? "#ffffff" : "#333" }]}>
            Please Log In to Use the App
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: !dark ? "#444" : "#007bff" },
            ]}
            onPress={() => {
              // Handle button press
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={() => {
          // navigation.navigate("index")
          router.dismissAll()
          dispatch(resetState())
          // router.replace("/");
          // resetContext()
        }}
        style={styles.startTestButton}
      >
        <Text style={styles.buttonText}>Restart Test</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  startTestButton: {
    backgroundColor: "#222222",
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    fontSize: 20,
    fontWeight: "bolder",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bolder",
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

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#333",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  resultBox: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    marginBottom: 12,
  },
  resultTitleText: {
    fontSize: 28,
    marginBottom: 14,
    fontWeight: "bold",
    color: "#FF8C00",
  },
  value: {
    fontWeight: "bold",
    color: "#007bff",
  },
  button: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Result;
