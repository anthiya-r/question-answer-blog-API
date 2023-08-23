import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import CreateQuestionpage from "./pages/CreateQuestionpage";
import EditQuestionpage from "./pages/EditQuestionpage";
import ViewQuestionpage from "./pages/ViewQuestionpage";
import CreateAnswerpage from "./pages/CreateAnswerpage";
import EditAnswerpage from "./pages/EditAnswerpage";
import ViewAnswerpage from "./pages/ViewAnswerpage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/question/create" element={<CreateQuestionpage />} />
          <Route
            path="/question/edit/:questionId"
            element={<EditQuestionpage />}
          />
          <Route
            path="/question/view/:questionId"
            element={<ViewQuestionpage />}
          />
          <Route path="/answer/create" element={<CreateAnswerpage />} />
          <Route path="/answer/edit/:answerId" element={<EditAnswerpage />} />
          <Route path="/answer/view/:answerId" element={<ViewAnswerpage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
