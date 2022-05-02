import React, { useState, useEffect } from "react";
import { Row, Col, Modal, ModalBody, FormGroup, ModalFooter, ModalHeader } from 'reactstrap';
import { Paper,Button } from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css'
import {deleteProject, getProjects, addProject, getTasks, updateProject} from "../services/apicalls.js"
import { getDateInStrFormat } from "../services/utils.js";
import TopBar from "./bars/TopBar"



export default function AdminProjects(){
    document.body.style.backgroundColor = "#66ff00";

    const [projects, setProjects] = useState(null);
    const [usertasks, setUserTasks] = useState([""]);
    const [taskstoadd, setTasksToAdd] = useState([""]);
    const [projecttasks, setProjectTasks] = useState([""]);

    const [projectname, setProjectname] = useState("");
    const [projectopen, setProjectOpen] = useState(null);
    const [email, setEmail] = useState("");
    
    const onProjectnameChange = e => setProjectname(e.target.value);
    const onEmailChange = e=> setEmail(e.target.value);

    const [modalCreate, setModalCreate] = useState(false);
    const [modalProject, setModalProject] = useState(false);
    const [modalAddTask, setModalAddTask] = useState(false);

    const getAllProjects = () => {
        getProjects().then((projects) => {
            setProjects(projects);
        });
    }

    const getUserTasks = (email) => {
        var tasksByEmail = [];
        getTasks().then((tasks) => {
            for(var i=0; i<tasks.length; i++) {
                if(tasks[i].email === email){
                    tasksByEmail.push(tasks[i]);
                }
            }
            setUserTasks(tasksByEmail);
        }); 
    }

    useEffect(() =>{
        getAllProjects();
      },[]);

    const createProject = async () => {
        try{
            const data = {projectname, email};
            console.log(data);
            await addProject(data);
            getAllProjects();
            setModalCreate(false);
        }catch (error) {
            alert(error);
        }
            
    };

    const handleDelete = async (project_id) => {
        try {
            await deleteProject(project_id);
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

    const showModalProject =async  (project) => {
        getUserTasks(project.email);
        console.log(usertasks[0]);
        if(usertasks === [''])
            console.log(usertasks);
        setProjectname(project.projectname);
        setProjectOpen(project);
        var tasksids = project.tasks;
        var projectTasks = [];
        for(var i = 0; i < tasksids.length; i++) {
            for(var j = 0; j < usertasks.length; j++){
                if(tasksids[i] === usertasks[j]._id)
                    projectTasks.push(usertasks[j]);
            }
        }
        setProjectTasks(projectTasks);
        setModalProject(true);
    }

    const showModalAddTask = () => {
        console.log(projectopen);
        setProjectname(projectopen.projectname);
        var tasksids = projectopen.tasks;
        var noRepeatedTasks = [];

        for(var i = 0; i < usertasks.length; i++) {
            if(!tasksids.includes(usertasks[i]._id))
                noRepeatedTasks.push(usertasks[i]);
        }
        setTasksToAdd(noRepeatedTasks);
        setModalAddTask(true);
       
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
                        <div className="heading">Projects List</div>
                            <div className="flex">
                            <Button
                                style={{ height: "40px" }}
                                color="primary"
                                variant="outlined"
                                type="submit"
                                onClick={() => setModalCreate(true)}
                            >
                                Add project
                            </Button>
                            </div>

                    <Modal isOpen={modalCreate}>
                        <ModalHeader>
                            <div><h3>Add project</h3></div>
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <label>Name:</label>
                                <input className="form-control" placeholder="Name" type="text" name="projectname" onChange={onProjectnameChange} value={projectname}></input>
                            </FormGroup>
                            <FormGroup>
                                <label>Email:</label>
                                <input className="form-control" placeholder="Email" type="text" name="email" onChange={onEmailChange} value={email}></input>
                            </FormGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="primary" onClick={createProject}>Accept</Button>
                            <Button color="secondary" onClick={() => setModalCreate(false)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>


                    
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
                                    info
                                </Button>
                                </div> 
                                <div>
                                <Button
                                    onClick={() => handleDelete(project._id)}
                                    color="secondary"
                                >
                                    delete
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
                            onClick={() => showModalAddTask()}
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


