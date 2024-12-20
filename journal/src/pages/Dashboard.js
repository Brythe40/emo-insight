import React, { useState, useEffect } from "react";
import JournalInput from "../components/JournalInput";
import EmotionTrackBar from "../components/EmotionTrackBar";
import EmotionGraph from "../components/EmotionGraph";
import ExercisePanel from "../components/ExercisePanel";
import NavBar from "../components/NavBar";
import EmotionLineChart from "../components/EmotionLineChart";
// import EmotionWordCloud from "../components/EmotionWordCloud";
import axios from "axios";

const Dashboard = () => {
  const [journal, setJournal] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingExercise, setLoadingExercise] = useState(false);

  const [emotionLevels, setEmotionLevels] = useState({
    happy: 0,
    sad: 0,
    angry: 0,
    anxious: 0,
    confused: 0,
  });

  const [exerciseSuggestion, setExerciseSuggestion] = useState("");
  // const [lineChartData, setLineChartData] = useState(sampleData);
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    const fetchEmotionHistory = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/emotions-history"
        );
        setLineChartData(response.data);
      } catch (error) {
        console.error("Failed to fetch historical data:", error);
      }
    };

    fetchEmotionHistory(); // Call the function when the component mounts
  }, []);

  // Handle journal input changes
  const handleJournalChange = (event) => {
    setJournal(event.target.value);
  };


  // Handle Submit button click
  const handleSubmit = () => {
    setLoadingSubmit(true);
    axios
      .post("http://127.0.0.1:5000/predict-emotion", { paragraph: journal })
      .then((response) => {
        console.log("Predicted Emotion:", response.data);
        const levels = response.data.sentence_emotions;
        setEmotionLevels(levels);
        setLoadingSubmit(false);
      })
      .catch((error) => {
        console.error("Error analyzing emotion:", error);
        setLoadingSubmit(false);
      });
  };

  // Handle the Clear button click
  const handleClear = () => {
    setJournal("");
    setEmotionLevels({ happy: 0, sad: 0, angry: 0, anxious: 0, confused: 0 });
    setExerciseSuggestion("");
  };

  // Handle submit for exercise suggestion
  const handleExerciseSuggestion = () => {
    setLoadingExercise(true);
    axios
      .post("http://127.0.0.1:5000/suggest-exercise", { journal })
      .then((response) => {
        setExerciseSuggestion(response.data.exercise);
        setLoadingExercise(false);
      })
      .catch((error) => {
        console.error("Error fetching exercise suggestion:", error);
        setLoadingExercise(false);
      });
  };

  return (
    <div className="dashboard-container">
      {/* NavBar */}
      <NavBar />

      {/* Left Section - Journal Input */}
      <JournalInput
        journal={journal}
        handleJournalChange={handleJournalChange}
        handleSubmit={handleSubmit}
        handleClear={handleClear}
        loadingSubmit={loadingSubmit}
      />

      {/* Right Section - Emotional Tracking */}
      <div className="right-panel">
        <EmotionTrackBar emotionLevels={emotionLevels} />
        {/* <EmotionGraph /> */}
        <EmotionLineChart data={lineChartData} />
        {/* <EmotionWordCloud words={wordCloudData} /> */}
        <ExercisePanel exercise={exerciseSuggestion} />{" "}
        <button className="exercise-btn" onClick={handleExerciseSuggestion}>
          {loadingExercise ? "Loading..." : "Get Exercise Suggestions"}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
