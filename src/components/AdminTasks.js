import React, { useState, useEffect } from "react";
import { Row, Col, Modal, ModalBody, FormGroup, ModalFooter, ModalHeader } from 'reactstrap';
import { Paper, Button} from "@material-ui/core";
import { Checkbox} from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css'
import {getTasks, deleteTask, addTask, updateTask} from "../services/apicalls.js"
import { getDateForDeadline, getDateForDeadline2 } from "../services/utils.js";
import TopBar from './bars/TopBar'
import './Tasks.css';


export default function AdminTasks(){
    document.body.style.backgroundColor = "#00f7ff";

    const [tasks, setTasks] = useState(null);

    const [taskname, setTaskname] = useState("");
    const [priority, setPriority] = useState("");
    const [deadline, setDeadline] = useState("");
    const [taskid, setTaskid] = useState("");
    const [email, setEmail] = useState("");

    const onTasknameChange = e => setTaskname(e.target.value);
    const onPriorityChange = e => setPriority(e.target.value);
    const onDeadlineChange = e => setDeadline(e.target.value);
    const onEmailChange = e => setEmail(e.target.value);

    const [modalCreate, setModalCreate] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    

    const getAllTasks = () => {
        getTasks().then((tasks) => {
            setTasks(tasks);
        });
    }
    
    useEffect(() =>{
        getAllTasks();
      },[]);

    const createTask = async () => {
        try{
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
        console.log(getDateForDeadline(new Date(task.deadline)));
        setDeadline(getDateForDeadline2(new Date(task.deadline)));
        setEmail(task.email);
        setTaskid(task._id);
        setModalUpdate(true);
        
    }
        
    return tasks === null ? (
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
                    <div className="heading flex">Task List</div>
                    <div className="flex">
                        <Button
                            style={{ height: "40px" }}
                            color="primary"
                            variant="outlined"
                            type="submit"
                            onClick={(() =>setModalCreate(true))}
                        >
                            Add task
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
                            <FormGroup>
                                <label>Email:</label>
                                <input className="form-control" type="text" name="deadline" onChange={onEmailChange} value={email}></input>
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
                                    {task.taskname + " (" + task.email + ")" }
                                </div>
                                <div >
                                <Button
                                    onClick={() => showModalUpdate(task)}
                                    color="primary"
                                    
                                >
                                    update
                                </Button>
                                </div>
                                <div>
                                <Button
                                    onClick={() =>handleDelete(task._id)}
                                    color="secondary"
                                    margin="60 px"
                                >
                                    delete
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
