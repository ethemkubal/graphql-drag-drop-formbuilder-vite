import React from 'react';
import { useDrop } from 'react-dnd';
import { Box, Paper, Typography } from '@mui/material';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import useBuilderStore from '../store/builderStore';
import ComponentRenderer from './ComponentRenderer';

interface DropItem {
  type: string;
}

const DropZone: React.FC = () => {
  const { components, addComponent, updateComponent, saveLayout } = useBuilderStore();
  
  const [{ isOver, canDrop }, drop] = useDrop<DropItem, void, { isOver: boolean; canDrop: boolean }>(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;
      
      const dropZoneRect = document.getElementById('drop-zone')?.getBoundingClientRect();
      if (!dropZoneRect) return;
      
      // Bırakılan konumu hesapla
      const x = Math.floor((offset.x - dropZoneRect.left) / 100) * 2;
      const y = Math.floor((offset.y - dropZoneRect.top) / 100) * 2;
      
      // Varsayılan genişlik ve yükseklik
      let w, h;
      
      switch (item.type) {
        case 'dataGrid':
          w = 8;
          h = 6;
          break;
        case 'chart':
          w = 6;
          h = 5;
          break;
        case 'container':
        case 'card':
          w = 6;
          h = 4;
          break;
        case 'image':
          w = 4;
          h = 4;
          break;
        case 'radio':
          w = 4;
          h = 5;
          break;
        default:
          w = 4;
          h = 2;
      }
      
      addComponent({
        type: item.type,
        x,
        y,
        w,
        h,
        props: {}
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));
  
  const handleLayoutChange = (layout: any) => {
    layout.forEach((item: any) => {
      updateComponent(item.i, {
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h
      });
    });
    saveLayout(layout);
  };
  
  return (
    <Paper
      id="drop-zone"
      ref={drop}
      variant="outlined"
      sx={{
        flex: 1,
        minHeight: 600,
        padding: 2,
        backgroundColor: isOver 
          ? 'rgba(37, 99, 235, 0.04)' 
          : canDrop 
            ? 'rgba(37, a99, 235, 0.02)' 
            : 'white',
        transition: 'all 0.2s',
        borderRadius: 2,
        borderWidth: isOver ? 2 : 1,
        borderStyle: isOver ? 'dashed' : 'solid',
        borderColor: isOver ? 'primary.main' : 'divider',
        boxShadow: isOver ? 3 : 1,
        position: 'relative',
        overflow: 'auto',
      }}
    >
      {components.length === 0 && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            color: 'text.secondary',
            zIndex: 0,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Bileşenleri buraya sürükleyin
          </Typography>
          <Typography variant="body2">
            Sayfanızı oluşturmak için soldaki bileşen kutusundan öğeleri sürükleyip bırakın
          </Typography>
        </Box>
      )}
      
      <GridLayout
        className="layout"
        cols={12}
        rowHeight={50}
        width={1200}
        onLayoutChange={handleLayoutChange}
        compactType="vertical"
        preventCollision={false}
        useCSSTransforms={true}
        margin={[12, 12]}
      >
        {components.map((component) => (
          <Box key={component.id} data-grid={{ x: component.x, y: component.y, w: component.w, h: component.h }}>
            <ComponentRenderer component={component} />
          </Box>
        ))}
      </GridLayout>
    </Paper>
  );
};

export default DropZone;
