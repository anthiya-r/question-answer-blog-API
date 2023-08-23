import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function CreateAnswerForm({ updateAnswers }) {
  const [answer, setAnswer] = useState("");
  const params = useParams();

  const addAnswer = async () => {
    try {
      await axios.post(
        `http://localhost:4000/quora/questions/${params.questionId}/answers`,
        {
          answer,
        }
      );

      setAnswer("");
    } catch (error) {
      console.error("Error adding answer:", error);
    }
  };

  return (
    <div className="add-answer">
      <label htmlFor="add-answer">
        <input
          type="text"
          id="add-answer"
          placeholder="Enter your answer"
          onChange={(e) => setAnswer(e.target.value)}
          value={answer}
          required
        />
        <button onClick={() => addAnswer()}>Add Answer</button>
      </label>
    </div>
  );
}

export default CreateAnswerForm;
