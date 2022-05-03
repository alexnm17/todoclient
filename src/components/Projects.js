import React, { useState, useEffect } from "react";
import { Row, Col,Modal, ModalBody, FormGroup, ModalFooter, ModalHeader } from 'reactstrap';
import { Paper,Button } from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css'
import {deleteProject, getProjects,getProject, addProject, getTasks, updateProject, getUser,addNotification,getSession} from "../services/apicalls.js"
import { getDateInStrFormat } from "../services/utils.js";
import TopBar from './bars/TopBar';
import * as IoIcons from 'react-icons/io';
import * as FcIcons from 'react-icons/fc';
import * as AiIcons from 'react-icons/ai';

export default function Projects(){
    document.body.style.backgroundColor = "#66ff00";
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState(null);
    const [usertasks, setUserTasks] = useState(null);
    const [taskstoadd, setTasksToAdd] = useState([""]);
    const [projecttasks, setProjectTasks] = useState([""]);
    const [sharedTo, setSharedTo] = useState([""]);

    const [projectname, setProjectname] = useState("");
    const [projectopen, setProjectOpen] = useState(null);
    
    const onProjectnameChange = e => setProjectname(e.target.value);

    const [modalCreate, setModalCreate] = useState(false);
    const [modalProject, setModalProject] = useState(false);
    const [modalAddTask, setModalAddTask] = useState(false);
    const [modalShared, setModalShared] = useState(false);
    const [modalShareTo, setModalShareTo] = useState(false);

    const getAllProjects = async () => {
        const session = await getSession(sessionStorage.getItem('sessionToken'));
        const email = session.email;
        const user = await getUser(email);
        setUser(user);
        var projectsByEmail = [];
        const projects = await getProjects()
            for(var i=0; i<projects.length; i++) {
                if(projects[i].email === user.email){
                    projectsByEmail.push(projects[i]);
                }
            }
            setProjects(projectsByEmail);
    }

    const getUserTasks = async() => {
        const session = await getSession(sessionStorage.getItem('sessionToken'));
        const email = session.email;
        const user = await getUser(email);
        var tasksByEmail = [];
        const tasks = await getTasks()
            for(var i=0; i<tasks.length; i++) {
                if(tasks[i].email === user.email){
                    tasksByEmail.push(tasks[i]);
                }
            }
            setUserTasks(tasksByEmail);
    }

    useEffect(() =>{
        getAllProjects();
        getUserTasks();
      },[]);

    const createProject = async () => {
        try{
            const email = user.email;
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

    const handleUnShare = async (email)=>{
        const project = projectopen;
        for(var i = 0; i < project.sharedTo.length; i++) {
            if(project.sharedTo[i]===email){
                project.sharedTo.splice(i, 1);
            }     
        }
        const sharedTo = project.sharedTo;
        const data = {sharedTo};
        await updateProject(project._id, data);
        getAllProjects();
        setModalShared(false);
        setModalShared(true);   
    }

    const handleNotifySharing = async(email)=>{
        try{
            const sender = user.email;
            const receiver = email;
            const type = "Share";
            const project_id = projectopen._id;
            const project_name = projectopen.projectname;
            
            const data = {sender, receiver, type, project_id, project_name};
            console.log(data);
            await addNotification(data);
            setModalShareTo(false);
        }catch(error) {
            alert(error.response.data.err.message);
        }
        
    }

    const handleAddTask= async (task_id)=>{
        var project = projectopen;
        project.tasks.push(task_id);
        await updateProject(projectopen._id, project);
        getAllProjects();
        setModalAddTask(false);
        showModalProject(project);
        
    }

    const showModalProject = async (project) => {
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
        setProjectname(projectopen.projectname);
        var tasksids = projectopen.tasks;
        var noRepeatedTasks = [];

        for(var i = 0; i < usertasks.length; i++) {
            if(!tasksids.includes(usertasks[i]._id))
                noRepeatedTasks.push(usertasks[i]);
        }
        setTasksToAdd(noRepeatedTasks);
        setModalAddTask(true);
        setModalProject(false);
       
    }

    const showModalShared = async (project_id) => {
        const project = await getProject(project_id);
        setProjectOpen(project);
        const shared_emails= project.sharedTo;
        const users_shared = [];
        for(var i = 0; i < shared_emails.length; i++) {
            users_shared.push(await getUser(shared_emails[i]));
        }
        setSharedTo(users_shared);
        setModalShared(true);
       
    }
    const showModalShareTo = async (project_id) => {
        const project = await getProject(project_id);        
        setProjectOpen(project);
        const friends_emails= user.friends;
        const shared_emails = project.sharedTo;
        const usersToShare = [];
        for(var i = 0; i < friends_emails.length; i++) {
            if(!contains(shared_emails, friends_emails[i]))
                usersToShare.push(await getUser(friends_emails[i]));
        }
        setSharedTo(usersToShare);
        setModalShareTo(true);
       
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


    return projects === null || usertasks === null||user===null?(
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
                                    {project.projectname}
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
                                    onClick={() => showModalShared(project._id)}
                                    color="primary"
                                >
                                    <IoIcons.IoMdPeople/>
                                </Button>
                                </div> 
                                <div>
                                <Button
                                    onClick={() => showModalShareTo(project._id)}
                                    color="primary"
                                >
                                    <FcIcons.FcShare/>
                                </Button>
                                </div> 
                                <div>
                                <Button
                                    onClick={() => handleDelete(project._id)}
                                    color="secondary"
                                >
                                    🗑️ 
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
                                    <td><button className="secondary" style={{ marginRight: 10 }} onClick={() => handleDeleteTask(task._id)}>Delete Task</button></td>
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
                        <div><h3>{projectname}</h3></div>
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
                                    <td><button className="primary" style={{ marginRight: 10 }} onClick={() => handleAddTask(task._id)}>Add Task</button></td>
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
                <Modal isOpen={modalShared}>
                    <ModalHeader>
                        <div><h3>Friends Shared</h3></div>
                    </ModalHeader>

                    <ModalBody>
                    <table className="table" style={{ marginTop: 15, marginLeft: 15 }}>
                        <thead>
                            <tr>
                                <th>UserName</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sharedTo.map(user =>
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td><button className="primary" style={{ marginRight: 10 }} onClick={() => handleUnShare(user.email)}>X</button></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => setModalShared(false)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={modalShareTo}>
                    <ModalHeader>
                        <div><h3>Share Project To</h3></div>
                    </ModalHeader>

                    <ModalBody>
                    <table className="table" style={{ marginTop: 15, marginLeft: 15 }}>
                        <thead>
                            <tr>
                                <th>UserName</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sharedTo.map(user =>
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td><Button color="primary" style={{ marginRight: 10 }} onClick={() => handleNotifySharing(user.email)}><AiIcons.AiOutlineShareAlt/></Button></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => setModalShareTo(false)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>    
    );
}


