import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateForm() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const createQuestion = async () => {
    try {
      await axios.post("http://localhost:4000/quora/questions", {
        topic,
        description,
        category,
      });
      navigate("/");
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createQuestion();
  };

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <div className="input-container">
        <label htmlFor="question-topic">
          Question Topic
          <input
            type="text"
            id="question-topic"
            placeholder="Enter question topic"
            onChange={(event) => setTopic(event.target.value)}
            value={topic}
            required
          />
        </label>
      </div>
      <div className="input-container">
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Enter description here"
            onChange={(event) => setDescription(event.target.value)}
            value={description}
            rows={4}
            cols={30}
            required
          />
        </label>
      </div>
      <div className="input-container">
        <label htmlFor="category">
          Category
          <select
            id="category"
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
            <option value="">-- Select a category --</option>
            <option value="Software">Software</option>
            <option value="Science">Science</option>
            <option value="Travel">Travel</option>
            <option value="Etc">Etc.</option>
          </select>
        </label>
      </div>
      <div className="form-actions">
        <button type="submit">Create</button>
      </div>
    </form>
  );
}

export default CreateForm;
