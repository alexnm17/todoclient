import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Tasks from './components/Tasks';
import Projects from './components/Projects';
import Login from './components/Login';
import AdminTasks from './components/AdminTasks';
import AdminProjects from './components/AdminProjects';
import Users from './components/Users';



function Routing() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route path="/Tasks" element={<Tasks/>} />
          <Route path="/AdminTasks" element={<AdminTasks/>} />
          <Route path="/Projects" element={<Projects/>} />
          <Route path="/AdminProjects" element={<AdminProjects/>} />
          <Route path="/Users" element={<Users/>} />
        </Routes>
      </div>
    </Router>

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
