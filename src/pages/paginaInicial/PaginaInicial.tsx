import React from 'react';
import { Box, Container, Typography, Button, Paper, Grid2, Divider, ListItemButton } from '@mui/material';  // Substituído 'Grid' por 'Grid2'
import { useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import { getAuth, signOut } from 'firebase/auth';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const PaginaInicial = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Função para abrir/fechar o menu lateral
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Função de deslogar
  function Deslogar() {
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Erro ao deslogar: ', error.message);
      });
  }

  return (
    <Box>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard de Funcionários
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Menu Lateral */}
      <Drawer open={drawerOpen} onClose={toggleDrawer}>
        <List sx={{ width: 250 }}>
          <ListItemButton onClick={() => navigate('/cadastrar-funcionarios')}>
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Cadastro de Funcionário" />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/gerenciamento')}>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Gerenciamento de Funcionários" />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/historico')}>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="Histórico" />
          </ListItemButton>
          <Divider />
          <ListItemButton onClick={Deslogar}>
            <ListItemText primary="Deslogar" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Conteúdo Principal */}
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Gestão de Documentos de Funcionários
          </Typography>
          <Typography variant="body1" paragraph>
            Bem-vindo ao sistema de gestão de documentos cadastrais! Aqui, você pode cadastrar novos funcionários, atualizar informações e gerenciar documentos de forma centralizada e organizada.
          </Typography>

          <Grid2 container spacing={4} justifyContent="center"> {/* Substituído 'Grid' por 'Grid2' */}
            {/* Botões de navegação */}
            <Grid2 component={'div'} size={{xs: 12, sm: 4}}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
                fullWidth
                onClick={() => navigate('/cadastrar-funcionarios')}
                sx={{ padding: 2 }}
              >
                Cadastro de Funcionário
              </Button>
            </Grid2>
            <Grid2 component={'div'} size={{xs: 12, sm: 4}}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DescriptionIcon />}
                fullWidth
                onClick={() => navigate('/gerenciamento')}
                sx={{ padding: 2 }}
              >
                Gerenciamento
              </Button>
            </Grid2>
            <Grid2 component={'div'} size={{xs: 12, sm: 4}}>
              <Button
                variant="contained"
                color="success"
                startIcon={<HistoryIcon />}
                fullWidth
                onClick={() => navigate('/historico')}
                sx={{ padding: 2 }}
              >
                Histórico
              </Button>
            </Grid2>
          </Grid2>
        </Paper>
      </Container>
    </Box>
  );
};

export default PaginaInicial;
