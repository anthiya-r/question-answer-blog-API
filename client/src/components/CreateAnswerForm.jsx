import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function CreateAnswerForm({ updateAnswers }) {
  const [answer, setAnswer] = useState("");
  const params = useParams();

  const addAnswer = async () => {
    try {
      await axios.post(
        `http://localhost:4001/quora/questions/${params.questionId}/answers`,
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
    <div className="add-answer w-[100%] pt-3 flex lg:w-[50%] ">
      <label htmlFor="add-answer w-[79%] ">
        <input
          className="w-[100%] border rounded-full p-1 placeholder:p-2"
          type="text"
          id="add-answer"
          placeholder="Enter your answer..."
          onChange={(e) => setAnswer(e.target.value)}
          value={answer}
          required
        />
      </label>
      <button
        className="w-[30%] bg-[#9C3940] text-[#F9E4D0] rounded-full"
        onClick={() => addAnswer()}
      >
        Add
      </button>
    </div>
  );
}

export default CreateAnswerForm;
