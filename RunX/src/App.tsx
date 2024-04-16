import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
// import Ranking from "./pages/Ranking";

const App = () => {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Ranking />} /> */}
        <Route path="/Login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
