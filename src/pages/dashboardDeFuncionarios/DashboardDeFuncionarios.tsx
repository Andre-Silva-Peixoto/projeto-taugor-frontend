import React from 'react';
import { Box, Container, Typography, Button, Paper, Grid2 } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DescriptionIcon from '@mui/icons-material/Description';
const DashboardDeFuncionarios = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Gestão de Documentos de Funcionários
          </Typography>
          <Typography variant="body1" paragraph>
            Bem-vindo ao sistema de gestão de documentos cadastrais! Aqui, você pode cadastrar novos funcionários, atualizar informações e gerenciar documentos de forma centralizada e organizada.
          </Typography>

          <Grid2 container spacing={4} justifyContent="center">
            <Grid2 component={'div'} size={{xs: 12, sm: 4}}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
                fullWidth
                onClick={() => navigate('/cadastrar-funcionario')}
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
                onClick={() => navigate('/gerenciamento-de-funcionarios')}
                sx={{ padding: 2 }}
              >
                Gerenciamento de Funcionários
              </Button>
            </Grid2>
          </Grid2>
        </Paper>
      </Container>
    </Box>
  );
};

export default DashboardDeFuncionarios;
