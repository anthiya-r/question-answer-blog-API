import React from "react";
import { useNavigate } from "react-router-dom";
import CreateForm from "../components/CreateForm";
import { MdQuestionAnswer } from "@react-icons/all-files/md/MdQuestionAnswer";

function CreateQuestionpage() {
  const navigate = useNavigate();
  return (
    <div className="lg:flex lg:flex-col lg:justify-center lg:items-center">
      <div className="p-6 lg:w-[60%]">
        <p className="text-[#9C3940] font-bold text-2xl text-center pb-5 flex items-center justify-center">
          Let's create question <MdQuestionAnswer className="w-[15%]" />
        </p>

        <CreateForm />
        <div className="form-actions flex p-3 gap-5">
          <button
            type="submit"
            className="bg-[#9C3940] text-[#F9E4D0] p-1 rounded-md"
          >
            Create question
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

export default CreateQuestionpage;
