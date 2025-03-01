import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel, 
  Switch,
  FormControlLabel,
  Divider,
  Tab,
  Tabs,
  FormHelperText,
  IconButton,
  Grid,
  Chip,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import DataObjectIcon from '@mui/icons-material/DataObject';
import PaletteIcon from '@mui/icons-material/Palette';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import CodeIcon from '@mui/icons-material/Code';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useBuilderStore from '../store/builderStore';
import StyleEditor from './styleEditor/StyleEditor';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`property-tabpanel-${index}`}
      aria-labelledby={`property-tab-${index}`}
      {...other}
      style={{ height: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PropertyPanel: React.FC = () => {
  const { selectedComponent, updateComponent, addDataConnection, previewSettings, duplicateComponent } = useBuilderStore();
  const [graphqlEndpoint, setGraphqlEndpoint] = useState('');
  const [graphqlQuery, setGraphqlQuery] = useState('');
  const [graphqlDataPath, setGraphqlDataPath] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  // Önizleme modundayken veya seçili bileşen yokken bilgi mesajı göster
  if (previewSettings.enabled || !selectedComponent) {
    return (
      <Paper
        variant="outlined" 
        sx={{ 
          width: 320, 
          height: '100%',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        {previewSettings.enabled ? (
          <>
            <VisibilityIcon sx={{ fontSize: 48, mb: 2, opacity: 0.6 }} />
            <Typography variant="h6" gutterBottom>Önizleme Modu Aktif</Typography>
            <Typography variant="body2">
              Bileşen özelliklerini düzenlemek için önizleme modundan çıkın.
            </Typography>
          </>
        ) : (
          <>
            <SettingsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.6 }} />
            <Typography variant="h6" gutterBottom>Hiçbir bileşen seçilmedi</Typography>
            <Typography variant="body2">
              Özelliklerini düzenlemek için bir bileşen seçin veya çalışma alanına yeni bir bileşen sürükleyin.
            </Typography>
          </>
        )}
      </Paper>
    );
  }
  
  const handlePropertyChange = (prop: string, value: any) => {
    updateComponent(selectedComponent.id, {
      props: {
        ...selectedComponent.props,
        [prop]: value
      }
    });
  };
  
  const handleAddDataConnection = () => {
    if (!graphqlEndpoint || !graphqlQuery) return;
    
    const connection = {
      endpoint: graphqlEndpoint,
      query: graphqlQuery,
      dataPath: graphqlDataPath,
    };
    
    addDataConnection(connection);
    
    // Seçili bileşene veri kaynağını bağla
    updateComponent(selectedComponent.id, {
      dataSource: {
        type: 'graphql',
        query: graphqlQuery,
        variables: {},
        dataPath: graphqlDataPath,
      }
    });
  };
  
  const updateValidation = (field: string, value: any) => {
    const currentValidation = selectedComponent.validation || {};
    
    if (value === '' || value === null || value === undefined) {
      // Değer boşsa, o alanı kaldır
      const newValidation = { ...currentValidation };
      delete newValidation[field];
      
      // Eğer validasyon boş kaldıysa, tüm validasyon nesnesini undefined yap
      if (Object.keys(newValidation).length === 0) {
        updateComponent(selectedComponent.id, { validation: undefined });
      } else {
        updateComponent(selectedComponent.id, { validation: newValidation });
      }
    } else {
      // Değer varsa, güncelle
      updateComponent(selectedComponent.id, {
        validation: {
          ...currentValidation,
          [field]: value
        }
      });
    }
  };
  
  // Bileşen tipine göre uygun özellik panelini render et
  const renderPropertyFields = () => {
    switch (selectedComponent.type) {
      case 'textBox':
        return (
          <>
            <TextField
              fullWidth
              label="Etiket"
              margin="normal"
              value={selectedComponent.props.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Placeholder"
              margin="normal"
              value={selectedComponent.props.placeholder || ''}
              onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Yardım Metni"
              margin="normal"
              value={selectedComponent.props.helperText || ''}
              onChange={(e) => handlePropertyChange('helperText', e.target.value)}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="variant-label">Varyant</InputLabel>
              <Select
                labelId="variant-label"
                value={selectedComponent.props.variant || 'outlined'}
                label="Varyant"
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
              >
                <MenuItem value="outlined">Dış çizgili</MenuItem>
                <MenuItem value="filled">Doldurulmuş</MenuItem>
                <MenuItem value="standard">Standart</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="size-label">Boyut</InputLabel>
              <Select
                labelId="size-label"
                value={selectedComponent.props.size || 'medium'}
                label="Boyut"
                onChange={(e) => handlePropertyChange('size', e.target.value)}
              >
                <MenuItem value="small">Küçük</MenuItem>
                <MenuItem value="medium">Orta</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={selectedComponent.props.disabled || false}
                  onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                />
              }
              label="Devre dışı"
              sx={{ mt: 2 }}
            />
          </>
        );
      
      case 'multilineText':
        return (
          <>
            <TextField
              fullWidth
              label="Etiket"
              margin="normal"
              value={selectedComponent.props.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Placeholder"
              margin="normal"
              value={selectedComponent.props.placeholder || ''}
              onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Yardım Metni"
              margin="normal"
              value={selectedComponent.props.helperText || ''}
              onChange={(e) => handlePropertyChange('helperText', e.target.value)}
            />
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Satır Sayısı"
                  type="number"
                  value={selectedComponent.props.rows || 4}
                  onChange={(e) => handlePropertyChange('rows', parseInt(e.target.value))}
                  InputProps={{ inputProps: { min: 1, max: 20 } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Maks. Satır"
                  type="number"
                  value={selectedComponent.props.maxRows || ''}
                  onChange={(e) => handlePropertyChange('maxRows', e.target.value ? parseInt(e.target.value) : undefined)}
                  InputProps={{ inputProps: { min: 1, max: 50 } }}
                />
              </Grid>
            </Grid>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="variant-label">Varyant</InputLabel>
              <Select
                labelId="variant-label"
                value={selectedComponent.props.variant || 'outlined'}
                label="Varyant"
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
              >
                <MenuItem value="outlined">Dış çizgili</MenuItem>
                <MenuItem value="filled">Doldurulmuş</MenuItem>
                <MenuItem value="standard">Standart</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={selectedComponent.props.disabled || false}
                  onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                />
              }
              label="Devre dışı"
              sx={{ mt: 2 }}
            />
          </>
        );
        
      case 'number':
        return (
          <>
            <TextField
              fullWidth
              label="Etiket"
              margin="normal"
              value={selectedComponent.props.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Placeholder"
              margin="normal"
              value={selectedComponent.props.placeholder || ''}
              onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Yardım Metni"
              margin="normal"
              value={selectedComponent.props.helperText || ''}
              onChange={(e) => handlePropertyChange('helperText', e.target.value)}
            />
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Adım"
                  type="number"
                  value={selectedComponent.props.step || 1}
                  onChange={(e) => handlePropertyChange('step', parseFloat(e.target.value))}
                  InputProps={{ inputProps: { min: 0.01, step: 0.01 } }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Min"
                  type="number"
                  value={selectedComponent.validation?.min || ''}
                  onChange={(e) => updateValidation('min', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Max"
                  type="number"
                  value={selectedComponent.validation?.max || ''}
                  onChange={(e) => updateValidation('max', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </Grid>
            </Grid>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="variant-label">Varyant</InputLabel>
              <Select
                labelId="variant-label"
                value={selectedComponent.props.variant || 'outlined'}
                label="Varyant"
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
              >
                <MenuItem value="outlined">Dış çizgili</MenuItem>
                <MenuItem value="filled">Doldurulmuş</MenuItem>
                <MenuItem value="standard">Standart</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={selectedComponent.props.disabled || false}
                  onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                />
              }
              label="Devre dışı"
              sx={{ mt: 2 }}
            />
          </>
        );
        
      case 'button':
        return (
          <>
            <TextField
              fullWidth
              label="Buton Metni"
              margin="normal"
              value={selectedComponent.props.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="variant-label">Varyant</InputLabel>
              <Select
                labelId="variant-label"
                value={selectedComponent.props.variant || 'contained'}
                label="Varyant"
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
              >
                <MenuItem value="contained">Dolgulu</MenuItem>
                <MenuItem value="outlined">Dış çizgili</MenuItem>
                <MenuItem value="text">Metin</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="color-label">Renk</InputLabel>
              <Select
                labelId="color-label"
                value={selectedComponent.props.color || 'primary'}
                label="Renk"
                onChange={(e) => handlePropertyChange('color', e.target.value)}
              >
                <MenuItem value="primary">Ana renk</MenuItem>
                <MenuItem value="secondary">İkincil renk</MenuItem>
                <MenuItem value="success">Başarı</MenuItem>
                <MenuItem value="error">Hata</MenuItem>
                <MenuItem value="warning">Uyarı</MenuItem>
                <MenuItem value="info">Bilgi</MenuItem>
                <MenuItem value="inherit">Miras</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="size-label">Boyut</InputLabel>
              <Select
                labelId="size-label"
                value={selectedComponent.props.size || 'medium'}
                label="Boyut"
                onChange={(e) => handlePropertyChange('size', e.target.value)}
              >
                <MenuItem value="small">Küçük</MenuItem>
                <MenuItem value="medium">Orta</MenuItem>
                <MenuItem value="large">Büyük</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.fullWidth || false}
                    onChange={(e) => handlePropertyChange('fullWidth', e.target.checked)}
                  />
                }
                label="Tam genişlik"
              />
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.showIcon || false}
                    onChange={(e) => handlePropertyChange('showIcon', e.target.checked)}
                  />
                }
                label="İkon göster"
              />
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.disabled || false}
                    onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                  />
                }
                label="Devre dışı"
              />
            </Box>
          </>
        );
        
      case 'checkbox':
        return (
          <>
            <TextField
              fullWidth
              label="Etiket"
              margin="normal"
              value={selectedComponent.props.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="color-label">Renk</InputLabel>
              <Select
                labelId="color-label"
                value={selectedComponent.props.color || 'primary'}
                label="Renk"
                onChange={(e) => handlePropertyChange('color', e.target.value)}
              >
                <MenuItem value="primary">Ana renk</MenuItem>
                <MenuItem value="secondary">İkincil renk</MenuItem>
                <MenuItem value="success">Başarı</MenuItem>
                <MenuItem value="error">Hata</MenuItem>
                <MenuItem value="warning">Uyarı</MenuItem>
                <MenuItem value="info">Bilgi</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.checked || false}
                    onChange={(e) => handlePropertyChange('checked', e.target.checked)}
                  />
                }
                label="İşaretli"
              />
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.disabled || false}
                    onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                  />
                }
                label="Devre dışı"
              />
            </Box>
          </>
        );
        
      case 'radio':
        return (
          <>
            <TextField
              fullWidth
              label="Başlık"
              margin="normal"
              value={selectedComponent.props.legend || ''}
              onChange={(e) => handlePropertyChange('legend', e.target.value)}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="color-label">Renk</InputLabel>
              <Select
                labelId="color-label"
                value={selectedComponent.props.color || 'primary'}
                label="Renk"
                onChange={(e) => handlePropertyChange('color', e.target.value)}
              >
                <MenuItem value="primary">Ana renk</MenuItem>
                <MenuItem value="secondary">İkincil renk</MenuItem>
                <MenuItem value="success">Başarı</MenuItem>
                <MenuItem value="error">Hata</MenuItem>
                <MenuItem value="warning">Uyarı</MenuItem>
                <MenuItem value="info">Bilgi</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Seçenekler
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                {(selectedComponent.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3']).map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(selectedComponent.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3'])];
                        newOptions[index] = e.target.value;
                        handlePropertyChange('options', newOptions);
                      }}
                    />
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => {
                        const newOptions = [...(selectedComponent.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3'])];
                        newOptions.splice(index, 1);
                        handlePropertyChange('options', newOptions);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              
              <Button 
                startIcon={<AddIcon />} 
                variant="outlined" 
                size="small"
                onClick={() => {
                  const newOptions = [...(selectedComponent.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3']), `Seçenek ${(selectedComponent.props.options || []).length + 1}`];
                  handlePropertyChange('options', newOptions);
                }}
              >
                Seçenek Ekle
              </Button>
            </Box>
          </>
        );
        
      case 'select':
      case 'multiSelect':
        return (
          <>
            <TextField
              fullWidth
              label="Etiket"
              margin="normal"
              value={selectedComponent.props.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Yardım Metni"
              margin="normal"
              value={selectedComponent.props.helperText || ''}
              onChange={(e) => handlePropertyChange('helperText', e.target.value)}
            />
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Seçenekler
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                {(selectedComponent.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3']).map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(selectedComponent.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3'])];
                        newOptions[index] = e.target.value;
                        handlePropertyChange('options', newOptions);
                      }}
                    />
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => {
                        const newOptions = [...(selectedComponent.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3'])];
                        newOptions.splice(index, 1);
                        handlePropertyChange('options', newOptions);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              
              <Button 
                startIcon={<AddIcon />} 
                variant="outlined" 
                size="small"
                onClick={() => {
                  const newOptions = [...(selectedComponent.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3']), `Seçenek ${(selectedComponent.props.options || []).length + 1}`];
                  handlePropertyChange('options', newOptions);
                }}
              >
                Seçenek Ekle
              </Button>
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={selectedComponent.props.disabled || false}
                  onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                />
              }
              label="Devre dışı"
              sx={{ mt: 2 }}
            />
          </>
        );
        
      case 'autocomplete':
        return (
          <>
            <TextField
              fullWidth
              label="Etiket"
              margin="normal"
              value={selectedComponent.props.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Yardım Metni"
              margin="normal"
              value={selectedComponent.props.helperText || ''}
              onChange={(e) => handlePropertyChange('helperText', e.target.value)}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="variant-label">Varyant</InputLabel>
              <Select
                labelId="variant-label"
                value={selectedComponent.props.variant || 'outlined'}
                label="Varyant"
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
              >
                <MenuItem value="outlined">Dış çizgili</MenuItem>
                <MenuItem value="filled">Doldurulmuş</MenuItem>
                <MenuItem value="standard">Standart</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Seçenekler
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                {(selectedComponent.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3', 'Seçenek 4']).map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(selectedComponent.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3', 'Seçenek 4'])];
                        newOptions[index] = e.target.value;
                        handlePropertyChange('options', newOptions);
                      }}
                    />
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => {
                        const newOptions = [...(selectedComponent.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3', 'Seçenek 4'])];
                        newOptions.splice(index, 1);
                        handlePropertyChange('options', newOptions);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              
              <Button 
                startIcon={<AddIcon />} 
                variant="outlined" 
                size="small"
                onClick={() => {
                  const newOptions = [...(selectedComponent.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3', 'Seçenek 4']), `Seçenek ${(selectedComponent.props.options || []).length + 1}`];
                  handlePropertyChange('options', newOptions);
                }}
              >
                Seçenek Ekle
              </Button>
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={selectedComponent.props.multiple || false}
                  onChange={(e) => handlePropertyChange('multiple', e.target.checked)}
                />
              }
              label="Çoklu seçim"
              sx={{ mt: 2 }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={selectedComponent.props.disabled || false}
                  onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                />
              }
              label="Devre dışı"
              sx={{ mt: 1 }}
            />
          </>
        );
        
      case 'datePicker':
        return (
          <>
            <TextField
              fullWidth
              label="Etiket"
              margin="normal"
              value={selectedComponent.props.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Yardım Metni"
              margin="normal"
              value={selectedComponent.props.helperText || ''}
              onChange={(e) => handlePropertyChange('helperText', e.target.value)}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={selectedComponent.props.disabled || false}
                  onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                />
              }
              label="Devre dışı"
              sx={{ mt: 2 }}
            />
          </>
        );
        
      case 'slider':
        return (
          <>
            <TextField
              fullWidth
              label="Etiket"
              margin="normal"
              value={selectedComponent.props.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Yardım Metni"
              margin="normal"
              value={selectedComponent.props.helperText || ''}
              onChange={(e) => handlePropertyChange('helperText', e.target.value)}
            />
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Min"
                  type="number"
                  value={selectedComponent.props.min || 0}
                  onChange={(e) => handlePropertyChange('min', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Max"
                  type="number"
                  value={selectedComponent.props.max || 100}
                  onChange={(e) => handlePropertyChange('max', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Adım"
                  type="number"
                  value={selectedComponent.props.step || 1}
                  onChange={(e) => handlePropertyChange('step', parseFloat(e.target.value))}
                  InputProps={{ inputProps: { min: 0.1, step: 0.1 } }}
                />
              </Grid>
            </Grid>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="color-label">Renk</InputLabel>
              <Select
                labelId="color-label"
                value={selectedComponent.props.color || 'primary'}
                label="Renk"
                onChange={(e) => handlePropertyChange('color', e.target.value)}
              >
                <MenuItem value="primary">Ana renk</MenuItem>
                <MenuItem value="secondary">İkincil renk</MenuItem>
                <MenuItem value="success">Başarı</MenuItem>
                <MenuItem value="error">Hata</MenuItem>
                <MenuItem value="warning">Uyarı</MenuItem>
                <MenuItem value="info">Bilgi</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.showValueLabel || false}
                    onChange={(e) => handlePropertyChange('showValueLabel', e.target.checked)}
                  />
                }
                label="Değer etiketi göster"
              />
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.showMarks || false}
                    onChange={(e) => handlePropertyChange('showMarks', e.target.checked)}
                  />
                }
                label="İşaretleri göster"
              />
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.disabled || false}
                    onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                  />
                }
                label="Devre dışı"
              />
            </Box>
          </>
        );
        
      case 'switch':
        return (
          <>
            <TextField
              fullWidth
              label="Etiket"
              margin="normal"
              value={selectedComponent.props.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="color-label">Renk</InputLabel>
              <Select
                labelId="color-label"
                value={selectedComponent.props.color || 'primary'}
                label="Renk"
                onChange={(e) => handlePropertyChange('color', e.target.value)}
              >
                <MenuItem value="primary">Ana renk</MenuItem>
                <MenuItem value="secondary">İkincil renk</MenuItem>
                <MenuItem value="success">Başarı</MenuItem>
                <MenuItem value="error">Hata</MenuItem>
                <MenuItem value="warning">Uyarı</MenuItem>
                <MenuItem value="info">Bilgi</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.checked || false}
                    onChange={(e) => handlePropertyChange('checked', e.target.checked)}
                  />
                }
                label="Açık"
              />
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.disabled || false}
                    onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                  />
                }
                label="Devre dışı"
              />
            </Box>
          </>
        );
        
      case 'fileUpload':
        return (
          <>
            <TextField
              fullWidth
              label="Etiket"
              margin="normal"
              value={selectedComponent.props.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Yardım Metni"
              margin="normal"
              value={selectedComponent.props.helperText || ''}
              onChange={(e) => handlePropertyChange('helperText', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Kabul Edilen Dosya Tipleri"
              margin="normal"
              placeholder="örn. .jpg,.png,.pdf"
              value={selectedComponent.props.accept || ''}
              onChange={(e) => handlePropertyChange('accept', e.target.value)}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="variant-label">Varyant</InputLabel>
              <Select
                labelId="variant-label"
                value={selectedComponent.props.variant || 'outlined'}
                label="Varyant"
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
              >
                <MenuItem value="outlined">Dış çizgili</MenuItem>
                <MenuItem value="contained">Dolgulu</MenuItem>
                <MenuItem value="text">Metin</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="color-label">Renk</InputLabel>
              <Select
                labelId="color-label"
                value={selectedComponent.props.color || 'primary'}
                label="Renk"
                onChange={(e) => handlePropertyChange('color', e.target.value)}
              >
                <MenuItem value="primary">Ana renk</MenuItem>
                <MenuItem value="secondary">İkincil renk</MenuItem>
                <MenuItem value="success">Başarı</MenuItem>
                <MenuItem value="error">Hata</MenuItem>
                <MenuItem value="warning">Uyarı</MenuItem>
                <MenuItem value="info">Bilgi</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.multiple || false}
                    onChange={(e) => handlePropertyChange('multiple', e.target.checked)}
                  />
                }
                label="Çoklu dosya"
              />
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.fullWidth || false}
                    onChange={(e) => handlePropertyChange('fullWidth', e.target.checked)}
                  />
                }
                label="Tam genişlik"
              />
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.disabled || false}
                    onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                  />
                }
                label="Devre dışı"
              />
            </Box>
          </>
        );
        
      case 'rating':
        return (
          <>
            <TextField
              fullWidth
              label="Etiket"
              margin="normal"
              value={selectedComponent.props.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Yardım Metni"
              margin="normal"
              value={selectedComponent.props.helperText || ''}
              onChange={(e) => handlePropertyChange('helperText', e.target.value)}
            />
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Maks. Değer"
                  type="number"
                  value={selectedComponent.props.max || 5}
                  onChange={(e) => handlePropertyChange('max', parseInt(e.target.value))}
                  InputProps={{ inputProps: { min: 1, max: 10 } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Hassasiyet"
                  type="number"
                  value={selectedComponent.props.precision || 1}
                  onChange={(e) => handlePropertyChange('precision', parseFloat(e.target.value))}
                  InputProps={{ inputProps: { min: 0.1, max: 1, step: 0.1 } }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.disabled || false}
                    onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                  />
                }
                label="Devre dışı"
              />
            </Box>
          </>
        );
      
      case 'typography':
        return (
          <>
            <TextField
              fullWidth
              label="İçerik"
              margin="normal"
              multiline
              rows={4}
              value={selectedComponent.props.content || ''}
              onChange={(e) => handlePropertyChange('content', e.target.value)}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="variant-label">Varyant</InputLabel>
              <Select
                labelId="variant-label"
                value={selectedComponent.props.variant || 'body1'}
                label="Varyant"
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
              >
                <MenuItem value="h1">Başlık 1</MenuItem>
                <MenuItem value="h2">Başlık 2</MenuItem>
                <MenuItem value="h3">Başlık 3</MenuItem>
                <MenuItem value="h4">Başlık 4</MenuItem>
                <MenuItem value="h5">Başlık 5</MenuItem>
                <MenuItem value="h6">Başlık 6</MenuItem>
                <MenuItem value="subtitle1">Alt Başlık 1</MenuItem>
                <MenuItem value="subtitle2">Alt Başlık 2</MenuItem>
                <MenuItem value="body1">Metin 1</MenuItem>
                <MenuItem value="body2">Metin 2</MenuItem>
                <MenuItem value="caption">Etiket</MenuItem>
                <MenuItem value="overline">Üst Çizgi</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="align-label">Hizalama</InputLabel>
              <Select
                labelId="align-label"
                value={selectedComponent.props.align || 'left'}
                label="Hizalama"
                onChange={(e) => handlePropertyChange('align', e.target.value)}
              >
                <MenuItem value="left">Sol</MenuItem>
                <MenuItem value="center">Orta</MenuItem>
                <MenuItem value="right">Sağ</MenuItem>
                <MenuItem value="justify">İki Yana Yasla</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={selectedComponent.props.gutterBottom || false}
                  onChange={(e) => handlePropertyChange('gutterBottom', e.target.checked)}
                />
              }
              label="Alt boşluk ekle"
              sx={{ mt: 2 }}
            />
          </>
        );
        
      case 'divider':
        return (
          <>
            <TextField
              fullWidth
              label="Etiket"
              margin="normal"
              value={selectedComponent.props.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="orientation-label">Yönlendirme</InputLabel>
              <Select
                labelId="orientation-label"
                value={selectedComponent.props.orientation || 'horizontal'}
                label="Yönlendirme"
                onChange={(e) => handlePropertyChange('orientation', e.target.value)}
              >
                <MenuItem value="horizontal">Yatay</MenuItem>
                <MenuItem value="vertical">Dikey</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="text-align-label">Metin Hizalama</InputLabel>
              <Select
                labelId="text-align-label"
                value={selectedComponent.props.textAlign || 'center'}
                label="Metin Hizalama"
                onChange={(e) => handlePropertyChange('textAlign', e.target.value)}
                disabled={!selectedComponent.props.label}
              >
                <MenuItem value="center">Orta</MenuItem>
                <MenuItem value="left">Sol</MenuItem>
                <MenuItem value="right">Sağ</MenuItem>
              </Select>
            </FormControl>
          </>
        );
        
      case 'progress':
        return (
          <>
            <TextField
              fullWidth
              label="Etiket"
              margin="normal"
              value={selectedComponent.props.label || ''}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="variant-label">Varyant</InputLabel>
              <Select
                labelId="variant-label"
                value={selectedComponent.props.variant || 'determinate'}
                label="Varyant"
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
              >
                <MenuItem value="determinate">Belirli</MenuItem>
                <MenuItem value="indeterminate">Belirsiz</MenuItem>
                <MenuItem value="buffer">Tampon</MenuItem>
                <MenuItem value="query">Sorgu</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="color-label">Renk</InputLabel>
              <Select
                labelId="color-label"
                value={selectedComponent.props.color || 'primary'}
                label="Renk"
                onChange={(e) => handlePropertyChange('color', e.target.value)}
              >
                <MenuItem value="primary">Ana renk</MenuItem>
                <MenuItem value="secondary">İkincil renk</MenuItem>
                <MenuItem value="success">Başarı</MenuItem>
                <MenuItem value="error">Hata</MenuItem>
                <MenuItem value="warning">Uyarı</MenuItem>
                <MenuItem value="info">Bilgi</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Değer (%)"
              type="number"
              margin="normal"
              value={selectedComponent.props.value || 50}
              onChange={(e) => handlePropertyChange('value', parseInt(e.target.value))}
              disabled={selectedComponent.props.variant !== 'determinate'}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={selectedComponent.props.showValue || false}
                  onChange={(e) => handlePropertyChange('showValue', e.target.checked)}
                />
              }
              label="Değeri göster"
              sx={{ mt: 2 }}
              disabled={selectedComponent.props.variant !== 'determinate'}
            />
          </>
        );
        
      case 'accordion':
        return (
          <>
            <TextField
              fullWidth
              label="Başlık"
              margin="normal"
              value={selectedComponent.props.title || ''}
              onChange={(e) => handlePropertyChange('title', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="İçerik"
              margin="normal"
              multiline
              rows={4}
              value={selectedComponent.props.content || ''}
              onChange={(e) => handlePropertyChange('content', e.target.value)}
            />
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.defaultExpanded || false}
                    onChange={(e) => handlePropertyChange('defaultExpanded', e.target.checked)}
                  />
                }
                label="Varsayılan olarak açık"
              />
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.disabled || false}
                    onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                  />
                }
                label="Devre dışı"
              />
            </Box>
          </>
        );
        
      case 'tabs':
        return (
          <>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Sekmeler
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                {(selectedComponent.props.tabs || ['Sekme 1', 'Sekme 2', 'Sekme 3']).map((tab, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={tab}
                      onChange={(e) => {
                        const newTabs = [...(selectedComponent.props.tabs || ['Sekme 1', 'Sekme 2', 'Sekme 3'])];
                        newTabs[index] = e.target.value;
                        handlePropertyChange('tabs', newTabs);
                      }}
                    />
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => {
                        const newTabs = [...(selectedComponent.props.tabs || ['Sekme 1', 'Sekme 2', 'Sekme 3'])];
                        newTabs.splice(index, 1);
                        
                        // İçerik de varsa onları da güncelle
                        if (selectedComponent.props.contents) {
                          const newContents = [...selectedComponent.props.contents];
                          newContents.splice(index, 1);
                          handlePropertyChange('contents', newContents);
                        }
                        
                        handlePropertyChange('tabs', newTabs);
                      }}
                      disabled={selectedComponent.props.tabs?.length <= 1}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              
              <Button 
                startIcon={<AddIcon />} 
                variant="outlined" 
                size="small"
                onClick={() => {
                  const newTabs = [...(selectedComponent.props.tabs || ['Sekme 1', 'Sekme 2', 'Sekme 3']), `Sekme ${(selectedComponent.props.tabs || []).length + 1}`];
                  handlePropertyChange('tabs', newTabs);
                  
                  // İçerik de varsa bir içerik ekle
                  if (selectedComponent.props.contents) {
                    const newContents = [...selectedComponent.props.contents, `Sekme ${newTabs.length} içeriği`];
                    handlePropertyChange('contents', newContents);
                  }
                }}
                sx={{ mb: 3 }}
              >
                Sekme Ekle
              </Button>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Sekme İçerikleri
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              {(selectedComponent.props.tabs || ['Sekme 1', 'Sekme 2', 'Sekme 3']).map((tab, index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={`${tab} İçeriği`}
                  multiline
                  rows={2}
                  margin="normal"
                  value={(selectedComponent.props.contents && selectedComponent.props.contents[index]) || ''}
                  onChange={(e) => {
                    const newContents = [...(selectedComponent.props.contents || 
                      Array(selectedComponent.props.tabs.length).fill(''))];
                    newContents[index] = e.target.value;
                    handlePropertyChange('contents', newContents);
                  }}
                />
              ))}
            </Box>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="variant-label">Varyant</InputLabel>
              <Select
                labelId="variant-label"
                value={selectedComponent.props.variant || 'standard'}
                label="Varyant"
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
              >
                <MenuItem value="standard">Standart</MenuItem>
                <MenuItem value="fullWidth">Tam Genişlik</MenuItem>
                <MenuItem value="scrollable">Kaydırılabilir</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.centered || false}
                    onChange={(e) => handlePropertyChange('centered', e.target.checked)}
                  />
                }
                label="Ortalanmış"
              />
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.scrollable || false}
                    onChange={(e) => handlePropertyChange('scrollable', e.target.checked)}
                  />
                }
                label="Kaydırma düğmeleri"
              />
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedComponent.props.disabled || false}
                    onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
                  />
                }
                label="Devre dışı"
              />
            </Box>
          </>
        );
        
      case 'card':
        return (
          <>
            <TextField
              fullWidth
              label="Kart Başlığı"
              margin="normal"
              value={selectedComponent.props.title || ''}
              onChange={(e) => handlePropertyChange('title', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Kart İçeriği"
              margin="normal"
              multiline
              rows={4}
              value={selectedComponent.props.content || ''}
              onChange={(e) => handlePropertyChange('content', e.target.value)}
            />
          </>
        );
        
      case 'image':
        return (
          <>
            <TextField
              fullWidth
              label="Görsel URL"
              margin="normal"
              value={selectedComponent.props.src || ''}
              onChange={(e) => handlePropertyChange('src', e.target.value)}
            />
            
            <TextField
              fullWidth
              label="Alternatif Metin"
              margin="normal"
              value={selectedComponent.props.alt || ''}
              onChange={(e) => handlePropertyChange('alt', e.target.value)}
            />
          </>
        );
        
      case 'html':
        return (
          <>
            <TextField
              fullWidth
              label="HTML İçeriği"
              margin="normal"
              multiline
              rows={6}
              value={selectedComponent.props.content || ''}
              onChange={(e) => handlePropertyChange('content', e.target.value)}
            />
            <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
              HTML kodunu doğru yazıldığından emin olun
            </Typography>
          </>
        );
        
      case 'container':
        return (
          <>
            <TextField
              fullWidth
              label="İçerik"
              margin="normal"
              value={selectedComponent.props.content || ''}
              onChange={(e) => handlePropertyChange('content', e.target.value)}
            />
          </>
        );
        
      case 'dataGrid':
        return (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>GraphQL Veri Kaynağı</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="GraphQL Endpoint"
                margin="normal"
                value={graphqlEndpoint}
                onChange={(e) => setGraphqlEndpoint(e.target.value)}
              />
              
              <TextField
                fullWidth
                label="GraphQL Sorgusu"
                margin="normal"
                multiline
                rows={4}
                value={graphqlQuery}
                onChange={(e) => setGraphqlQuery(e.target.value)}
                placeholder={`query GetData {
  items {
    id
    name
    value
  }
}`}
              />
              
              <TextField
                fullWidth
                label="Veri Yolu (örn: data.items)"
                margin="normal"
                value={graphqlDataPath}
                onChange={(e) => setGraphqlDataPath(e.target.value)}
              />
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={handleAddDataConnection}
                startIcon={<DataObjectIcon />}
              >
                Veri Kaynağını Bağla
              </Button>
              
              {selectedComponent.dataSource && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Aktif Veri Kaynağı
                  </Typography>
                  <Chip 
                    label={`Sorgu: ${selectedComponent.dataSource.query.substring(0, 20)}...`} 
                    sx={{ mb: 1 }} 
                  />
                  <Chip 
                    label={`Veri Yolu: ${selectedComponent.dataSource.dataPath}`} 
                    color="info" 
                  />
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        );
        
      case 'chart':
        return (
          <Typography>Grafik özellikleri yakında eklenecek.</Typography>
        );
        
      default:
        return (
          <Typography>Bu bileşen türü için özellik ayarları mevcut değil: {selectedComponent.type}</Typography>
        );
    }
  };
  
  // Ortak bileşen doğrulama ayarları
  const renderValidationSection = () => {
    if (!['textBox', 'multilineText', 'number', 'select', 'multiSelect', 'datePicker', 'autocomplete', 'fileUpload'].includes(selectedComponent.type)) {
      return null;
    }
    
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
          Doğrulama Kuralları
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={selectedComponent.validation?.required || false}
              onChange={(e) => updateValidation('required', e.target.checked)}
            />
          }
          label="Zorunlu alan"
          sx={{ mb: 2 }}
        />
        
        {['textBox', 'multilineText'].includes(selectedComponent.type) && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Min. Uzunluk"
                type="number"
                value={selectedComponent.validation?.minLength || ''}
                onChange={(e) => updateValidation('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Maks. Uzunluk"
                type="number"
                value={selectedComponent.validation?.maxLength || ''}
                onChange={(e) => updateValidation('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Regex Deseni"
                placeholder="örn: ^[a-zA-Z0-9]+$"
                value={selectedComponent.validation?.pattern || ''}
                onChange={(e) => updateValidation('pattern', e.target.value || undefined)}
              />
              <FormHelperText>
                Giriş doğrulaması için düzenli ifade deseni
              </FormHelperText>
            </Grid>
          </Grid>
        )}
      </Box>
    );
  };
  
  // Bileşeni çoğaltma ve silme işlemleri
  const renderComponentActions = () => {
    return (
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<DeleteIcon />} 
          onClick={() => useBuilderStore.getState().removeComponent(selectedComponent.id)}
        >
          Sil
        </Button>
        
        <Button 
          variant="outlined" 
          color="info" 
          startIcon={<ContentCopyIcon />} 
          onClick={() => duplicateComponent(selectedComponent.id)}
        >
          Çoğalt
        </Button>
      </Box>
    );
  };

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        width: 320, 
        height: '100%',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Özellikler
          </Typography>
          <Chip 
            label={selectedComponent.type} 
            color="primary" 
            size="small" 
            sx={{ ml: 1 }} 
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          #{selectedComponent.id.substring(0, 8)}
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab icon={<SettingsIcon />} label="Özellikler" />
          <Tab icon={<PaletteIcon />} label="Stil" />
          <Tab icon={<CodeIcon />} label="Gelişmiş" />
        </Tabs>
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TabPanel value={activeTab} index={0}>
          {renderPropertyFields()}
          {renderValidationSection()}
          {renderComponentActions()}
        </TabPanel>
        
        <TabPanel value={activeTab} index={1}>
          <StyleEditor component={selectedComponent} />
        </TabPanel>
        
        <TabPanel value={activeTab} index={2}>
          <Typography variant="subtitle1" gutterBottom>
            Gelişmiş Özellikler
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Bu bölümde daha teknik ve gelişmiş ayarları yapılandırabilirsiniz.
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            Bileşen ID: {selectedComponent.id}
          </Typography>
          
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            fullWidth
            sx={{ mb: 2 }}
            onClick={() => {
              const componentType = selectedComponent.type;
              const componentId = selectedComponent.id;
              useBuilderStore.getState().updateComponent(componentId, {
                props: {},
                styles: {
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
                },
                validation: undefined,
              });
            }}
          >
            Bileşeni Sıfırla
          </Button>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Bileşen JSON</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                multiline
                rows={8}
                value={JSON.stringify(selectedComponent, null, 2)}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </AccordionDetails>
          </Accordion>
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default PropertyPanel;
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
