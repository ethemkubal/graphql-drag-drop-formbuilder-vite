import React from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Paper, 
  Card, 
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Tooltip,
  IconButton,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useBuilderStore from '../store/builderStore';
import GraphQLDataConnector from './GraphQLDataConnector';
import { Component } from '../types';

// İkon importları
import TextFieldsIcon from '@mui/icons-material/TextFields';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import TableChartIcon from '@mui/icons-material/TableChart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import CardIcon from '@mui/icons-material/CreditCard';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ImageIcon from '@mui/icons-material/Image';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoveIcon from '@mui/icons-material/OpenWith';
import SettingsIcon from '@mui/icons-material/Settings';
import AutocompleteIcon from '@mui/icons-material/YoutubeSearchedFor';
import SliderIcon from '@mui/icons-material/LinearScale';
import SwitchIcon from '@mui/icons-material/ToggleOn';
import FileUploadIcon from '@mui/icons-material/CloudUpload';
import RatingIcon from '@mui/icons-material/Star';
import DividerIcon from '@mui/icons-material/Remove';
import TypographyIcon from '@mui/icons-material/Title';
import ProgressIcon from '@mui/icons-material/TrendingUp';
import AccordionIcon from '@mui/icons-material/ExpandMore';
import TabsIcon from '@mui/icons-material/Tab';
import CodeIcon from '@mui/icons-material/Code';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import NumbersIcon from '@mui/icons-material/Numbers';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ComponentRendererProps {
  component: Component;
}

