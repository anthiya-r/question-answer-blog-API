import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getQuestions = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      const results = await axios.get(
        `http://localhost:4000/quora/questions?topic=${searchText}&category=${category}&page=${currentPage}`
      );
      console.log(results);
      setQuestions(results.data.data);
      setTotalPages(results.data.pagination.totalPages);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  console.log(questions);

  const handleSearchText = (e) => {
    setSearchText(e.target.value);
    console.log(searchText);
    setCurrentPage(1);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    console.log(category);
    setCurrentPage(1);
  };

  useEffect(() => {
    getQuestions();
  }, [searchText, category, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const likeAction = async (questionId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/quora/questions/${questionId}/like-dislike`,
        { action: "like" }
      );
      if (response.status === 200) {
        const updatedLikes = response.data.data;
        setQuestions((prevQuestions) => {
          return prevQuestions.map((question) => {
            if (question._id === questionId) {
              return { ...question, likes: updatedLikes };
            }
            return question;
          });
        });
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const dislikeAction = async (questionId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/quora/questions/${questionId}/like-dislike`,
        { action: "dislike" }
      );
      if (response.status === 200) {
        const updatedLikes = response.data.data;
        setQuestions((prevQuestions) => {
          return prevQuestions.map((question) => {
            if (question._id === questionId) {
              return { ...question, likes: updatedLikes };
            }
            return question;
          });
        });
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/quora/questions/${questionId}`
      );
      if (response.status === 200) {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((question) => question._id !== questionId)
        );
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <div>
      <div className="homepage-wrapper">
        <h1>Quora Website</h1>
        <button
          onClick={() => {
            navigate("/question/create");
          }}
        >
          Add Question
        </button>
      </div>
      <div className="search-container">
        <div className="serch-box">
          <label htmlFor="search-question">
            Search Questions{" "}
            <input
              type="text"
              placeholder="Search by topic"
              value={searchText}
              onChange={handleSearchText}
            />
          </label>
        </div>
      </div>
      <div className="question-category">
        <label htmlFor="category">
          Category{" "}
          <select
            name="category"
            id="category"
            value={category}
            onChange={handleCategory}
          >
            {" "}
            <option value="category">-- Select a category --</option>
            <option value="Software">Software</option>
            <option value="Science">Science</option>
            <option value="Travel">Travel</option>
            <option value="Etc">Etc.</option>
          </select>
        </label>
      </div>
      <div className="question-list">
        {questions.map((question, index) => {
          return (
            <div className="question" key={question._id}>
              <div className="question-detail">
                <h1>Question: {question.topic}</h1>
                <p>Description: {question.description}</p>
                <h3>Category: {question.category}</h3>
                <p>
                  Likes: {question.likes !== undefined ? question.likes : 0}
                </p>
                <div className="vote-container">
                  <button onClick={() => likeAction(question._id)}>Like</button>
                  <button onClick={() => dislikeAction(question._id)}>
                    Dislike
                  </button>
                </div>
                <p>Created date: {question.created_at}</p>
              </div>

              <div className="question-action">
                <button
                  onClick={() => {
                    navigate(`/question/view/${question._id}`);
                  }}
                >
                  View Question
                </button>
                <button
                  onClick={() => {
                    navigate(`/question/edit/${question._id}`);
                  }}
                >
                  Edit Question
                </button>
              </div>
              <button onClick={() => deleteQuestion(question._id)}>
                Delete
              </button>
            </div>
          );
        })}
        {isError ? <h1>Request failded</h1> : null}
        {isLoading ? <h1>Loading...</h1> : null}
      </div>
      <div className="pagination">
        <button className="prev-btn" onClick={handlePrevPage}>
          Previous
        </button>
        <button className="next-btn" onClick={handleNextPage}>
          Next
        </button>
      </div>
      <div className="current-page">
        {" "}
        {currentPage} / {totalPages}
      </div>
    </div>
  );
}

export default Homepage;
