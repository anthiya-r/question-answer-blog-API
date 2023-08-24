import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiTwotoneLike } from "@react-icons/all-files/ai/AiTwotoneLike";
import { AiTwotoneDislike } from "@react-icons/all-files/ai/AiTwotoneDislike";
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
    <div className="p-10 w-[100%] text-[#9C3940]">
      <div className="homepage-wrapper">
        <h1 className=" text-5xl font-bold text-center py-4">Q & A Blogs</h1>
      </div>
      <div className="header-wrapper flex flex-col justify-between items-center gap-4 py-4 w-[100%] lg:flex lg:flex-row lg:items-end">
        <div className="search-container">
          <div className="serch-box">
            <label
              htmlFor="search-question "
              className="text-xl font-bold flex flex-col gap-2"
            >
              Search Questions{" "}
              <input
                className="placeholder:font-light placeholder:text-slate-400 placeholder:text-sm border border-[#9C3940] rounded-md px-2 pb-1"
                type="text"
                placeholder="Search by topic"
                value={searchText}
                onChange={handleSearchText}
              />
            </label>
          </div>
        </div>
        <div className="question-category">
          <label
            htmlFor="category"
            className="text-xl font-bold flex flex-col gap-2"
          >
            Category{" "}
            <select
              className="text-sm text-slate-400 font-light border border-[#9C3940] rounded-md p-1 lg:p-[1.6%]"
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
        <button
          className="bg-[#9C3940] text-[#F9E4D0] p-2 m-2 rounded-md hover:opacity-75 lg:m-0 lg:p-1.5"
          onClick={() => {
            navigate("/question/create");
          }}
        >
          Add Your Question Here!
        </button>
      </div>
      <div className="question-list ">
        <div className=" ">
          {questions.map((question, index) => {
            return (
              <div className="question mt-6 " key={question._id}>
                <div className="lg:flex lg:flex-col lg:justify-center lg:items-center">
                  <div className="question-detail border border-[#FBE7E0] rounded-md drop-shadow-md w-[100%] lg:w-[50%]">
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

                    <div className="vote-container bg-[#FBE7E0] flex py-4">
                      <button onClick={() => likeAction(question._id)}>
                        <AiTwotoneLike className="bg-[#FBE7E0] hover:opacity-75" />
                      </button>
                      <p className="bg-[#FBE7E0] px-3 py-1 font-bold text-lg text-center">
                        Likes:{" "}
                        {question.likes !== undefined ? question.likes : 0}
                      </p>
                      <button onClick={() => dislikeAction(question._id)}>
                        <AiTwotoneDislike className="bg-[#FBE7E0] hover:opacity-75" />
                      </button>
                    </div>
                  </div>

                  <div className="question-action text-center flex justify-around p-4 w-[100%] lg:w-[40%]">
                    <button
                      className="bg-[#9C3940] text-[#F9E4D0] rounded-md w-[25%] hover:opacity-75"
                      onClick={() => {
                        navigate(`/question/view/${question._id}`);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="bg-[#9C3940] text-[#F9E4D0] rounded-md w-[25%] hover:opacity-75"
                      onClick={() => {
                        navigate(`/question/edit/${question._id}`);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-[#9C3940] text-[#F9E4D0] rounded-md w-[25%] hover:opacity-75"
                      onClick={() => deleteQuestion(question._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pagination flex text-center justify-evenly pt-4r">
        <button
          className="prev-btn text-[#9C3940] font-bold hover:opacity-75"
          onClick={handlePrevPage}
        >
          Previous
        </button>
        <div className="current-page font-bold p-1">
          {" "}
          {currentPage} / {totalPages}
        </div>
        <button
          className="next-btn text-[#9C3940] font-bold hover:opacity-75"
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
      {isError ? (
        <h1 className="text-center font-bold text-3xl mt-10">
          Request failded
        </h1>
      ) : null}
      {isLoading ? (
        <h1 className="text-center font-bold text-3xl mt-10">Loading...</h1>
      ) : null}
    </div>
  );
}

export default Homepage;
