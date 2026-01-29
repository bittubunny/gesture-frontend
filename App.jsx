import React, { useState } from "react";
import HandSignRecorder from "./components/HandSignRecorder.jsx";
import HandSignTrainer from "./components/HandSignTrainer.jsx";
import HandSignRecognizer from "./components/HandSignRecognizer.jsx";
import "./App.css";

export default function App() {
  const [userId, setUserId] = useState("user1");
  const [step, setStep] = useState(1);

  return (
    <div className="app-container">
      <h1 className="app-title">Personal Hand Sign Web App</h1>

      <div className="user-section">
        <label>User ID:</label>
        <input
          value={userId}
          onChange={e => setUserId(e.target.value)}
        />
      </div>

      <hr />

      <div className="step-buttons">
        <button
          onClick={() => setStep(1)}
          className={step === 1 ? "active" : ""}
        >
          1. Record
        </button>
        <button
          onClick={() => setStep(2)}
          className={step === 2 ? "active" : ""}
        >
          2. Train
        </button>
        <button
          onClick={() => setStep(3)}
          className={step === 3 ? "active" : ""}
        >
          3. Recognize
        </button>
      </div>

      <p className="instructions">
        {step === 1 && "Step 1: Record your personal hand signs. Enter a label and capture multiple samples."}
        {step === 2 && "Step 2: Train your hand sign model. Make sure you recorded enough samples."}
        {step === 3 && "Step 3: Recognize your hand signs live using the webcam."}
      </p>

      <hr />

      {step === 1 && <HandSignRecorder userId={userId} />}
      {step === 2 && <HandSignTrainer userId={userId} />}
      {step === 3 && <HandSignRecognizer userId={userId} />}
    </div>
  );
}
