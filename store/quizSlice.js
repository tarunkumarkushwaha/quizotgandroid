import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    dark: false,
    signIn: true,
    result: {
        TestQuestion: {
            time: 1, // in minutes
            questions: [
                {
                    question: "1. HTML stands for?",
                    option1: "Hypertext Markup Language",
                    option2: "Hyper Makeup Language",
                    option3: "Web development",
                    option4: "Hamara Mark Language",
                    correctresponse: "Hypertext Markup Language",
                    time: 1
                },
            ],
        },
        correctresponse: 0,
        incorrectresponse: 0,
        subject: "indianGK",
        timeLeft: { min: 0, sec: 0 },
        timeTaken: { min: 0, sec: 0 },
    },
    CustomQuestions: [],
    start: false,
    timeover: false,
};

// Async function to store data
export const saveResultToStorage = createAsyncThunk(
    "quiz/saveResultToStorage",
    async (obj, { rejectWithValue }) => {
        try {
            const stringifiedObject = JSON.stringify(obj.value);
            await AsyncStorage.setItem(obj.key, stringifiedObject);
        } catch (error) {
            console.error("Error saving resulta:", obj);
            return rejectWithValue(error.message);
        }
    }
);

const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        setDark(state, action) {
            state.dark = action.payload;
        },
        setSignIn(state, action) {
            state.signIn = action.payload;
        },
        setresult(state, action) {
            state.result = action.payload;
        },
        incrementCorrectResponse: (state) => {
            state.result.correctresponse += 1;
        },
        incrementInCorrectResponse: (state) => {
            state.result.incorrectresponse += 1;
        },
        setaddResult: (state, action) => {
            state.result = {
                ...state.result,
                ...action.payload,
            };
        },
        setCustomQuestions(state, action) {
            state.CustomQuestions = action.payload;
        },
        setstart(state, action) {
            state.start = action.payload;
        },
        setTimeover(state, action) {
            state.timeover = action.payload;
        },
        resetState() {
            return initialState; // Reset to initial state
        },
    },
    extraReducers: (builder) => {
        builder.addCase(saveResultToStorage.fulfilled, (state, action) => {
            // console.log("Result saved to AsyncStorage");
        });
        builder.addCase(saveResultToStorage.rejected, (state, action) => {
            console.error("Failed to save result:", action);
        });
    }
});

export const {
    setDark,
    setSignIn,
    setresult,
    incrementCorrectResponse,
    incrementInCorrectResponse,
    setCustomQuestions,
    setstart,
    setTimeover,
    resetState,
    setaddResult
} = quizSlice.actions;

export default quizSlice.reducer;