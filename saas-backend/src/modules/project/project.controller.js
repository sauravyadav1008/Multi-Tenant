import {
  createProjectService,
  getProjectsService,
} from "./project.service.js";

export const createProject = async (req, res) => {
  try {
    const { name } = req.body;

    const project = await createProjectService(name, req.tenantId);

    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await getProjectsService(req.tenantId);

    res.json(projects);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};