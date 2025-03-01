import React from 'react';
import { Box, Paper, Typography, Divider, IconButton, Tooltip } from '@mui/material';
import { Component } from '../../types';
import useBuilderStore from '../../store/builderStore';
import PreviewComponent from './PreviewComponent';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import TabletIcon from '@mui/icons-material/Tablet';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';
import RefreshIcon from '@mui/icons-material/Refresh';

const FormPreview: React.FC = () => {
  const { components, previewSettings, setPreviewDevice, toggleDarkMode, resetFormValues } = useBuilderStore();

  const sortedComponents = [...components].sort((a, b) => {
    if (a.y === b.y) {
      return a.x - b.x;
    }
    return a.y - b.y;
  });

  // Cihaz tipine göre genişlik
  const getContainerWidth = () => {
    switch (previewSettings.device) {
      case 'mobile':
        return '360px';
      case 'tablet':
        return '768px';
      case 'desktop':
      default:
        return '100%';
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        p: 2,
        bgcolor: previewSettings.darkMode ? 'grey.900' : 'background.default',
        color: previewSettings.darkMode ? 'common.white' : 'text.primary',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Form Önizleme</Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Masaüstü Görünümü">
            <IconButton 
              color={previewSettings.device === 'desktop' ? 'primary' : 'default'} 
              onClick={() => setPreviewDevice('desktop')}
            >
              <DesktopWindowsIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Tablet Görünümü">
            <IconButton 
              color={previewSettings.device === 'tablet' ? 'primary' : 'default'} 
              onClick={() => setPreviewDevice('tablet')}
            >
              <TabletIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Mobil Görünümü">
            <IconButton 
              color={previewSettings.device === 'mobile' ? 'primary' : 'default'} 
              onClick={() => setPreviewDevice('mobile')}
            >
              <PhoneAndroidIcon />
            </IconButton>
          </Tooltip>
          
          <Divider orientation="vertical" flexItem />
          
          <Tooltip title={previewSettings.darkMode ? "Açık Mod" : "Karanlık Mod"}>
            <IconButton onClick={toggleDarkMode}>
              {previewSettings.darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Formu Sıfırla">
            <IconButton onClick={resetFormValues}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          width: getContainerWidth(),
          maxWidth: '100%',
          margin: '0 auto',
          bgcolor: previewSettings.darkMode ? 'grey.800' : 'background.paper',
          color: previewSettings.darkMode ? 'common.white' : 'text.primary',
          transition: 'all 0.3s ease',
          p: 3,
        }}
      >
        {sortedComponents.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Henüz bir form bileşeni bulunmuyor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Çalışma alanına form bileşenleri ekleyerek başlayın
            </Typography>
          </Box>
        ) : (
          <Box 
            component="form" 
            noValidate 
            autoComplete="off"
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
            }}
          >
            {sortedComponents.map((component) => (
              <PreviewComponent key={component.id} component={component} />
            ))}
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box 
                  sx={{ 
                    py: 1, 
                    px: 3, 
                    bgcolor: 'grey.300', 
                    color: 'grey.700', 
                    borderRadius: 1, 
                    fontWeight: 'medium', 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'grey.400' },
                  }}
                >
                  İptal
                </Box>
                <Box 
                  sx={{ 
                    py: 1, 
                    px: 3, 
                    bgcolor: 'secondary.main', 
                    color: 'white', 
                    borderRadius: 1, 
                    fontWeight: 'medium', 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'secondary.dark' },
                  }}
                >
                  Sıfırla
                </Box>
              </Box>
              <Box 
                sx={{ 
                  py: 1, 
                  px: 3, 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  borderRadius: 1, 
                  fontWeight: 'medium', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <PlayForWorkIcon fontSize="small" />
                Gönder
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default FormPreview;
