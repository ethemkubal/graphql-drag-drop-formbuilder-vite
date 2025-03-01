import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import { Component, DataConnection } from '../types';

// Storage anahtar tanımları
const PROJECTS_KEY = 'graphql-builder-projects';
const CURRENT_PROJECT_KEY = 'graphql-builder-current-project';

// Proje tipi
export interface Project {
  id: string;
  name: string;
  description: string;
  components: Component[];
  dataConnections: DataConnection[];
  layout: any;
  lastModified: string;
  createdAt: string;
}

// Yeni proje oluşturma
export const createNewProject = (name: string, description: string = ''): Project => {
  const project: Project = {
    id: uuidv4(),
    name,
    description,
    components: [],
    dataConnections: [],
    layout: null,
    lastModified: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  return project;
};

// Projeyi LocalStorage'a kaydet
export const saveProject = (project: Project): void => {
  const projects = getAllProjects();
  const existingProjectIndex = projects.findIndex(p => p.id === project.id);
  
  // Proje son değiştirilme zamanını güncelle
  project.lastModified = new Date().toISOString();
  
  if (existingProjectIndex !== -1) {
    // Mevcut projeyi güncelle
    projects[existingProjectIndex] = project;
  } else {
    // Yeni proje ekle
    projects.push(project);
  }
  
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  setCurrentProject(project);
};

// Projeyi JSON dosyası olarak dışa aktar
export const exportProject = (project: Project): void => {
  const jsonStr = JSON.stringify(project, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  saveAs(blob, `${project.name.replace(/\s+/g, '_').toLowerCase()}-${project.id.slice(0, 8)}.json`);
};

// JSON dosyasından projeyi içe aktar (dosya içeriğini parametre olarak alır)
export const importProject = (jsonContent: string): Project | null => {
  try {
    const project = JSON.parse(jsonContent) as Project;
    
    // Gerekli alanları kontrol et
    if (!project.id || !project.name || !Array.isArray(project.components)) {
      throw new Error('Geçersiz proje dosyası');
    }
    
    // Projeyi kaydet
    saveProject(project);
    return project;
  } catch (error) {
    console.error('Proje içe aktarma hatası:', error);
    return null;
  }
};

// Kayıtlı tüm projeleri al
export const getAllProjects = (): Project[] => {
  const projectsJson = localStorage.getItem(PROJECTS_KEY);
  if (!projectsJson) return [];
  try {
    return JSON.parse(projectsJson) as Project[];
  } catch (error) {
    console.error('Projeler alınırken hata oluştu:', error);
    return [];
  }
};

// Proje sil
export const deleteProject = (projectId: string): void => {
  let projects = getAllProjects();
  projects = projects.filter(p => p.id !== projectId);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  
  // Eğer şu anki proje siliniyorsa, şu anki proje referansını da temizle
  const currentProject = getCurrentProject();
  if (currentProject && currentProject.id === projectId) {
    localStorage.removeItem(CURRENT_PROJECT_KEY);
  }
};

// Şu anki projeyi ayarla
export const setCurrentProject = (project: Project): void => {
  localStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project));
};

// Şu anki projeyi al
export const getCurrentProject = (): Project | null => {
  const projectJson = localStorage.getItem(CURRENT_PROJECT_KEY);
  if (!projectJson) return null;
  try {
    return JSON.parse(projectJson) as Project;
  } catch (error) {
    console.error('Şu anki proje alınırken hata oluştu:', error);
    return null;
  }
};
