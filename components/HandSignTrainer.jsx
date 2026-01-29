import React, { useState } from "react";
import { trainHandSignModel } from "../services/api.js";
import "./HandSignTrainer.css";

export default function HandSignTrainer({ userId }) {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const train = async () => {
    if (!userId) {
      setMsg("Please enter a User ID first");
      return;
    }

    setLoading(true);
    setMsg("Training in progress... This may take a few seconds.");

    try {
      const res = await trainHandSignModel(userId);
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error during training");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trainer-container">
      <h3 className="trainer-title">Train Hand Sign Model</h3>

      <button
        onClick={train}
        className={`trainer-button ${loading ? "trainer-loading" : ""}`}
        disabled={loading}
      >
        {loading ? "Training..." : "Train Model"}
      </button>

      {msg && <p className="trainer-status">{msg}</p>}
    </div>
  );
}
