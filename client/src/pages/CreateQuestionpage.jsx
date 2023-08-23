import React from "react";
import { useNavigate } from "react-router-dom";
import CreateForm from "../components/CreateForm";

function CreateQuestionpage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Create Question Form</h1>
      <CreateForm />
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default CreateQuestionpage;
