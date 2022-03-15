import axios from "axios";
const backendUrl = "http://localhost:4000/tasks";

export function addTask(task) {
    return axios.post(backendUrl, task);
}

export function getTasks() {
    return axios.get(backendUrl);
}

export function updateTask(task_id, task_info) {
    return axios.put(backendUrl+ "/" + task_id, task_info);
}

export function deleteTask(task_id) {
    return axios.delete(backendUrl+ "/" + task_id);
}