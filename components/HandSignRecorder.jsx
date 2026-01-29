import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Hands } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { captureHandSign } from "../services/api.js";
import "./HandSignRecorder.css";

export default function HandSignRecorder({ userId }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [label, setLabel] = useState("");
  const [msg, setMsg] = useState("");
  const [samples, setSamples] = useState(0);
  const [hands, setHands] = useState(null);

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

  const onResults = (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];

      drawConnectors(ctx, landmarks, Hands.HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 2,
      });
      drawLandmarks(ctx, landmarks, { color: "#FF0000", lineWidth: 1 });

      const flat = [];
      landmarks.forEach((lm) => flat.push(lm.x, lm.y, lm.z));
      canvasRef.current.landmarks = flat;
    } else {
      canvasRef.current.landmarks = null;
    }

    ctx.restore();
  };

  const captureFrame = async () => {
    if (!canvasRef.current.landmarks) {
      setMsg("No hand detected!");
      return;
    }
    if (!label) {
      setMsg("Label missing!");
      return;
    }

    try {
      await captureHandSign(userId, canvasRef.current.landmarks, label);
      setSamples((prev) => prev + 1);
      setMsg(`Captured for "${label}" | Total samples: ${samples + 1}`);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error capturing landmarks");
    }
  };

  const runHands = async () => {
    if (!hands || !webcamRef.current) return;
    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;

    await hands.send({ image: video });
    requestAnimationFrame(runHands);
  };

  return (
    <div className="recorder-container">
      <h3 className="recorder-title">Record New Hand Sign</h3>

      <div className="recorder-controls">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter label"
          className="recorder-input"
        />
        <button onClick={captureFrame} className="recorder-button">
          Capture
        </button>
      </div>

      <div className="webcam-wrapper">
        <Webcam ref={webcamRef} mirrored />
        <canvas ref={canvasRef} />
      </div>

      <button
        onClick={runHands}
        className="recorder-button recorder-secondary-btn"
      >
        Start Detection
      </button>

      {msg && <p className="recorder-status">{msg}</p>}
    </div>
  );
}
