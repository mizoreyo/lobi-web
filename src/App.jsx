import Nav from "./components/Nav";
import Explore from "./components/Explore";

import "./App.css";

function App() {
  return (
    <div>
      <Nav></Nav>
      <div className="main">
        <Explore />
      </div>
    </div>
  );
}

export default App;
