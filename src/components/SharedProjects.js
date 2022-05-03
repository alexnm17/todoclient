import React, { useState, useEffect } from "react";
import { Row, Col, Modal, ModalBody, FormGroup, ModalFooter, ModalHeader } from 'reactstrap';
import { Paper,Button } from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css'
import {getTask, getProjects, addProject, getTasks, updateProject, getProject} from "../services/apicalls.js"
import { getDateInStrFormat } from "../services/utils.js";
import TopBar from "./bars/TopBar"
import * as RiIcons from 'react-icons/ri';
import * as CgIcons from 'react-icons/cg';


export default function SharedProjects(){
    document.body.style.backgroundColor = "#CD00FF";

    const [projects, setProjects] = useState(null);
    const [usertasks, setUserTasks] = useState([""]);
    const [taskstoadd, setTasksToAdd] = useState([""]);
    const [projecttasks, setProjectTasks] = useState([""]);

    const [projectname, setProjectname] = useState("");
    const [projectopen, setProjectOpen] = useState(null);


    const [modalCreate, setModalCreate] = useState(false);
    const [modalProject, setModalProject] = useState(false);
    const [modalAddTask, setModalAddTask] = useState(false);

    const getAllProjects = async() => {
        const allProjects = await getProjects();
        console.log(allProjects);
        const user_email = sessionStorage.getItem("userEmail");
        const sharedProjects = [];
        for(var i = 0; i < allProjects.length; i++) {
            if(contains(allProjects[i].sharedTo,user_email))
            sharedProjects.push(allProjects[i])
        }
        console.log(sharedProjects);
        setProjects(sharedProjects);  
    }

    const getUserTasks = (email) => {
        var tasksByEmail = [];
        getTasks().then((tasks) => {
            for(var i=0; i<tasks.length; i++) {
                if(tasks[i].email === email){
                    tasksByEmail.push(tasks[i]);
                }
            }
            console.log(tasksByEmail)
            setUserTasks(tasksByEmail);
        }); 
    }

    useEffect(() =>{
        getAllProjects();
        getUserTasks(sessionStorage.getItem("userEmail"));
      },[]);

    const handleUnShare = async (project_id) => {
        try {
            const user_email = sessionStorage.getItem("userEmail");
            const project = await getProject(project_id);
            const sharedTo = project.sharedTo;
            for(var i = 0; i <sharedTo.length; i++) {
                if(sharedTo[i]===user_email){
                    sharedTo.splice(i, 1);
                }     
            }
            const data = {sharedTo};
            await updateProject(project_id,data);
            getAllProjects();
            
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteTask = async (task_id)=>{
        var project = projectopen;
        for(var i = 0; i < project.tasks.length; i++) {
            if(project.tasks[i]===task_id){
                project.tasks.splice(i, 1);
            }     
        }
        const tasks = project.tasks;
        console.log(tasks);
        const data = {tasks};
        await updateProject(project._id, data);
        getAllProjects();
        setModalProject(false);
        
    }

    const handleAddTask= async (task_id) =>{
        var project = projectopen;
        project.tasks.push(task_id);
        await updateProject(projectopen._id, project);
        getAllProjects();
        setModalAddTask(false);
        showModalProject(project);
        
    }

    const showModalProject =async(project) => {
        setProjectname(project.projectname);
        setProjectOpen(project);
        var tasksids = project.tasks;
        console.log(tasksids);
        var projectTasks = [];
        var task;
        for(var i = 0; i < tasksids.length; i++) {
            task = await getTask(tasksids[i]);
            projectTasks.push(task);  
        }
        setProjectTasks(projectTasks);
        setModalProject(true);
    }

    const showModalAddTask = (project) => {
        setProjectOpen(project);
        var tasksids = project.tasks;
        var noRepeatedTasks = [];

        for(var i = 0; i < usertasks.length; i++) {
            if(!tasksids.includes(usertasks[i]._id))
                noRepeatedTasks.push(usertasks[i]);
        }
        setTasksToAdd(noRepeatedTasks);
        setModalAddTask(true);
       
    }

    const contains = (array, email) =>{
        var itcontains = false;
        for(var i = 0; i < array.length; i++){
          if(email===array[i]){
            itcontains = true;
          }
        }
        return itcontains;
      }

    return projects === null || usertasks === null?(
        <div>
            <h1>Loading...</h1>
         </div>
        ):(
        <div>
            <TopBar/>
                <Row>
                    <Col>     
                    </Col>
                </Row> 
                <div className="App flex">
                    <Paper elevation={3} className="container">
                    <div className="heading">Projects Shared</div>
                    <div>
                        {projects.map((project) => (
                            <Paper
                                key={project._id}
                                className="flex task_container"
                            >
                                <div className="task">
                                    {project.projectname + " (" + project.email + ")"}
                                </div>
                                <div>
                                <Button
                                    onClick={() => showModalProject(project)}
                                    color="primary"
                                >
                                    🗂️
                                </Button>
                                </div> 
                                <div>
                                <Button
                                    onClick={() => showModalAddTask(project)}
                                    color="primary"
                                >
                                    <CgIcons.CgAddR/>
                                </Button>
                                </div> 
                                <div>
                                <Button
                                    onClick={() => handleUnShare(project._id)}
                                    color="secondary"
                                >
                                    <RiIcons.RiUserUnfollowFill/>
                                </Button>
                                </div>              
                            </Paper>
                        ))}
                    </div>
                    
                </Paper>
                </div>
                <Modal isOpen={modalProject}>
                    <ModalHeader>
                        <div><h3>{projectname}</h3></div>
                    </ModalHeader>

                    <ModalBody>
                        <div className="flex">
                            <Button
                            color="primary"
                            variant="outlined"
                            type="submit"
                            onClick={() => showModalAddTask(projectopen)}
                            >
                        Add task
                        </Button></div>
                    
                    
                    <table className="table" style={{ marginTop: 15, marginLeft: 15 }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Priority</th>
                                <th>Deadline</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {projecttasks.map(task =>
                                <tr key={task._id}>
                                    <td>{task.taskname}</td>
                                    <td>{task.priority}</td>
                                    <td>{getDateInStrFormat(new Date(task.deadline))}</td>
                                    <td><button className="secondary" style={{ marginRight: 10, backgroundColor:"red",borderRadius:"10px",color:"white",border:"none" }} onClick={() => handleDeleteTask(task._id)}>Delete Task</button></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" >Accept</Button>
                        <Button color="secondary" onClick={() => setModalProject(false)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalAddTask}>
                    <ModalHeader>
                        <div><h3>AddTask</h3></div>
                    </ModalHeader>

                    <ModalBody>
                    <table className="table" style={{ marginTop: 15, marginLeft: 15 }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Priority</th>
                                <th>Deadline</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {taskstoadd.map(task =>
                                <tr key={task._id}>
                                    <td>{task.taskname}</td>
                                    <td>{task.priority}</td>
                                    <td>{getDateInStrFormat(new Date(task.deadline))}</td>
                                    <td><button className="primary" style={{ marginRight: 10,backgroundColor:"blue",borderRadius:"10px",color:"white",border:"none"  }} onClick={() => handleAddTask(task._id)}>Add Task</button></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" >Accept</Button>
                        <Button color="secondary" onClick={() => setModalAddTask(false)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>    
    );
}


