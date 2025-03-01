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
        
      case 'container':
        return (
          <Paper 
            variant="outlined" 
            sx={{ 
              height: '100%', 
              padding: 2, 
              backgroundColor: component.props.backgroundColor || 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
          >
            {component.props.content || 
              <Typography color="text.secondary">Konteyner içeriği</Typography>
            }
          </Paper>
        );
        
      case 'card':
        return (
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">{component.props.title || 'Kart Başlığı'}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {component.props.content || 'Kart içeriği buraya gelecek...'}
              </Typography>
            </CardContent>
          </Card>
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
        return <Box>Bilinmeyen bileşen tipi</Box>;
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
      
      {/* Bileşen araç çubuğu */}
      <Box
        className="component-toolbar"
        sx={{
          position: 'absolute',
          top: -15,
          right: 10,
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
