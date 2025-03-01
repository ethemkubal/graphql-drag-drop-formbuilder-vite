import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Slider,
  Grid,
  Divider,
  Button,
} from '@mui/material';
import { ChromePicker } from 'react-color';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import { Component, ComponentStyles } from '../../types';
import useBuilderStore from '../../store/builderStore';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface StyleEditorProps {
  component: Component;
}

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
      id={`style-tabpanel-${index}`}
      aria-labelledby={`style-tab-${index}`}
      {...other}
      style={{ padding: '16px', height: 'calc(100% - 49px)', overflow: 'auto' }}
    >
      {value === index && children}
    </div>
  );
}

const borderStyles = [
  'none',
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
];

const fontOptions = [
  { label: 'Sistem Fontu', value: 'inherit' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Open Sans', value: '"Open Sans", sans-serif' },
];

const fontWeights = [
  { label: 'Normal', value: 'normal' },
  { label: 'Bold', value: 'bold' },
  { label: 'Lighter', value: 'lighter' },
  { label: 'Bolder', value: 'bolder' },
  { label: '100', value: '100' },
  { label: '200', value: '200' },
  { label: '300', value: '300' },
  { label: '400', value: '400' },
  { label: '500', value: '500' },
  { label: '600', value: '600' },
  { label: '700', value: '700' },
  { label: '800', value: '800' },
  { label: '900', value: '900' },
];

const StyleEditor: React.FC<StyleEditorProps> = ({ component }) => {
  const { updateComponent } = useBuilderStore();
  const [tabValue, setTabValue] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [cssEditorContent, setCssEditorContent] = useState(component.styles?.customCSS || '');

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const updateStyle = (property: keyof ComponentStyles, value: any) => {
    const currentStyles = component.styles || {};
    updateComponent(component.id, {
      styles: {
        ...currentStyles,
        [property]: value,
      },
    });
  };

  const handleCustomCssChange = (css: string) => {
    setCssEditorContent(css);
  };

  const applyCustomCss = () => {
    const currentStyles = component.styles || {};
    updateComponent(component.id, {
      styles: {
        ...currentStyles,
        customCSS: cssEditorContent,
      },
    });
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Tipografi" />
        <Tab label="Renkler" />
        <Tab label="Düzen" />
        <Tab label="Kenarlık" />
        <Tab label="Özel CSS" />
      </Tabs>

      {/* Tipografi */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="font-family-label">Yazı Tipi</InputLabel>
              <Select
                labelId="font-family-label"
                value={component.styles?.fontFamily || 'inherit'}
                label="Yazı Tipi"
                onChange={(e) => updateStyle('fontFamily', e.target.value)}
              >
                {fontOptions.map((font) => (
                  <MenuItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="font-weight-label">Kalınlık</InputLabel>
              <Select
                labelId="font-weight-label"
                value={component.styles?.fontWeight || 'normal'}
                label="Kalınlık"
                onChange={(e) => updateStyle('fontWeight', e.target.value)}
              >
                {fontWeights.map((weight) => (
                  <MenuItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Yazı Boyutu"
              margin="dense"
              value={component.styles?.fontSize || '16px'}
              onChange={(e) => updateStyle('fontSize', e.target.value)}
              placeholder="16px"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Hizalama</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant={component.styles?.textAlign === 'left' ? 'contained' : 'outlined'}
                onClick={() => updateStyle('textAlign', 'left')}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <FormatAlignLeftIcon />
              </Button>
              <Button
                variant={component.styles?.textAlign === 'center' ? 'contained' : 'outlined'}
                onClick={() => updateStyle('textAlign', 'center')}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <FormatAlignCenterIcon />
              </Button>
              <Button
                variant={component.styles?.textAlign === 'right' ? 'contained' : 'outlined'}
                onClick={() => updateStyle('textAlign', 'right')}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <FormatAlignRightIcon />
              </Button>
              <Button
                variant={component.styles?.textAlign === 'justify' ? 'contained' : 'outlined'}
                onClick={() => updateStyle('textAlign', 'justify')}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <FormatAlignJustifyIcon />
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Satır Yüksekliği</Typography>
            <Slider
              value={parseFloat(component.styles?.lineHeight || '1.5')}
              min={1}
              max={3}
              step={0.1}
              onChange={(_, value) => updateStyle('lineHeight', value.toString())}
              valueLabelDisplay="auto"
              marks={[
                { value: 1, label: '1' },
                { value: 1.5, label: '1.5' },
                { value: 2, label: '2' },
                { value: 2.5, label: '2.5' },
                { value: 3, label: '3' },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Harf Aralığı</Typography>
            <Slider
              value={parseFloat(component.styles?.letterSpacing || '0')}
              min={-2}
              max={10}
              step={0.5}
              onChange={(_, value) => updateStyle('letterSpacing', `${value}px`)}
              valueLabelDisplay="auto"
              marks={[
                { value: -2, label: '-2px' },
                { value: 0, label: '0' },
                { value: 5, label: '5px' },
                { value: 10, label: '10px' },
              ]}
            />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Renkler */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Metin Rengi</Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => setShowColorPicker(showColorPicker === 'textColor' ? null : 'textColor')}
            >
              <Box 
                sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bgcolor: component.styles?.color || 'inherit',
                  border: '1px solid rgba(0,0,0,0.1)',
                  mr: 2
                }} 
              />
              <Typography>{component.styles?.color || 'Varsayılan'}</Typography>
            </Box>
            {showColorPicker === 'textColor' && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <ChromePicker
                  color={component.styles?.color || '#000000'}
                  onChange={(color) => updateStyle('color', color.hex)}
                  disableAlpha={false}
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Arkaplan Rengi</Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => setShowColorPicker(showColorPicker === 'bgColor' ? null : 'bgColor')}
            >
              <Box 
                sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bgcolor: component.styles?.backgroundColor || 'transparent',
                  border: '1px solid rgba(0,0,0,0.1)',
                  mr: 2
                }} 
              />
              <Typography>{component.styles?.backgroundColor || 'Şeffaf'}</Typography>
            </Box>
            {showColorPicker === 'bgColor' && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <ChromePicker
                  color={component.styles?.backgroundColor || '#ffffff'}
                  onChange={(color) => updateStyle('backgroundColor', color.hex)}
                  disableAlpha={false}
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Opaklık</Typography>
            <Slider
              value={component.styles?.opacity !== undefined ? component.styles.opacity * 100 : 100}
              min={0}
              max={100}
              step={5}
              onChange={(_, value) => updateStyle('opacity', (value as number) / 100)}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
              marks={[
                { value: 0, label: '0%' },
                { value: 50, label: '50%' },
                { value: 100, label: '100%' },
              ]}
            />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Düzen */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>İç Boşluk (Padding)</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Üst"
                  margin="dense"
                  placeholder="8px"
                  value={component.styles?.paddingTop || component.styles?.padding || '8px'}
                  onChange={(e) => updateStyle('paddingTop', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Sağ"
                  margin="dense"
                  placeholder="8px"
                  value={component.styles?.paddingRight || component.styles?.padding || '8px'}
                  onChange={(e) => updateStyle('paddingRight', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Alt"
                  margin="dense"
                  placeholder="8px"
                  value={component.styles?.paddingBottom || component.styles?.padding || '8px'}
                  onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Sol"
                  margin="dense"
                  placeholder="8px"
                  value={component.styles?.paddingLeft || component.styles?.padding || '8px'}
                  onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => {
                    const padding = component.styles?.paddingTop || '8px';
                    updateStyle('padding', padding);
                    updateStyle('paddingTop', undefined);
                    updateStyle('paddingRight', undefined);
                    updateStyle('paddingBottom', undefined);
                    updateStyle('paddingLeft', undefined);
                  }}
                >
                  Tüm Kenarları Eşitle
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Dış Boşluk (Margin)</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Üst"
                  margin="dense"
                  placeholder="0px"
                  value={component.styles?.marginTop || component.styles?.margin || '0px'}
                  onChange={(e) => updateStyle('marginTop', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Sağ"
                  margin="dense"
                  placeholder="0px"
                  value={component.styles?.marginRight || component.styles?.margin || '0px'}
                  onChange={(e) => updateStyle('marginRight', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Alt"
                  margin="dense"
                  placeholder="0px"
                  value={component.styles?.marginBottom || component.styles?.margin || '0px'}
                  onChange={(e) => updateStyle('marginBottom', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Sol"
                  margin="dense"
                  placeholder="0px"
                  value={component.styles?.marginLeft || component.styles?.margin || '0px'}
                  onChange={(e) => updateStyle('marginLeft', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => {
                    const margin = component.styles?.marginTop || '0px';
                    updateStyle('margin', margin);
                    updateStyle('marginTop', undefined);
                    updateStyle('marginRight', undefined);
                    updateStyle('marginBottom', undefined);
                    updateStyle('marginLeft', undefined);
                  }}
                >
                  Tüm Kenarları Eşitle
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Boyutlandırma</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Genişlik"
                  margin="dense"
                  placeholder="auto"
                  value={component.styles?.width || 'auto'}
                  onChange={(e) => updateStyle('width', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Yükseklik"
                  margin="dense"
                  placeholder="auto"
                  value={component.styles?.height || 'auto'}
                  onChange={(e) => updateStyle('height', e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Kenarlık */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="border-style-label">Kenarlık Stili</InputLabel>
              <Select
                labelId="border-style-label"
                value={component.styles?.borderStyle || 'solid'}
                label="Kenarlık Stili"
                onChange={(e) => updateStyle('borderStyle', e.target.value)}
              >
                {borderStyles.map((style) => (
                  <MenuItem key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Kenarlık Genişliği"
              margin="dense"
              placeholder="1px"
              value={component.styles?.borderWidth || '1px'}
              onChange={(e) => updateStyle('borderWidth', e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Köşe Yuvarlaklığı"
              margin="dense"
              placeholder="4px"
              value={component.styles?.borderRadius || '4px'}
              onChange={(e) => updateStyle('borderRadius', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Kenarlık Rengi</Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => setShowColorPicker(showColorPicker === 'borderColor' ? null : 'borderColor')}
            >
              <Box 
                sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bgcolor: component.styles?.borderColor || '#e0e0e0',
                  border: '1px solid rgba(0,0,0,0.1)',
                  mr: 2
                }} 
              />
              <Typography>{component.styles?.borderColor || '#e0e0e0'}</Typography>
            </Box>
            {showColorPicker === 'borderColor' && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <ChromePicker
                  color={component.styles?.borderColor || '#e0e0e0'}
                  onChange={(color) => updateStyle('borderColor', color.hex)}
                  disableAlpha={false}
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Gölge</Typography>
            <TextField
              fullWidth
              label="Box Shadow"
              margin="dense"
              placeholder="0px 2px 4px rgba(0,0,0,0.1)"
              value={component.styles?.boxShadow || 'none'}
              onChange={(e) => updateStyle('boxShadow', e.target.value)}
            />
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="outlined"
                size="small"
                onClick={() => updateStyle('boxShadow', 'none')}
                sx={{ mr: 1 }}
              >
                Yok
              </Button>
              <Button 
                variant="outlined"
                size="small"
                onClick={() => updateStyle('boxShadow', '0px 2px 4px rgba(0,0,0,0.1)')}
                sx={{ mr: 1 }}
              >
                Hafif
              </Button>
              <Button 
                variant="outlined"
                size="small"
                onClick={() => updateStyle('boxShadow', '0px 4px 8px rgba(0,0,0,0.1)')}
                sx={{ mr: 1 }}
              >
                Orta
              </Button>
              <Button 
                variant="outlined"
                size="small"
                onClick={() => updateStyle('boxShadow', '0px 8px 16px rgba(0,0,0,0.1)')}
              >
                Yoğun
              </Button>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Özel CSS */}
      <TabPanel value={tabValue} index={4}>
        <Typography variant="subtitle1" gutterBottom>Özel CSS Yazın</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          CSS kod parçaları yazarak bileşeni daha fazla özelleştirebilirsiniz. Bu CSS doğrudan bileşene uygulanacaktır.
        </Typography>
        
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
          <SyntaxHighlighter 
            language="css" 
            style={docco}
            customStyle={{ 
              margin: 0, 
              borderRadius: '4px',
              minHeight: '150px',
            }}
            wrapLongLines={true}
          >
            {cssEditorContent}
          </SyntaxHighlighter>
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={8}
          value={cssEditorContent}
          onChange={(e) => handleCustomCssChange(e.target.value)}
          placeholder={`/* Örnek CSS */\ndisplay: flex;\njustify-content: center;\nalign-items: center;\ntransition: all 0.3s ease;`}
          sx={{ mb: 2 }}
        />
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={applyCustomCss}
          fullWidth
        >
          CSS'i Uygula
        </Button>
      </TabPanel>
    </Box>
  );
};

export default StyleEditor;
