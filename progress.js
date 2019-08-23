import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import "./styles.css";
const Bar = styled.div`
  width: 100%;
  height: 20px;
  border-radius: 18px;
  background: linear-gradient(
    to right,
    black ${props => props.progress}%,
    lightgrey 0%
  );
`;

let MAX = 100;
function App() {
  const [progress, set] = React.useState(0);
  React.useLayoutEffect(() => {
    let id = window.requestAnimationFrame(() => {
      set(progress + 1);
    });
    if (progress === MAX) {
      return window.cancelAnimationFrame(id);
    }
  }, [progress]);
  return (
    <div className="App">
      {progress === MAX && <button onClick={() => set(0)}>Reset</button>}
      <h2>Update {progress === MAX ? "Complete ✔️" : `${progress}%`}</h2>
      <Bar progress={progress} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
