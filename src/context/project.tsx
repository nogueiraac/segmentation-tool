'use client';
import React, { createContext, useState } from "react";

const useValue = () => {
  const [project, setProject] = useState<any>();
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
