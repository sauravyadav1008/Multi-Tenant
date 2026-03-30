import prisma from "../../config/db.js";

export const createProjectService = async (name, tenantId) => {
  return prisma.project.create({
    data: {
      name,
      tenantId,
    },
  });
};

export const getProjectsService = async (tenantId) => {
  return prisma.project.findMany({
    where: {
      tenantId,
    },
  });
};