const getComponentIcon = (type: string) => {
  switch (type) {
    case 'textBox': return <TextFieldsIcon />;
    case 'button': return <SmartButtonIcon />;
    case 'dataGrid': return <TableChartIcon />;
    case 'chart': return <InsertChartIcon />;
    case 'container': return <ViewModuleIcon />;
    case 'card': return <CardIcon />;
    case 'checkbox': return <CheckBoxIcon />;
    case 'image': return <ImageIcon />;
    case 'radio': return <RadioButtonCheckedIcon />;
    case 'datePicker': return <DateRangeIcon />;
    case 'multilineText': return <FormatAlignLeftIcon />;
    case 'number': return <NumbersIcon />;
    case 'select': return <AutocompleteIcon />;
    case 'multiSelect': return <AutocompleteIcon />;
    case 'autocomplete': return <AutocompleteIcon />;
    case 'switch': return <SwitchIcon />;
    case 'slider': return <SliderIcon />;
    case 'fileUpload': return <FileUploadIcon />;
    case 'rating': return <RatingIcon />;
    case 'divider': return <DividerIcon />;
    case 'typography': return <TypographyIcon />;
    case 'progress': return <ProgressIcon />;
    case 'accordion': return <AccordionIcon />;
    case 'tabs': return <TabsIcon />;
    case 'html': return <CodeIcon />;
    default: return <ViewModuleIcon />;
  }
};

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component }) => {
  const { selectComponent, selectedComponent, removeComponent, updateComponent } = useBuilderStore();
  
  const isSelected = selectedComponent?.id === component.id;
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component.id);
  };
  
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Bileşeni tüm özellikleriyle kopyala
    const duplicatedComponent = { ...component };
    delete duplicatedComponent.id; // ID'yi kaldır, yeni bir ID atanacak
    useBuilderStore.getState().addComponent(duplicatedComponent);
  };
  
  const renderComponent = () => {
    switch (component.type) {
      case 'textBox':
        return (
          <TextField 
            fullWidth 
            label={component.props.label || 'Metin'}
            placeholder={component.props.placeholder || ''}
            variant={component.props.variant || 'outlined'}
            disabled={component.props.disabled}
            size={component.props.size || 'medium'}
          />
        );
        
      case 'button':
        return (
          <Button 
            variant={component.props.variant || 'contained'} 
            color={component.props.color || 'primary'}
            size={component.props.size || 'medium'}
            fullWidth={component.props.fullWidth}
            disabled={component.props.disabled}
          >
            {component.props.label || 'Buton'}
          </Button>
        );
      
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox 
                checked={component.props.checked || false}
                disabled={component.props.disabled}
                color={component.props.color || 'primary'}
              />
            }
            label={component.props.label || 'Onay Kutusu'}
          />
        );
        
      case 'radio':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{component.props.legend || 'Seçenekler'}</FormLabel>
            <RadioGroup value={component.props.value || ''}>
              {(component.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3']).map((option, index) => (
                <FormControlLabel 
                  key={index} 
                  value={option} 
                  control={<Radio color={component.props.color || 'primary'} />} 
                  label={option} 
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
        
      case 'datePicker':
        return (
          <TextField
            fullWidth
            label={component.props.label || 'Tarih Seçin'}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        );
      
      // Yeni eklenen bileşen tipleri
      case 'multilineText':
        return (
          <TextField
            fullWidth
            label={component.props.label || 'Çok Satırlı Metin'}
            placeholder={component.props.placeholder || ''}
            variant={component.props.variant || 'outlined'}
            multiline
            rows={component.props.rows || 4}
            disabled={component.props.disabled}
          />
        );
        
      case 'number':
        return (
          <TextField
            fullWidth
            label={component.props.label || 'Sayı'}
            type="number"
            variant={component.props.variant || 'outlined'}
            disabled={component.props.disabled}
            InputProps={{
              inputProps: { 
                min: component.props.min,
                max: component.props.max,
                step: component.props.step || 1
              }
            }}
          />
        );
        
      case 'select':
        return (
          <FormControl fullWidth>
            <InputLabel>{component.props.label || 'Seçim'}</InputLabel>
            <Select
              label={component.props.label || 'Seçim'}
              value={component.props.value || ''}
              disabled={component.props.disabled}
            >
              {(component.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3']).map((option, index) => (
                <MenuItem key={index} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
        
      case 'multiSelect':
        return (
          <FormControl fullWidth>
            <InputLabel>{component.props.label || 'Çoklu Seçim'}</InputLabel>
            <Select
              multiple
              label={component.props.label || 'Çoklu Seçim'}
              value={component.props.value || []}
              disabled={component.props.disabled}
            >
              {(component.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3']).map((option, index) => (
                <MenuItem key={index} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
        
      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={component.props.checked || false}
                disabled={component.props.disabled}
                color={component.props.color || 'primary'}
              />
            }
            label={component.props.label || 'Anahtar'}
          />
        );
        
      case 'slider':
        return (
          <Box>
            <Typography gutterBottom>{component.props.label || 'Kaydırıcı'}</Typography>
            <Slider
              min={component.props.min || 0}
              max={component.props.max || 100}
              step={component.props.step || 1}
              valueLabelDisplay="auto"
              disabled={component.props.disabled}
            />
          </Box>
        );
        
      case 'autocomplete':
        return (
          <Autocomplete
            options={component.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3']}
            renderInput={(params) => (
              <TextField {...params} label={component.props.label || 'Otomatik Tamamlama'} />
            )}
            disabled={component.props.disabled}
          />
        );
        
      case 'fileUpload':
        return (
          <Box>
            <Button
              variant={component.props.variant || 'outlined'}
              component="label"
              startIcon={<CloudUploadIcon />}
              disabled={component.props.disabled}
            >
              {component.props.label || 'Dosya Yükle'}
              <input type="file" hidden />
            </Button>
          </Box>
        );
        
      case 'rating':
        return (
          <Box>
            <Typography component="legend">{component.props.label || 'Derecelendirme'}</Typography>
            <Rating
              max={component.props.max || 5}
              precision={component.props.precision || 1}
              disabled={component.props.disabled}
            />
          </Box>
        );
        
      case 'divider':
        return (
          <Divider>
            {component.props.label && (
              <Typography variant="caption">{component.props.label}</Typography>
            )}
          </Divider>
        );
        
      case 'typography':
        return (
          <Typography 
            variant={component.props.variant || 'body1'}
            align={component.props.align || 'inherit'}
          >
            {component.props.content || 'Metin içeriği'}
          </Typography>
        );
        
      case 'progress':
        return (
          <Box>
            <Typography gutterBottom>{component.props.label || 'İlerleme'}</Typography>
            <LinearProgress 
              variant={component.props.variant || 'determinate'} 
              value={component.props.value || 50}
              color={component.props.color || 'primary'} 
            />
          </Box>
        );

      case 'dataGrid':
        if (component.dataSource) {
          return (
            <GraphQLDataConnector 
              query={component.dataSource.query}
              variables={component.dataSource.variables}
              dataPath={component.dataSource.dataPath}
              render={(data, loading) => {
                if (loading) return <Box sx={{ p: 2 }}>Yükleniyor...</Box>;
                
                // DataGrid için sütunları varsayılan olarak oluştur
                const columns: GridColDef[] = data && data.length > 0 
                  ? Object.keys(data[0]).map(key => ({ field: key, headerName: key, flex: 1 }))
                  : [];
                
                return (
                  <Box sx={{ height: '100%', width: '100%', minHeight: 250 }}>
                    <DataGrid
                      rows={data || []}
                      columns={columns}
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 5,
                          },
                        },
                      }}
                      getRowId={(row) => row.id || Math.random().toString(36).substr(2, 9)}
                    />
                  </Box>
                );
              }}
            />
          );
        }
        return (
          <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            <TableChartIcon sx={{ fontSize: 40, opacity: 0.5, mb: 1 }} />
            <Typography>Veri kaynağı yapılandırılmamış</Typography>
          </Box>
        );
        
      case 'chart':
        return (
          <Box 
            sx={{ 
              p: 2, 
              textAlign: 'center', 
              color: 'text.secondary',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <InsertChartIcon sx={{ fontSize: 40, opacity: 0.5, mb: 1 }} />
            <Typography>Grafik bileşeni</Typography>
          </Box>
        );
        
      case 'accordion':
        return (
          <Accordion id={`component-${component.id}`} defaultExpanded={component.props.defaultExpanded}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{component.props.title || 'Akordiyon Başlığı'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {(!component.children || component.children.length === 0) ? (
                <Typography>{component.props.content || 'Bileşen sürükleyip bırakın'}</Typography>
              ) : (
                <Box>
                  {component.children.map(child => (
                    <Box key={child.id} sx={{ mb: 2 }}>
                      <ComponentRenderer component={child} />
                    </Box>
                  ))}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        );
        
      case 'tabs':
        return (
          <Box id={`component-${component.id}`} sx={{ width: '100%', height: '100%' }}>
            <Tabs value={component.props.value || 0}>
              {(component.props.tabs || ['Sekme 1', 'Sekme 2', 'Sekme 3']).map((tab, index) => (
                <Tab key={index} label={tab} />
              ))}
            </Tabs>
            <Box sx={{ p: 2, border: 1, borderColor: 'divider', mt: 1, minHeight: '100px' }}>
              {(!component.children || component.children.length === 0) ? (
                <Typography color="text.secondary">
                  Bileşen sürükleyip bırakın
                </Typography>
              ) : (
                <Box>
                  {component.children
                    .filter(child => child.props.tabIndex === (component.props.value || 0))
                    .map(child => (
                      <Box key={child.id} sx={{ mb: 2 }}>
                        <ComponentRenderer component={child} />
                      </Box>
                    ))
                  }
                </Box>
              )}
            </Box>
          </Box>
        );
        
      case 'container':
        return (
          <Paper 
            id={`component-${component.id}`}
            variant="outlined" 
            sx={{ 
              height: '100%', 
              padding: 2, 
              backgroundColor: component.props.backgroundColor || 'inherit',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              border: '1px dashed',
              borderColor: 'divider',
            }} 
          >
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%',
              zIndex: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {(!component.children || component.children.length === 0) && (
                <Typography color="text.secondary">
                  Bileşen sürükleyip bırakın
                </Typography>
              )}
            </Box>
            
            <Box sx={{ position: 'relative', zIndex: 1, flex: 1 }}>
              {component.children?.map(child => (
                <Box key={child.id}>
                  <ComponentRenderer component={child} />
                </Box>
              ))}
            </Box>
          </Paper>
        );
        
      case 'card':
        return (
          <Card id={`component-${component.id}`} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">{component.props.title || 'Kart Başlığı'}</Typography>
              
              {(!component.children || component.children.length === 0) ? (
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Bileşen sürükleyip bırakın
                </Typography>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {component.children.map(child => (
                    <Box key={child.id} sx={{ mb: 2 }}>
                      <ComponentRenderer component={child} />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        );
        
      case 'html':
        return (
          <Box
            dangerouslySetInnerHTML={{ __html: component.props.content || '<p>HTML içeriği</p>' }}
          />
        );
        
      case 'image':
        return (
          <Box 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2
            }}
          >
            {component.props.src ? (
              <img 
                src={component.props.src} 
                alt={component.props.alt || 'Görsel'} 
                style={{ maxWidth: '100%', maxHeight: '100%' }} 
              />
            ) : (
              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <ImageIcon sx={{ fontSize: 40, opacity: 0.5, mb: 1 }} />
                <Typography>Görsel URL'si ayarlanmamış</Typography>
              </Box>
            )}
          </Box>
        );
        
      default:
        return <Box>Bilinmeyen bileşen tipi: {component.type}</Box>;
    }
  };
  
  return (
    <Box
      onClick={handleClick}
      sx={{
        height: '100%',
        border: isSelected ? '2px solid' : '1px dashed',
        borderColor: isSelected ? 'primary.main' : 'divider',
        borderRadius: 1,
        padding: 1,
        position: 'relative',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 2,
          '& .component-toolbar': {
            opacity: 1,
          },
        },
      }}
    >
      {renderComponent()}
      
      {/* Bileşen tipini gösteren ikon */}
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          left: 10,
          backgroundColor: 'background.paper',
          color: isSelected ? 'primary.main' : 'text.secondary',
          width: 24,
          height: 24,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          border: '1px solid',
          borderColor: isSelected ? 'primary.main' : 'divider',
          boxShadow: 1,
        }}
      >
        {getComponentIcon(component.type)}
      </Box>
      
      {/* Bileşen seçim ikonu */}
      <Tooltip title="Bileşeni Seç">
        <IconButton
          size="small"
          onClick={handleClick}
          sx={{
            position: 'absolute',
            top: -10,
            right: 10,
            backgroundColor: isSelected ? 'primary.main' : 'background.paper',
            color: isSelected ? 'common.white' : 'text.secondary',
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '1px solid',
            borderColor: isSelected ? 'primary.main' : 'divider',
            boxShadow: 1,
            '&:hover': {
              backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
            },
            zIndex: 10,
          }}
        >
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      
      {/* Bileşen araç çubuğu */}
      <Box
        className="component-toolbar"
        sx={{
          position: 'absolute',
          top: -15,
          right: 40, // Seçim ikonu için sağa kaydırıldı
          display: 'flex',
          gap: 0.5,
          opacity: isSelected ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      >
        {/* Bileşen silme butonu */}
        <Box
          sx={{
            backgroundColor: 'error.main',
            color: 'white',
            width: 24,
            height: 24,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            cursor: 'pointer',
            boxShadow: 1,
            '&:hover': {
              backgroundColor: 'error.dark',
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(component.id);
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </Box>
        
        {/* Bileşen kopyalama butonu */}
        <Box
          sx={{
            backgroundColor: 'info.main',
            color: 'white',
            width: 24,
            height: 24,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            cursor: 'pointer',
            boxShadow: 1,
            '&:hover': {
              backgroundColor: 'info.dark',
            },
          }}
          onClick={handleDuplicate}
        >
          <ContentCopyIcon fontSize="small" />
        </Box>
      </Box>
    </Box>
  );
};

export default ComponentRenderer;
