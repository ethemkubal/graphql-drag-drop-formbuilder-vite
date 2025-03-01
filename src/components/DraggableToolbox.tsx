import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Collapse,
  IconButton,
} from '@mui/material';
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
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MenuIcon from '@mui/icons-material/Menu';
import ShortTextIcon from '@mui/icons-material/ShortText';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import TitleIcon from '@mui/icons-material/Title';
import CodeIcon from '@mui/icons-material/Code';
import SpeedIcon from '@mui/icons-material/Speed';
import TabIcon from '@mui/icons-material/Tab';
import NumbersIcon from '@mui/icons-material/Numbers';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface ComponentType {
  type: string;
  name: string;
  icon: React.ReactNode;
  category: 'form' | 'layout' | 'data' | 'advanced';
  description?: string;
}

const componentTypes: ComponentType[] = [
  // Temel Form bileşenleri
  { type: 'textBox', name: 'Metin Kutusu', icon: <TextFieldsIcon />, category: 'form', description: 'Tek satır metin girişi' },
  { type: 'multilineText', name: 'Çok Satırlı Metin', icon: <FormatAlignLeftIcon />, category: 'form', description: 'Çoklu satır metin girişi' },
  { type: 'number', name: 'Sayı Girişi', icon: <NumbersIcon />, category: 'form', description: 'Sayısal değer girişi' },
  { type: 'button', name: 'Buton', icon: <SmartButtonIcon />, category: 'form', description: 'Tıklanabilir buton' },
  { type: 'checkbox', name: 'Onay Kutusu', icon: <CheckBoxIcon />, category: 'form', description: 'Onay kutusu' },
  { type: 'radio', name: 'Seçenek Butonu', icon: <RadioButtonCheckedIcon />, category: 'form', description: 'Tekli seçim grupları' },
  { type: 'switch', name: 'Anahtar', icon: <SwitchLeftIcon />, category: 'form', description: 'Açma/kapama anahtarı' },
  { type: 'select', name: 'Açılır Menü', icon: <MenuIcon />, category: 'form', description: 'Seçenek listesi' },
  { type: 'multiSelect', name: 'Çoklu Seçim', icon: <MenuIcon />, category: 'form', description: 'Birden fazla seçim yapma' },
  { type: 'datePicker', name: 'Tarih Seçici', icon: <DateRangeIcon />, category: 'form', description: 'Tarih seçme alanı' },
  { type: 'slider', name: 'Kaydırıcı', icon: <LinearScaleIcon />, category: 'form', description: 'Değer seçmek için kaydırıcı' },
  { type: 'fileUpload', name: 'Dosya Yükleme', icon: <CloudUploadIcon />, category: 'form', description: 'Dosya yükleme alanı' },
  { type: 'autocomplete', name: 'Otomatik Tamamlama', icon: <AutoAwesomeIcon />, category: 'form', description: 'Önerili giriş kutusu' },
  { type: 'rating', name: 'Derecelendirme', icon: <StarIcon />, category: 'form', description: 'Yıldızlı derecelendirme' },
  
  // Düzen bileşenleri
  { type: 'container', name: 'Konteyner', icon: <ViewModuleIcon />, category: 'layout', description: 'İçerik yerleşim alanı' },
  { type: 'card', name: 'Kart', icon: <CardIcon />, category: 'layout', description: 'Başlık ve içerikli kart' },
  { type: 'divider', name: 'Ayraç', icon: <HorizontalRuleIcon />, category: 'layout', description: 'Yatay veya dikey ayırıcı çizgi' },
  { type: 'typography', name: 'Metin', icon: <TitleIcon />, category: 'layout', description: 'Stillendirilmiş metin' },
  { type: 'image', name: 'Görsel', icon: <ImageIcon />, category: 'layout', description: 'Görsel ekranı' },
  { type: 'html', name: 'HTML İçerik', icon: <CodeIcon />, category: 'layout', description: 'Özel HTML içeriği' },
  { type: 'accordion', name: 'Akordiyon', icon: <ExpandMoreIcon />, category: 'layout', description: 'Genişletilebilir içerik paneli' },
  { type: 'tabs', name: 'Sekmeler', icon: <TabIcon />, category: 'layout', description: 'Sekmeli içerik paneli' },

  // Veri gösterimi bileşenleri
  { type: 'dataGrid', name: 'Veri Tablosu', icon: <TableChartIcon />, category: 'data', description: 'Tablo şeklinde veri görünümü' },
  { type: 'chart', name: 'Grafik', icon: <InsertChartIcon />, category: 'data', description: 'Grafik görselleştirme' },
  { type: 'progress', name: 'İlerleme Çubuğu', icon: <SpeedIcon />, category: 'data', description: 'İlerleme durumu göstergesi' },
];

