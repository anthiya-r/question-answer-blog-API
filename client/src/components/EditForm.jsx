import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function EditForm() {
  const navigate = useNavigate();
  const params = useParams();

  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [likes, setLikes] = useState(0);
  const [createdAt, setCreatedAt] = useState("");

  const getCurrentQuestion = async () => {
    const result = await axios.get(
      `http://localhost:4000/quora/questions/${params.questionId}`
    );
    setTopic(result.data.data.topic);
    setDescription(result.data.data.description);
    setCategory(result.data.data.category);
    setLikes(result.data.data.likes);
    setCreatedAt(result.data.data.created_at);
  };

  const updateQuestion = async () => {
    await axios.put(
      `http://localhost:4000/quora/questions/${params.questionId}`,
      {
        topic,
        description,
        category,
        likes,
        created_at: createdAt,
      }
    );
    navigate("/");
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    updateQuestion();
  };

  useEffect(() => {
    getCurrentQuestion();
  }, []);

  return (
    <form className="edit-form" onSubmit={handleUpdate}>
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
        <button type="submit">Update</button>
      </div>
    </form>
  );
}

export default EditForm;
