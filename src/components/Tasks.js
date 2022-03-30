import React, { useState, useEffect } from "react";
import { Row, Col, Modal, ModalBody, FormGroup, ModalFooter, ModalHeader } from 'reactstrap';
import { Paper,Button } from "@material-ui/core";
import { Checkbox} from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css'
import './Tasks.css';
import Header from './Header'
import {getTasks} from "../services/apicalls.js"

import {
    addTask,
    updateTask,
    deleteTask,
} from "../services/taskServices";

export default function Tasks(){

    const [tasks, setTasks] = useState(null);

    const [taskname, setTaskname] = useState("");
    const [priority, setPriority] = useState("");
    const [deadline, setDeadline] = useState("");
    const [taskid, setTaskid] = useState("");

    const onTasknameChange = e => setTaskname(e.target.value);
    const onPriorityChange = e => setPriority(e.target.value);
    const onDeadlineChange = e => setDeadline(e.target.value);

    const [modalCreate, setModalCreate] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    

    const getAllTasks = () => {
        getTasks().then((tasks) => {
          setTasks(tasks);
          
        });
      }
    
      useEffect(() =>{
        getAllTasks();
        console.log(tasks);
      },[]);

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }



    const createTask = () => {
        try{
            const data = {taskname, priority, deadline}
            addTask(data);
            getTasks();
            setModalCreate(false);
            window.location.reload(true);
            
        }catch (error) {
            alert(error);
        }
            
    };

    const handleUpdate= async () => {
        try{
            const data = {taskname, priority, deadline}
            updateTask(taskid,data);
            getTasks();
            await sleep(500);
            window.location.reload(true);
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
            setTasks({ taskList });
            await updateTask(currentTask, {
                completed: taskList[index].completed,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (currentTask) => {
        const originalTasks = this.state.tasks;
        try {
            const tasks = originalTasks.filter(
                (task) => task._id !== currentTask
            );
            this.setState({ tasks });
            await deleteTask(currentTask);
        } catch (error) {
            this.setState({ tasks: originalTasks });
            console.log(error);
        }
    };

    const showModalUpdate = (task) => {
        setTaskname(task.taskname);
        setPriority(task.priority);
        setDeadline(task.deadline);
        setTaskid(task._id);
        
    }
        
    return tasks === null ? (
            <div>
                <h1>Loading...</h1>
            </div>
            ):(
                <div>
                    <Header/>
                <div className="App flex">
                <Paper elevation={3} className="container">
                    <div className="heading">Task List</div>
                        <Button
                            style={{ height: "40px" }}
                            color="primary"
                            variant="outlined"
                            type="submit"
                            onClick={(() =>setModalCreate(true))}
                        >
                            Add task
                        </Button>


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
                                    onClick={() => this.handleComplete(task._id)}
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
                                    update
                                </Button>
                                </div>
                                <div>
                                <Button
                                    onClick={() => handleDelete}
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
                            <Button color="primary" onClick={handleUpdate}>Accept</Button>
                            <Button color="secondary" onClick={() => setModalUpdate(false)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
            </div>
            </div>    
            
            
    );
}
