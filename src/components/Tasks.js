import React, { useState, useEffect } from "react";
import { Row, Col, Modal, ModalBody, FormGroup, ModalFooter, ModalHeader } from 'reactstrap';
import { Paper, Button} from "@material-ui/core";
import { Checkbox} from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css'
import TopBar from './bars/TopBar';
import {getTasks, deleteTask, addTask, updateTask,getSession, getUser} from "../services/apicalls.js"



export default function Tasks(){
    document.body.style.backgroundColor= "#00f7ff";
    const [tasks, setTasks] = useState(null);
    const [user, setUser] = useState(null);
    const [taskname, setTaskname] = useState("");
    const [priority, setPriority] = useState("Low");
    const [deadline, setDeadline] = useState("");
    const [taskid, setTaskid] = useState("");
    const [onlyuncompleted, setOnlyUncompleted] = useState(false);
    const [infotext, setInfoText] = useState("All");


    const onTasknameChange = e => setTaskname(e.target.value);
    const onPriorityChange = e => setPriority(e.target.value);
    const onDeadlineChange = e => setDeadline(e.target.value);

    const [modalCreate, setModalCreate] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    
    const getAllTasks =async() => {
        const session = await getSession(sessionStorage.getItem('sessionToken'));
        const email = session.email;
        const user = await getUser(email);
        setUser(user);
        var tasksByEmail = [];
        const tasks = await getTasks()
        for(var i=0; i<tasks.length; i++) {
            if(tasks[i].email === user.email){
                if(onlyuncompleted){
                    if(!tasks[i].completed){
                        tasksByEmail.push(tasks[i]);
                    }
                }else{
                    tasksByEmail.push(tasks[i]);
                }
            }
        }
        setTasks(tasksByEmail);
    }
    
    useEffect(() =>{ 
        getAllTasks();
      },[]);

    const createTask = async () => {
        try{
            const email = user.email;
            const data = {taskname, priority, deadline, email}
            await addTask(data);
            getAllTasks();
            setModalCreate(false);
        }catch (error) {
            alert(error);
        }
            
    };
    
    const handleUpdate= async () => {
        try{
            const data = {taskname, priority, deadline}
            await updateTask(taskid,data);
            getAllTasks();
            setModalUpdate(false);

        }catch (error) {
            console.log(error);
        }
    }

    const completeTask = async (currentTask) => {
        try {
            const taskList = tasks;
            const index = taskList.findIndex((task) => task._id === currentTask);
            taskList[index] = { ...taskList[index] };
            taskList[index].completed = !taskList[index].completed;
            
            await updateTask(currentTask, {
                completed: taskList[index].completed,
            });
            getAllTasks();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (task_id) =>{
        try {
            await deleteTask(task_id);
            getAllTasks();
            
        } catch (error) {
            console.log(error);
        }
    };

    const showModalUpdate = (task) => {
        setTaskname(task.taskname);
        setPriority(task.priority);
        setDeadline(task.deadline);
        setTaskid(task._id);
        setModalUpdate(true);
    }

    const switchView = () => {
        const bool = !onlyuncompleted;
        if(!bool){
            setInfoText("Uncompleted")
        }else{
            setInfoText("All")
        }
        setOnlyUncompleted(bool);
        getAllTasks();

    }
        
    return tasks === null || user===null? (
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
                    <div className="heading flex">{infotext + " Tasks List"}</div>
                        <div className="flex">
                        <Button
                            style={{ height: "40px"}}
                            color="primary"
                            variant="outlined"
                            type="submit"
                            onClick={(() =>setModalCreate(true))}
                        >
                            Add task
                        </Button>
                        <Button
                            style={{ height: "40px"}}
                            color="primary"
                            variant="outlined"
                            type="submit"
                            onClick={(() =>switchView())}
                        >
                            Switch View
                        </Button>
                        </div>


                    <Modal isOpen={modalCreate}>
                        <ModalHeader>
                            <div><h3>Add Task</h3></div>
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <label>Name:</label>
                                <input className="form-control" placeholder="Name" type="text" name="taskname" onChange={onTasknameChange} value={taskname}></input>
                            </FormGroup>
                            <FormGroup>
                                <label>Priority:</label>
                                <select name="priority" onChange={onPriorityChange} value={priority} className="form-control">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <label>Deadline:</label>
                                <input className="form-control" type="date" name="deadline" onChange={onDeadlineChange} value={deadline}></input>
                            </FormGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="primary" onClick={createTask}>Accept</Button>
                            <Button color="secondary" onClick={() =>setModalCreate(false)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>


                    
                    <div>
                        {tasks.map((task) => (
                            <Paper
                                key={task._id}
                                className="flex task_container"
                            >
                                <Checkbox
                                    checked={task.completed}
                                    onClick={() => completeTask(task._id)}
                                    color="primary"
                                />
                                <div
                                    className={
                                        task.completed
                                            ? "task line_through"
                                            : "task"
                                    }
                                >
                                    {task.taskname}
                                </div>
                                <div >
                                <Button
                                    onClick={() => showModalUpdate(task)}
                                    color="primary"
                                    
                                >
                                    ✏️
                                </Button>
                                </div>
                                <div>
                                <Button
                                    onClick={() =>handleDelete(task._id)}
                                    color="secondary"
                                    margin="60 px"
                                >
                                    🗑️
                                </Button>
                                </div>
                               
                            </Paper>
                        ))}
                    </div>
                    
                </Paper>
                <Modal isOpen={modalUpdate}>
                        <ModalHeader>
                            <div><h3>Update Task</h3></div>
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <label>Name:</label>
                                <input className="form-control" placeholder="Name" type="text" name="taskname" onChange={onTasknameChange} value={taskname}></input>
                            </FormGroup>
                            <FormGroup>
                                <label>Priority:</label>
                                <select name="priority" onChange={onPriorityChange} value={priority} className="form-control">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <label>Deadline:</label>
                                <input className="form-control" type="date" name="deadline" onChange={onDeadlineChange} value={deadline}></input>
                            </FormGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button color="primary" onClick={() => handleUpdate()}>Accept</Button>
                            <Button color="secondary" onClick={() => setModalUpdate(false)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
            </div>
            </div>    
            
            
    );
}
