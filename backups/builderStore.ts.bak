import { create } from 'zustand';
import { Component, DataConnection, FormPreviewSettings, FormData } from '../types';
import { 
  getCurrentProject, 
  saveProject, 
  createNewProject, 
  Project 
} from '../services/storageService';

interface BuilderStore {
  // Proje durumu
  currentProject: Project | null;
  
  // Bileşen yönetimi
  components: Component[];
  selectedComponent: Component | null;
  dataConnections: DataConnection[];
  
  // UI durumu
  isSaving: boolean;
  projectDialogOpen: boolean;
  
  // Önizleme durumu
  previewSettings: FormPreviewSettings;
  formData: FormData;
  
  // Proje işlemleri
  initializeStore: () => void;
  createProject: (name: string, description?: string) => void;
  loadProject: (project: Project) => void;
  saveCurrentProject: () => void;
  
  // Bileşen işlemleri
  addComponent: (component: Omit<Component, 'id'>) => void;
  selectComponent: (id: string | null) => void; // null olması mümkün
  updateComponent: (id: string, updates: Partial<Component>) => void;
  removeComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  addDataConnection: (connection: Omit<DataConnection, 'id'>) => void;
  saveLayout: (layout: any) => void;
  
  // Önizleme işlemleri
  togglePreview: () => void;
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  setPreviewResponsive: (responsive: boolean) => void;
  toggleDarkMode: () => void;
  setFormValue: (componentId: string, value: any) => void;
  resetFormValues: () => void;
  
  // UI işlemleri
  setProjectDialogOpen: (isOpen: boolean) => void;
}

