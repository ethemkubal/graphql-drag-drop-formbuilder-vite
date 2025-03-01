import React, { useState, useRef } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Badge,
  Switch,
  FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewListIcon from '@mui/icons-material/ViewList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';
import useBuilderStore from '../store/builderStore';
import { Project, exportProject, getAllProjects, deleteProject, importProject } from '../services/storageService';

const TopBar: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { 
    currentProject, 
    createProject, 
    loadProject, 
    saveCurrentProject,
    projectDialogOpen,
    setProjectDialogOpen,
    previewSettings,
    togglePreview,
  } = useBuilderStore();
  
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [projectsMenuAnchor, setProjectsMenuAnchor] = useState<null | HTMLElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Projeleri menüyü açmadan önce yükle
  const handleOpenProjectsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setProjects(getAllProjects());
    setProjectsMenuAnchor(event.currentTarget);
  };
  
  const handleCloseProjectsMenu = () => {
    setProjectsMenuAnchor(null);
  };
  
  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      enqueueSnackbar('Proje adı boş olamaz', { variant: 'error' });
      return;
    }
    
    createProject(newProjectName, newProjectDescription);
    enqueueSnackbar(`"${newProjectName}" projesi oluşturuldu`, { variant: 'success' });
    
    setNewProjectName('');
    setNewProjectDescription('');
  };
  
  const handleLoadProject = (project: Project) => {
    loadProject(project);
    handleCloseProjectsMenu();
    enqueueSnackbar(`"${project.name}" projesi yüklendi`, { variant: 'success' });
  };
  
  const handleDeleteProject = (project: Project, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (confirm(`"${project.name}" projesini silmek istediğinizden emin misiniz?`)) {
      deleteProject(project.id);
      setProjects(projects.filter(p => p.id !== project.id));
      enqueueSnackbar(`"${project.name}" projesi silindi`, { variant: 'info' });
    }
  };
  
  const handleSaveProject = () => {
    if (!currentProject) {
      enqueueSnackbar('Kaydedilecek proje bulunamadı', { variant: 'error' });
      return;
    }
    
    saveCurrentProject();
    enqueueSnackbar(`"${currentProject.name}" projesi kaydedildi`, { variant: 'success' });
  };
  
  const handleExportProject = () => {
    if (!currentProject) {
      enqueueSnackbar('Dışa aktarılacak proje bulunamadı', { variant: 'error' });
      return;
    }
    
    exportProject(currentProject);
    enqueueSnackbar(`"${currentProject.name}" projesi dışa aktarıldı`, { variant: 'success' });
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      try {
        const importedProject = importProject(content);
        
        if (importedProject) {
          loadProject(importedProject);
          enqueueSnackbar(`"${importedProject.name}" projesi içe aktarıldı`, { variant: 'success' });
        } else {
          enqueueSnackbar('Geçersiz proje dosyası', { variant: 'error' });
        }
      } catch (error) {
        console.error('Proje içe aktarma hatası:', error);
        enqueueSnackbar('Proje içe aktarılırken hata oluştu', { variant: 'error' });
      }
    };
    reader.readAsText(file);
    
    // Dosya seçiciyi sıfırla (aynı dosyayı tekrar seçebilmek için)
    if (event.target) {
      event.target.value = '';
    }
  };
  
  // Oluşturulma veya son düzenleme tarihini biçimlendir
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <>
      <AppBar position="static" color="primary" elevation={3}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            GraphQL Form Builder
          </Typography>
          
          {currentProject && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Typography variant="body2" color="inherit" sx={{ mr: 2 }}>
                {currentProject.name}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Önizleme/Düzenleme modu geçişi */}
            <Tooltip title={previewSettings.enabled ? "Düzenleme Moduna Geç" : "Önizleme Moduna Geç"}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={togglePreview}
                startIcon={previewSettings.enabled ? <EditIcon /> : <VisibilityIcon />}
                sx={{ mr: 2 }}
              >
                {previewSettings.enabled ? "Düzenle" : "Önizle"}
              </Button>
            </Tooltip>
            
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<AddIcon />}
              onClick={() => setProjectDialogOpen(true)}
              size="small"
            >
              Yeni Proje
            </Button>
            
            <Tooltip title="Projeleri Göster">
              <IconButton color="inherit" onClick={handleOpenProjectsMenu}>
                <ViewListIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Projeyi Kaydet">
              <IconButton 
                color="inherit" 
                onClick={handleSaveProject}
                disabled={!currentProject}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Dışa Aktar">
              <IconButton 
                color="inherit" 
                onClick={handleExportProject}
                disabled={!currentProject}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="İçe Aktar">
              <IconButton color="inherit" onClick={handleImportClick}>
                <UploadFileIcon />
              </IconButton>
            </Tooltip>
            
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".json"
              onChange={handleFileChange}
            />
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Yeni Proje Dialog */}
      <Dialog 
        open={projectDialogOpen} 
        onClose={() => setProjectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Yeni Proje Oluştur</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Proje Adı"
            fullWidth
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Proje Açıklaması (İsteğe bağlı)"
            fullWidth
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProjectDialogOpen(false)}>İptal</Button>
          <Button 
            onClick={handleCreateProject} 
            variant="contained" 
            color="primary"
            disabled={!newProjectName.trim()}
          >
            Oluştur
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Projeler Menüsü */}
      <Menu
        anchorEl={projectsMenuAnchor}
        open={Boolean(projectsMenuAnchor)}
        onClose={handleCloseProjectsMenu}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Kayıtlı Projeler
          </Typography>
        </Box>
        <Divider />
        
        {projects.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary="Henüz kaydedilmiş proje yok" />
          </MenuItem>
        ) : (
          projects.map((project) => (
            <MenuItem 
              key={project.id} 
              onClick={() => handleLoadProject(project)}
              selected={currentProject?.id === project.id}
            >
              <ListItemIcon>
                <Badge 
                  badgeContent={project.components.length} 
                  color="primary"
                  max={99}
                >
                  <FolderOpenIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary={project.name}
                secondary={`Son düzenleme: ${formatDate(project.lastModified)}`}
                primaryTypographyProps={{ fontWeight: currentProject?.id === project.id ? 'bold' : 'normal' }}
              />
              <IconButton 
                size="small" 
                onClick={(e) => handleDeleteProject(project, e)}
                sx={{ ml: 1 }}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default TopBar;
