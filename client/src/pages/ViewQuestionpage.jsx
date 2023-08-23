import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CreateAnswerForm from "../components/CreateAnswerForm";

function ViewQuestionPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState({});
  const params = useParams();

  const getQuestionById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/quora/questions/${params.questionId}`
      );
      setQuestion(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getQuestionById();
  }, []);

  const likeAction = async (answerId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/quora/questions/${params.questionId}/answers/${answerId}/like-dislike`,
        { action: "like" }
      );
      if (response.status === 201) {
        const updatedLikes = response.data.data;
        setQuestion((prevQuestion) => {
          const updatedAnswers = prevQuestion.answers.map((answer) => {
            if (answer._id === answerId) {
              return { ...answer, likes: updatedLikes };
            }
            return answer;
          });
          return { ...prevQuestion, answers: updatedAnswers };
        });
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const dislikeAction = async (answerId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/quora/questions/${params.questionId}/answers/${answerId}/like-dislike`,
        { action: "dislike" }
      );
      if (response.status === 201) {
        const updatedLikes = response.data.data;
        setQuestion((prevQuestion) => {
          const updatedAnswers = prevQuestion.answers.map((answer) => {
            if (answer._id === answerId) {
              return { ...answer, likes: updatedLikes };
            }
            return answer;
          });
          return { ...prevQuestion, answers: updatedAnswers };
        });
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/quora/questions/${params.questionId}/answers/${answerId}`
      );
      if (response.status === 200) {
        setQuestion((prevQuestion) => ({
          ...prevQuestion,
          answers: prevQuestion.answers.filter(
            (answer) => answer._id !== answerId
          ),
        }));
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <div className="view-question-wrapper">
      <h1>View Question By ID</h1>
      <div className="question-container">
        <h2>Question: {question.topic}</h2>
        <p>Description: {question.description}</p>
        <p>Likes: {question.likes}</p>
        <h3>Category: {question.category}</h3>
        <p>Created date: {question.created_at}</p>
      </div>
      <div className="answer">
        <CreateAnswerForm />
        <h4>Answers List</h4>
        <div>
          {question.answers !== undefined
            ? question.answers.map((answer) => (
                <div key={answer._id}>
                  <div>{answer.answer}</div>
                  <div>Likes: {answer.likes}</div>
                  <div>
                    <button onClick={() => likeAction(answer._id)}>Like</button>
                    <button onClick={() => dislikeAction(answer._id)}>
                      Dislike
                    </button>
                  </div>
                  <button onClick={() => handleDeleteAnswer(answer._id)}>
                    Delete
                  </button>
                </div>
              ))
            : 0}
        </div>
      </div>
      <button onClick={() => navigate("/")}>Back to home</button>
    </div>
  );
}

export default ViewQuestionPage;
