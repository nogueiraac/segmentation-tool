'use client';
import { Project } from "@/types";
import React, { createContext, useState } from "react";

const intialProject: Project = {
  classes: [],
  description: "",
  name: "",
  images: [],
}

const useValue = () => {
  const [project, setProject] = useState<Project>(intialProject);
  return {
    project,
    setProject,
  };
};

interface Props {
  children: React.ReactNode;
}

const ProjectContext = createContext({} as ReturnType<typeof useValue>);

function ProjectProvider({ children }: Props) {
  return (
    <ProjectContext.Provider value={useValue()}>
      {children}
    </ProjectContext.Provider>
  );
}
export { ProjectProvider };
export default ProjectContext;
