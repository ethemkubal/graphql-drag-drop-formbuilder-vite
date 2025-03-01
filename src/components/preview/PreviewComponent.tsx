import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Radio, 
  RadioGroup, 
  FormControl, 
  FormLabel, 
  Select, 
  MenuItem, 
  FormGroup, 
  Typography, 
  Card, 
  CardContent, 
  Slider,
  Switch, 
  Divider,
  InputLabel,
  Autocomplete,
  Tooltip,
  Input,
  IconButton,
  Chip,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Rating,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import { Component } from '../../types';
import useBuilderStore from '../../store/builderStore';

interface PreviewComponentProps {
  component: Component;
}

const PreviewComponent: React.FC<PreviewComponentProps> = ({ component }) => {
  const { formData, setFormValue } = useBuilderStore();
  const [localValue, setLocalValue] = useState<any>(formData[component.id] || '');
  
  useEffect(() => {
    // formData değişirse, localValue'yu güncelle
    if (formData[component.id] !== undefined) {
      setLocalValue(formData[component.id]);
    }
  }, [formData, component.id]);
  
  const handleChange = (value: any) => {
    setLocalValue(value);
    setFormValue(component.id, value);
  };
  
  // Bileşen stillerini CSS olarak oluştur
  const generateComponentStyles = () => {
    const styles = component.styles || {};
    const cssStyles: React.CSSProperties = {};
    
    // Temel CSS özelliklerini ekle
    if (styles.fontSize) cssStyles.fontSize = styles.fontSize;
    if (styles.fontFamily) cssStyles.fontFamily = styles.fontFamily;
    if (styles.fontWeight) cssStyles.fontWeight = styles.fontWeight;
    if (styles.textAlign) cssStyles.textAlign = styles.textAlign as any;
    if (styles.lineHeight) cssStyles.lineHeight = styles.lineHeight;
    if (styles.letterSpacing) cssStyles.letterSpacing = styles.letterSpacing;
    if (styles.color) cssStyles.color = styles.color;
    if (styles.backgroundColor) cssStyles.backgroundColor = styles.backgroundColor;
    if (styles.opacity !== undefined) cssStyles.opacity = styles.opacity;
    
    // Padding - ya tüm kenarlar ya da tek tek
    if (styles.padding) {
      cssStyles.padding = styles.padding;
    } else {
      if (styles.paddingTop) cssStyles.paddingTop = styles.paddingTop;
      if (styles.paddingRight) cssStyles.paddingRight = styles.paddingRight;
      if (styles.paddingBottom) cssStyles.paddingBottom = styles.paddingBottom;
      if (styles.paddingLeft) cssStyles.paddingLeft = styles.paddingLeft;
    }
    
    // Margin - ya tüm kenarlar ya da tek tek
    if (styles.margin) {
      cssStyles.margin = styles.margin;
    } else {
      if (styles.marginTop) cssStyles.marginTop = styles.marginTop;
      if (styles.marginRight) cssStyles.marginRight = styles.marginRight;
      if (styles.marginBottom) cssStyles.marginBottom = styles.marginBottom;
      if (styles.marginLeft) cssStyles.marginLeft = styles.marginLeft;
    }
    
    // Kenarlık özellikleri
    if (styles.borderWidth) cssStyles.borderWidth = styles.borderWidth;
    if (styles.borderStyle) cssStyles.borderStyle = styles.borderStyle as any;
    if (styles.borderColor) cssStyles.borderColor = styles.borderColor;
    if (styles.borderRadius) cssStyles.borderRadius = styles.borderRadius;
    if (styles.boxShadow) cssStyles.boxShadow = styles.boxShadow;
    
    // Boyutlandırma
    if (styles.width) cssStyles.width = styles.width;
    if (styles.height) cssStyles.height = styles.height;
    
    return cssStyles;
  };
  
  const cssStyles = generateComponentStyles();
  
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
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            required={component.validation?.required}
            error={component.validation?.required && !localValue}
            helperText={component.props.helperText}
            InputProps={{
              style: cssStyles,
            }}
            InputLabelProps={{
              style: {
                color: cssStyles.color,
              },
            }}
          />
        );
      
      case 'multilineText':
        return (
          <TextField
            fullWidth
            label={component.props.label || 'Çok Satırlı Metin'}
            placeholder={component.props.placeholder || ''}
            variant={component.props.variant || 'outlined'}
            disabled={component.props.disabled}
            size={component.props.size || 'medium'}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            required={component.validation?.required}
            multiline
            rows={component.props.rows || 4}
            maxRows={component.props.maxRows}
            error={component.validation?.required && !localValue}
            helperText={component.props.helperText}
            InputProps={{
              style: cssStyles,
            }}
            InputLabelProps={{
              style: {
                color: cssStyles.color,
              },
            }}
          />
        );
        
      case 'number':
        return (
          <TextField
            fullWidth
            label={component.props.label || 'Sayı'}
            placeholder={component.props.placeholder || ''}
            variant={component.props.variant || 'outlined'}
            disabled={component.props.disabled}
            size={component.props.size || 'medium'}
            type="number"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            required={component.validation?.required}
            inputProps={{
              min: component.validation?.min,
              max: component.validation?.max,
              step: component.props.step || 1,
              style: cssStyles,
            }}
            InputLabelProps={{
              style: {
                color: cssStyles.color,
              },
            }}
            error={component.validation?.required && !localValue}
            helperText={component.props.helperText}
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
            style={cssStyles}
            startIcon={component.props.showIcon && <SendIcon />}
          >
            {component.props.label || 'Buton'}
          </Button>
        );
        
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(localValue)}
                onChange={(e) => handleChange(e.target.checked)}
                disabled={component.props.disabled}
                color={component.props.color || 'primary'}
                required={component.validation?.required}
              />
            }
            label={component.props.label || 'Onay Kutusu'}
            style={cssStyles}
          />
        );
        
      case 'radio':
        return (
          <FormControl component="fieldset" style={cssStyles}>
            <FormLabel component="legend">{component.props.legend || 'Seçenekler'}</FormLabel>
            <RadioGroup 
              value={localValue || ''} 
              onChange={(e) => handleChange(e.target.value)}
            >
              {(component.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3']).map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio color={component.props.color || 'primary'} />}
                  label={option}
                  disabled={component.props.disabled}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
        
      case 'select':
        return (
          <FormControl fullWidth style={cssStyles}>
            <InputLabel>{component.props.label || 'Seçiniz'}</InputLabel>
            <Select
              value={localValue || ''}
              onChange={(e) => handleChange(e.target.value)}
              label={component.props.label || 'Seçiniz'}
              disabled={component.props.disabled}
              required={component.validation?.required}
              error={component.validation?.required && !localValue}
            >
              {(component.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3']).map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {component.props.helperText && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {component.props.helperText}
              </Typography>
            )}
          </FormControl>
        );
        
      case 'multiSelect':
        return (
          <FormControl fullWidth style={cssStyles}>
            <InputLabel>{component.props.label || 'Çoklu Seçim'}</InputLabel>
            <Select
              multiple
              value={localValue || []}
              onChange={(e) => handleChange(e.target.value)}
              label={component.props.label || 'Çoklu Seçim'}
              disabled={component.props.disabled}
              required={component.validation?.required}
              error={component.validation?.required && (!localValue || localValue.length === 0)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {(component.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3', 'Seçenek 4']).map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {component.props.helperText && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {component.props.helperText}
              </Typography>
            )}
          </FormControl>
        );
        
      case 'autocomplete':
        return (
          <Autocomplete
            options={component.props.options || ['Seçenek 1', 'Seçenek 2', 'Seçenek 3', 'Seçenek 4']}
            value={localValue || null}
            onChange={(_, newValue) => handleChange(newValue)}
            disabled={component.props.disabled}
            multiple={component.props.multiple}
            style={cssStyles}
            renderInput={(params) => (
              <TextField
                {...params}
                label={component.props.label || 'Otomatik Tamamlama'}
                variant={component.props.variant || 'outlined'}
                required={component.validation?.required}
                error={component.validation?.required && !localValue}
                helperText={component.props.helperText}
              />
            )}
          />
        );
        
      case 'datePicker':
        return (
          <TextField
            fullWidth
            label={component.props.label || 'Tarih Seçin'}
            type="date"
            value={localValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={component.props.disabled}
            style={cssStyles}
            required={component.validation?.required}
            error={component.validation?.required && !localValue}
            helperText={component.props.helperText}
          />
        );
        
      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(localValue)}
                onChange={(e) => handleChange(e.target.checked)}
                disabled={component.props.disabled}
                color={component.props.color || 'primary'}
              />
            }
            label={component.props.label || 'Düğme'}
            style={cssStyles}
          />
        );
        
      case 'slider':
        return (
          <Box style={cssStyles}>
            <Typography id="slider-label" gutterBottom>
              {component.props.label || 'Kaydırıcı'}
            </Typography>
            <Slider
              value={localValue || (component.props.min || 0)}
              onChange={(_, value) => handleChange(value)}
              min={component.props.min || 0}
              max={component.props.max || 100}
              step={component.props.step || 1}
              valueLabelDisplay={component.props.showValueLabel ? "on" : "auto"}
              marks={component.props.showMarks}
              disabled={component.props.disabled}
              color={component.props.color || 'primary'}
              aria-labelledby="slider-label"
            />
            {component.props.helperText && (
              <Typography variant="caption" color="text.secondary">
                {component.props.helperText}
              </Typography>
            )}
          </Box>
        );
        
      case 'fileUpload':
        return (
          <Box style={{ ...cssStyles, textAlign: 'center' }}>
            <input
              accept={component.props.accept || "*/*"}
              style={{ display: 'none' }}
              id={`file-upload-${component.id}`}
              type="file"
              multiple={component.props.multiple}
              disabled={component.props.disabled}
              onChange={(e) => handleChange(e.target.files)}
            />
            <label htmlFor={`file-upload-${component.id}`}>
              <Button
                variant={component.props.variant || 'outlined'}
                color={component.props.color || 'primary'}
                startIcon={<CloudUploadIcon />}
                component="span"
                disabled={component.props.disabled}
                fullWidth={component.props.fullWidth}
                style={{ 
                  padding: cssStyles.padding, 
                  margin: cssStyles.margin,
                  borderRadius: cssStyles.borderRadius,
                  backgroundColor: cssStyles.backgroundColor,
                  color: cssStyles.color,
                  borderColor: cssStyles.borderColor,
                }}
              >
                {component.props.label || 'Dosya Yükle'}
              </Button>
            </label>
            {localValue && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  {localValue.length > 0 
                    ? `${localValue.length} dosya seçildi` 
                    : 'Dosya seçilmedi'}
                </Typography>
              </Box>
            )}
            {component.props.helperText && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {component.props.helperText}
              </Typography>
            )}
          </Box>
        );
        
      case 'rating':
        return (
          <Box style={cssStyles}>
            <Typography component="legend">{component.props.label || 'Değerlendirme'}</Typography>
            <Rating
              value={localValue || 0}
              onChange={(_, newValue) => handleChange(newValue)}
              disabled={component.props.disabled}
              precision={component.props.precision || 1}
              max={component.props.max || 5}
            />
            {component.props.helperText && (
              <Typography variant="caption" color="text.secondary">
                {component.props.helperText}
              </Typography>
            )}
          </Box>
        );
        
      case 'divider':
        return (
          <Divider 
            style={cssStyles} 
            orientation={component.props.orientation || 'horizontal'}
            textAlign={component.props.textAlign || 'center'}
          >
            {component.props.label && (
              <Typography variant="caption" color="text.secondary">
                {component.props.label}
              </Typography>
            )}
          </Divider>
        );
        
      case 'typography':
        return (
          <Typography 
            variant={component.props.variant || 'body1'} 
            style={cssStyles} 
            align={component.props.align || 'left'}
            color={component.props.color || 'textPrimary'}
            gutterBottom={component.props.gutterBottom}
          >
            {component.props.content || 'Metin içeriği'}
          </Typography>
        );
        
      case 'card':
        return (
          <Card style={cssStyles}>
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
            style={cssStyles}
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            {component.props.src ? (
              <img 
                src={component.props.src} 
                alt={component.props.alt || 'Görsel'} 
                style={{ maxWidth: '100%', maxHeight: '100%' }} 
              />
            ) : (
              <Typography color="text.secondary">Görsel URL'si ayarlanmamış</Typography>
            )}
          </Box>
        );
        
      case 'progress':
        return (
          <Box style={cssStyles}>
            <Typography variant="body2" gutterBottom>
              {component.props.label || 'İlerleme'}
            </Typography>
            <LinearProgress 
              variant={component.props.variant || 'determinate'} 
              value={component.props.value || 50} 
              color={component.props.color || 'primary'} 
            />
            {component.props.showValue && (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                {component.props.value || 50}%
              </Typography>
            )}
          </Box>
        );
        
      case 'accordion':
        return (
          <Accordion 
            style={cssStyles}
            defaultExpanded={component.props.defaultExpanded}
            disabled={component.props.disabled}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{component.props.title || 'Akordiyon Başlığı'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {component.props.content || 'Akordiyon içeriği burada yer alacak...'}
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
        
      case 'tabs':
        return (
          <Box style={cssStyles}>
            <Tabs 
              value={localValue || 0} 
              onChange={(_, value) => handleChange(value)}
              variant={component.props.variant || 'standard'}
              centered={component.props.centered}
              scrollButtons={component.props.scrollable ? 'auto' : false}
            >
              {(component.props.tabs || ['Sekme 1', 'Sekme 2', 'Sekme 3']).map((tab, index) => (
                <Tab key={index} label={tab} disabled={component.props.disabled} />
              ))}
            </Tabs>
            <Box sx={{ p: 2, border: 1, borderColor: 'divider', mt: 1 }}>
              <Typography>
                {component.props.contents 
                  ? (component.props.contents[localValue || 0] || `${(component.props.tabs || ['Sekme 1', 'Sekme 2', 'Sekme 3'])[localValue || 0]} içeriği`)
                  : `Sekme ${(localValue || 0) + 1} içeriği burada yer alacak...`}
              </Typography>
            </Box>
          </Box>
        );
        
      case 'container':
        return (
          <Paper 
            variant="outlined" 
            style={{ 
              ...cssStyles,
              height: '100%', 
              padding: cssStyles.padding || 16, 
              backgroundColor: cssStyles.backgroundColor || 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {component.props.content || 
              <Typography color="text.secondary">Konteyner içeriği</Typography>
            }
          </Paper>
        );
        
      case 'html':
        return (
          <Box 
            style={cssStyles}
            dangerouslySetInnerHTML={{ __html: component.props.content || '<p>HTML içeriği</p>' }}
          />
        );
        
      default:
        return <Typography>Bilinmeyen bileşen tipi: {component.type}</Typography>;
    }
  };
  
  return renderComponent();
};

export default PreviewComponent;
