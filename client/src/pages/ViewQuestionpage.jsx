import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CreateAnswerForm from "../components/CreateAnswerForm";
import { AiTwotoneLike } from "@react-icons/all-files/ai/AiTwotoneLike";
import { AiTwotoneDislike } from "@react-icons/all-files/ai/AiTwotoneDislike";

function ViewQuestionPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState({});
  const params = useParams();

  const getQuestionById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4001/quora/questions/${params.questionId}`
      );
      setQuestion(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getQuestionById();
  }, [question]);

  const likeAction = async (answerId) => {
    try {
      const response = await axios.put(
        `http://localhost:4001/quora/questions/${params.questionId}/answers/${answerId}/like-dislike`,
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
        `http://localhost:4001/quora/questions/${params.questionId}/answers/${answerId}/like-dislike`,
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
        `http://localhost:4001/quora/questions/${params.questionId}/answers/${answerId}`
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
    <div className="view-question-wrapper p-8 text-[#9C3940] lg:flex lg:flex-col lg:justify-center lg:items-center">
      <h1 className="text-center text-3xl font-bold pb-5">
        View Question Page
      </h1>
      <div className="question-container border border-[#FBE7E0] rounded-md drop-shadow-md w-[100%] lg:w-[50%]">
        <h1 className="bg-[#FBE7E0] px-3 py-1 font-bold text-lg pt-5">
          Question:{" "}
          <span className="font-light bg-[#FBE7E0] text-[#d48389] text-base">
            {" "}
            {question.topic}
          </span>
        </h1>
        <p className="bg-[#FBE7E0] px-3 py-1 font-bold text-lg">
          Description:{" "}
          <span className="font-light bg-[#FBE7E0] text-[#d48389] text-base">
            {question.description}
          </span>
        </p>
        <h3 className="bg-[#FBE7E0] px-3 py-1 font-bold text-lg">
          Category:{" "}
          <span className="font-light bg-[#FBE7E0] text-[#d48389] text-base">
            {question.category}
          </span>
        </h3>

        <p className="bg-[#FBE7E0] px-3 py-1 font-bold text-lg">
          Created date:{" "}
          <span className="font-light bg-[#FBE7E0] text-[#d48389] text-base">
            {question.created_at}
          </span>
        </p>
      </div>
      <div className="answer lg:flex lg:flex-col lg:justify-center lg:items-center">
        <CreateAnswerForm />

        <div className="answer-list mt-6 p-3 bg-[#F9E4D0] border border-[#FBE7E0] lg:w-[50%]">
          {question.answers !== undefined
            ? question.answers.map((answer) => (
                <div key={answer._id} className="bg-[#F9E4D0]">
                  <div className="bg-[#F9E4D0] font-bold">
                    Answer:{" "}
                    <p className="bg-[#F9E4D0] font-light">{answer.answer}</p>
                  </div>

                  <div className="flex mt-8 bg-[#F9E4D0] items-center justify-center">
                    <button onClick={() => dislikeAction(answer._id)}>
                      <AiTwotoneDislike className="bg-[#F9E4D0] " />
                    </button>
                    <div className="bg-[#F9E4D0] text-center font-bold text-lg">
                      Likes: {answer.likes}
                    </div>
                    <button onClick={() => likeAction(answer._id)}>
                      <AiTwotoneLike className="bg-[#F9E4D0] " />
                    </button>
                  </div>
                  <div className="flex mt-8 gap-10 bg-[#F9E4D0] pb-2">
                    <button
                      className="w-[50%] bg-[#9C3940] text-[#F9E4D0] rounded-md"
                      onClick={() => navigate("/")}
                    >
                      Back to home
                    </button>
                    <button
                      className="w-[50%] bg-[#9C3940] text-[#F9E4D0] rounded-md"
                      onClick={() => handleDeleteAnswer(answer._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            : 0}
        </div>
      </div>
    </div>
  );
}

export default ViewQuestionPage;