const useBuilderStore = create<BuilderStore>((set, get) => ({
  // Varsayılan değerler
  currentProject: null,
  components: [],
  selectedComponent: null,
  dataConnections: [],
  isSaving: false,
  projectDialogOpen: false,
  
  // Önizleme ayarları
  previewSettings: {
    enabled: false,
    responsive: true,
    device: 'desktop',
    showValidation: true,
    showPlaceholders: true,
    darkMode: false,
  },
  formData: {},
  
  // Store'u başlat
  initializeStore: () => {
    // LocalStorage'dan mevcut projeyi yüklemeyi dene
    const savedProject = getCurrentProject();
    if (savedProject) {
      set({
        currentProject: savedProject,
        components: savedProject.components || [],
        dataConnections: savedProject.dataConnections || [],
      });
    } else {
      // İlk açılışta yeni proje dialog'unu aç
      set({ projectDialogOpen: true });
    }
  },
  
  // Yeni proje oluştur
  createProject: (name, description = '') => {
    const newProject = createNewProject(name, description);
    set({
      currentProject: newProject,
      components: [],
      dataConnections: [],
      selectedComponent: null,
      projectDialogOpen: false,
      previewSettings: {
        enabled: false,
        responsive: true,
        device: 'desktop',
        showValidation: true,
        showPlaceholders: true,
        darkMode: false,
      },
      formData: {},
    });
    saveProject(newProject);
  },
  
  // Projeyi yükle
  loadProject: (project) => {
    set({
      currentProject: project,
      components: project.components || [],
      dataConnections: project.dataConnections || [],
      selectedComponent: null,
      previewSettings: {
        enabled: false,
        responsive: true,
        device: 'desktop',
        showValidation: true, 
        showPlaceholders: true,
        darkMode: false,
      },
      formData: {},
    });
  },
  
  // Mevcut projeyi kaydet
  saveCurrentProject: () => {
    const { currentProject, components, dataConnections } = get();
    
    if (!currentProject) return;
    
    set({ isSaving: true });
    
    const updatedProject = {
      ...currentProject,
      components,
      dataConnections,
      lastModified: new Date().toISOString(),
    };
    
    saveProject(updatedProject);
    
    set({ 
      currentProject: updatedProject,
      isSaving: false 
    });
  },
  
  // Bileşenleri ekle
  addComponent: (component) => {
    const newComponent = { 
      ...component, 
      id: Date.now().toString(),
      styles: component.styles || {
        fontSize: 'inherit',
        fontWeight: 'normal',
        textAlign: 'left',
        color: 'inherit',
        backgroundColor: 'transparent',
        padding: '8px',
        margin: '0px',
        borderRadius: '4px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#e0e0e0',
      }
    };
    
    set(state => {
      const newComponents = [...state.components, newComponent];
      
      // Otomatik kaydet
      if (state.currentProject) {
        const updatedProject = {
          ...state.currentProject,
          components: newComponents,
          lastModified: new Date().toISOString(),
        };
        saveProject(updatedProject);
        
        return {
          components: newComponents,
          currentProject: updatedProject,
        };
      }
      
      return { components: newComponents };
    });
  },
  
  // Bileşeni seç
  selectComponent: (id) => set(state => ({
    selectedComponent: id === null ? null : state.components.find(comp => comp.id === id) || null,
  })),
  
  // Bileşeni güncelle
  updateComponent: (id, updates) => set(state => {
    const updatedComponents = state.components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    );
    
    // Otomatik kaydet
    if (state.currentProject) {
      const updatedProject = {
        ...state.currentProject,
        components: updatedComponents,
        lastModified: new Date().toISOString(),
      };
      saveProject(updatedProject);
      
      return {
        components: updatedComponents,
        selectedComponent: state.selectedComponent?.id === id 
          ? { ...state.selectedComponent, ...updates }
          : state.selectedComponent,
        currentProject: updatedProject,
      };
    }
    
    return {
      components: updatedComponents,
      selectedComponent: state.selectedComponent?.id === id 
        ? { ...state.selectedComponent, ...updates }
        : state.selectedComponent
    };
  }),
  
  // Bileşeni kaldır
  removeComponent: (id) => set(state => {
    const filteredComponents = state.components.filter(comp => comp.id !== id);
    
    // Otomatik kaydet
    if (state.currentProject) {
      const updatedProject = {
        ...state.currentProject,
        components: filteredComponents,
        lastModified: new Date().toISOString(),
      };
      saveProject(updatedProject);
      
      return {
        components: filteredComponents,
        selectedComponent: state.selectedComponent?.id === id ? null : state.selectedComponent,
        currentProject: updatedProject,
      };
    }
    
    return {
      components: filteredComponents,
      selectedComponent: state.selectedComponent?.id === id ? null : state.selectedComponent,
    };
  }),
  
  // Bileşeni çoğalt
  duplicateComponent: (id) => {
    const { components } = get();
    const componentToDuplicate = components.find(c => c.id === id);
    
    if (!componentToDuplicate) return;
    
    // Yeni bir ID oluştur ve x, y pozisyonunu hafifçe kaydır
    const duplicatedComponent = {
      ...componentToDuplicate,
      id: Date.now().toString(),
      x: componentToDuplicate.x + 1,
      y: componentToDuplicate.y + 1,
    };
    
    get().addComponent(duplicatedComponent);
  },
  
  // GraphQL veri bağlantısı ekle
  addDataConnection: (connection) => set(state => {
    const newConnections = [...state.dataConnections, { ...connection, id: Date.now().toString() }];
    
    // Otomatik kaydet
    if (state.currentProject) {
      const updatedProject = {
        ...state.currentProject,
        dataConnections: newConnections,
        lastModified: new Date().toISOString(),
      };
      saveProject(updatedProject);
      
      return {
        dataConnections: newConnections,
        currentProject: updatedProject,
      };
    }
    
    return {
      dataConnections: newConnections,
    };
  }),
  
  // Düzeni kaydet
  saveLayout: (layout) => set(state => {
    // Otomatik kaydet
    if (state.currentProject) {
      const updatedProject = {
        ...state.currentProject,
        layout,
        lastModified: new Date().toISOString(),
      };
      saveProject(updatedProject);
      
      return {
        layout,
        currentProject: updatedProject,
      };
    }
    
    return { layout };
  }),
  
  // Önizleme modunu aç/kapat
  togglePreview: () => set(state => {
    const newPreview = !state.previewSettings.enabled;
    
    // Önizleme açıldığında bileşen seçimini kaldır
    if (newPreview) {
      return {
        previewSettings: {
          ...state.previewSettings,
          enabled: newPreview
        },
        selectedComponent: null
      };
    }
    
    return {
      previewSettings: {
        ...state.previewSettings,
        enabled: newPreview
      }
    };
  }),
  
  // Önizleme cihazını ayarla
  setPreviewDevice: (device) => set(state => ({
    previewSettings: {
      ...state.previewSettings,
      device
    }
  })),
  
  // Duyarlı modu aç/kapat
  setPreviewResponsive: (responsive) => set(state => ({
    previewSettings: {
      ...state.previewSettings,
      responsive
    }
  })),
  
  // Karanlık modu aç/kapat
  toggleDarkMode: () => set(state => ({
    previewSettings: {
      ...state.previewSettings,
      darkMode: !state.previewSettings.darkMode
    }
  })),
  
  // Form değerini ayarla
  setFormValue: (componentId, value) => set(state => ({
    formData: {
      ...state.formData,
      [componentId]: value
    }
  })),
  
  // Form değerlerini sıfırla
  resetFormValues: () => set({
    formData: {}
  }),
  
  // Proje dialog'unu aç/kapat
  setProjectDialogOpen: (isOpen) => set({
    projectDialogOpen: isOpen,
  }),
}));

export default useBuilderStore;
