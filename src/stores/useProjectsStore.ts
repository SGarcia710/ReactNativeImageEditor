import ProjectsScreen from '@app/screens/projects';
import create from 'zustand';
import {omit} from 'lodash';

export interface Project {
  name: string;
  id: string;
}
export interface ProjectsStore {
  projects: {
    [key: string]: Project;
  };
  createNewProject: (name: string) => string;
  removeProject: (id: string) => void;
  getProject: (id: string) => Project;
}

const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: {},
  createNewProject: name => {
    const projectID = new Date().toString();
    set(state => ({
      projects: {
        ...state.projects,
        [projectID]: {
          name,
          id: new Date().toString(),
        },
      },
    }));
    return projectID;
  },
  getProject: (id: string) => {
    const projects = get().projects;
    return projects[id as keyof typeof projects];
  },
  removeProject: id => {
    set(state => ({projects: {...omit(state.projects, [id])}}));
  },
}));

export default useProjectsStore;
