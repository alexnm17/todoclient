import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Tasks from './components/Tasks';
import Projects from './components/Projects';
import App from './App'


function Routing() {
  return (
    <div align="center">
      <Router>
        <Routes>
          <Route exact path="/" element={<App/>} />
          <Route exact path="/proyects" element={<Projects/>} />
        </Routes>
      </Router>
    </div>

  )
}

ReactDOM.render(
  <React.StrictMode>
    <Routing /> 
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
