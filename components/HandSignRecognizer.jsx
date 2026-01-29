import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Hands } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { predictHandSign } from "../services/api.js";
import "./HandSignRecognizer.css";

export default function HandSignRecognizer({ userId }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [hands, setHands] = useState(null);
  const [prediction, setPrediction] = useState("");
  const lastPredictionTime = useRef(0);

  useEffect(() => {
    const handsInstance = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    handsInstance.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    handsInstance.onResults(onResults);
    setHands(handsInstance);
  }, []);

  const onResults = async (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks?.length > 0) {
      const landmarks = results.multiHandLandmarks[0];

      drawConnectors(ctx, landmarks, Hands.HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 2 });
      drawLandmarks(ctx, landmarks, { color: "#FF0000", lineWidth: 1 });

      const flatLandmarks = [];
      landmarks.forEach((lm) => flatLandmarks.push(lm.x, lm.y, lm.z));

      const now = Date.now();
      if (now - lastPredictionTime.current > 300) {
        lastPredictionTime.current = now;
        try {
          const res = await predictHandSign(userId, flatLandmarks);
          setPrediction(res.data.prediction);
        } catch {
          setPrediction("Prediction error");
        }
      }
    }

    ctx.restore();
  };

  const runHands = async () => {
    if (!hands || !webcamRef.current) return;
    const video = webcamRef.current.video;
    if (!video) return;

    const process = async () => {
      await hands.send({ image: video });
      requestAnimationFrame(process);
    };

    process();
  };

  return (
    <div className="recognizer-container">
      <h3 className="recognizer-title">Live Hand Sign Recognition</h3>

      <div className="recognizer-camera-wrapper">
        <Webcam ref={webcamRef} className="recognizer-webcam" mirrored />
        <canvas ref={canvasRef} className="recognizer-canvas" />
      </div>

      <button onClick={runHands} className="recognizer-button">
        Start Recognition
      </button>

      {prediction && (
        <p className="recognizer-prediction">
          Prediction: <span>{prediction}</span>
        </p>
      )}
    </div>
  );
}
