import React from "react";
import { useNavigate } from "react-router-dom";
import EditForm from "../components/EditForm";
import { FaEdit } from "@react-icons/all-files/fa/FaEdit";

function EditQuestionpage() {
  const navigate = useNavigate();
  return (
    <div className="lg:flex lg:flex-col lg:justify-center lg:items-center">
      <div className="p-6 lg:w-[60%]">
        <h1 className="text-[#9C3940] font-bold text-2xl text-center pb-5 flex items-center justify-center">
          Edit Question Page <FaEdit className="w-[15%]" />
        </h1>

        <EditForm />
        <div className="form-actions flex p-3 gap-5 ">
          <button
            type="submit"
            className="bg-[#9C3940] text-[#F9E4D0] p-1 rounded-md"
          >
            Update
          </button>
          <button
            className="bg-[#9C3940] text-[#F9E4D0] p-1 rounded-md"
            onClick={() => {
              navigate("/");
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditQuestionpage;
