import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { SnackbarProvider } from 'notistack';

import theme from './theme';
import DraggableToolbox from './components/DraggableToolbox';
import DropZone from './components/DropZone';
import PropertyPanel from './components/PropertyPanel';
import TopBar from './components/TopBar';
import FormPreview from './components/preview/FormPreview';
import useBuilderStore from './store/builderStore';

// Apollo client oluştur
const client = new ApolloClient({
  uri: 'https://your-graphql-endpoint.com/graphql',
  cache: new InMemoryCache()
});

function App() {
  const { initializeStore, previewSettings } = useBuilderStore();
  
  // Store'u başlat - LocalStorage'dan projeyi yüklemeyi dene
  useEffect(() => {
    initializeStore();
  }, [initializeStore]);
  
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <ApolloProvider client={client}>
          <DndProvider backend={HTML5Backend}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
              <TopBar />
              
              <Container maxWidth={false} sx={{ flex: 1, py: 3, px: { xs: 1, sm: 3 }, overflow: 'hidden' }}>
                {previewSettings.enabled ? (
                  // Önizleme modu
                  <FormPreview />
                ) : (
                  // Düzenleme modu
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    height: 'calc(100vh - 130px)',
                    flexDirection: { xs: 'column', md: 'row' }
                  }}>
                    <DraggableToolbox />
                    <DropZone />
                    <PropertyPanel />
                  </Box>
                )}
              </Container>
            </Box>
          </DndProvider>
        </ApolloProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