interface DraggableItemProps {
  type: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ type, name, icon, description }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <ListItem
      ref={drag}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        '&:hover': {
          backgroundColor: 'rgba(37, 99, 235, 0.08)',
        },
        py: 1,
        borderRadius: 1,
        my: 0.5,
      }}
    >
      <ListItemIcon sx={{ minWidth: 36 }}>
        {icon}
      </ListItemIcon>
      <ListItemText 
        primary={name} 
        secondary={description}
        primaryTypographyProps={{ variant: 'body2' }}
        secondaryTypographyProps={{ variant: 'caption', sx: { fontSize: '0.7rem' } }}
      />
    </ListItem>
  );
};

const DraggableToolbox: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    form: true,
    layout: true,
    data: true,
    advanced: true
  });
  
  const toggleCategory = (category: 'form' | 'layout' | 'data' | 'advanced') => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };
  
  // Bileşenleri kategorilere ayır
  const formComponents = componentTypes
    .filter(c => c.category === 'form' && (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                           (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))));
    
  const dataComponents = componentTypes
    .filter(c => c.category === 'data' && (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                          (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))));
    
  const layoutComponents = componentTypes
    .filter(c => c.category === 'layout' && (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                            (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))));
  
  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        width: 280, 
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Bileşenler
        </Typography>
        <TextField
          fullWidth
          placeholder="Bileşen ara..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mt: 1 }}
        />
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {/* Form Bileşenleri */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            px: 1, 
            py: 0.5,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
            borderRadius: 1,
          }}
          onClick={() => toggleCategory('form')}
        >
          <Typography variant="subtitle2" color="textSecondary" fontWeight="medium">
            Form Bileşenleri
          </Typography>
          <IconButton size="small">
            {expandedCategories.form ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>
        
        <Collapse in={expandedCategories.form}>
          <List dense disablePadding>
            {formComponents.map((component) => (
              <DraggableItem 
                key={component.type} 
                type={component.type} 
                name={component.name} 
                icon={component.icon}
                description={component.description}
              />
            ))}
          </List>
        </Collapse>
        
        <Divider sx={{ my: 1 }} />
        
        {/* Düzen Bileşenleri */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            px: 1, 
            py: 0.5,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
            borderRadius: 1,
          }}
          onClick={() => toggleCategory('layout')}
        >
          <Typography variant="subtitle2" color="textSecondary" fontWeight="medium">
            Düzen Bileşenleri
          </Typography>
          <IconButton size="small">
            {expandedCategories.layout ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>
        
        <Collapse in={expandedCategories.layout}>
          <List dense disablePadding>
            {layoutComponents.map((component) => (
              <DraggableItem 
                key={component.type} 
                type={component.type} 
                name={component.name} 
                icon={component.icon}
                description={component.description}
              />
            ))}
          </List>
        </Collapse>
        
        <Divider sx={{ my: 1 }} />
        
        {/* Veri Bileşenleri */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            px: 1, 
            py: 0.5,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
            borderRadius: 1,
          }}
          onClick={() => toggleCategory('data')}
        >
          <Typography variant="subtitle2" color="textSecondary" fontWeight="medium">
            Veri Bileşenleri
          </Typography>
          <IconButton size="small">
            {expandedCategories.data ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>
        
        <Collapse in={expandedCategories.data}>
          <List dense disablePadding>
            {dataComponents.map((component) => (
              <DraggableItem 
                key={component.type} 
                type={component.type} 
                name={component.name} 
                icon={component.icon}
                description={component.description}
              />
            ))}
          </List>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default DraggableToolbox;
