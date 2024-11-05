import React from 'react';
import { Box, Container, Typography, Button, Stack, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import DescriptionIcon from '@mui/icons-material/Description';

const PaginaInicial = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', marginTop: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Gestão de Documentos de Funcionários
        </Typography>
        
        <Typography variant="body1" paragraph>
          Bem-vindo ao sistema de gestão de documentos cadastrais! Aqui, você pode cadastrar novos funcionários, atualizar informações e gerenciar documentos de forma centralizada e organizada.
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ my: 2 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <PersonAddIcon color="primary" fontSize="large" />
            <Typography variant="subtitle1" onClick={() => navigate('/cadastrar-funcionarios')}>Cadastro de funcionário</Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <DescriptionIcon color="primary" fontSize="large" />
            <Typography variant="subtitle1">Gerenciamento</Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <LoginIcon color="primary" fontSize="large" />
            <Typography variant="subtitle1">Histórico</Typography>
          </Box>
        </Stack>

        <Stack spacing={2} direction="row" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/register')}
            sx={{ paddingX: 3 }}
          >
            Cadastro de Funcionário
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={{ paddingX: 3 }}
          >
            Acessar Conta
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default PaginaInicial;
