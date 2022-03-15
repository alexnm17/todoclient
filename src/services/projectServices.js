import axios from "axios";
const backendUrl = "http://localhost:4000/projects";

export function addProject(project) {
    return axios.post(backendUrl, project);
}

export function getProjects() {
    return axios.get(backendUrl);
}

export function getProject(project_id){
    return axios.get(backendUrl+ "/" + project_id)
}

export function updateProject(project_id, project_info) {
    return axios.put(backendUrl+ "/" + project_id, project_info);
}

export function deleteProject(project_id) {
    return axios.delete(backendUrl+ "/"+ project_id);
}