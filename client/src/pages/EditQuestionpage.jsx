import React from "react";
import { useNavigate } from "react-router-dom";
import EditForm from "../components/EditForm";

function EditQuestionpage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Edit Question Page</h1>
      <EditForm />
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

export default EditQuestionpage;
