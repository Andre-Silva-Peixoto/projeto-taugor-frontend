import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TextField, Button, Box, Typography, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [textoDeErro, setTextoDeErro] = useState('');
  const [formErrors, setFormErrors] = useState<{ email: string; senha: string }>({ email: '', senha: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos
    let valid = true;
    let errors = { email: '', senha: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!email) {
      errors.email = 'Por favor, insira um email.';
      valid = false;
    }else if (!emailRegex.test(email)) {
      errors.email = 'Por favor, insira um email válido.';
      valid = false;
    }

    if (!senha) {
      errors.senha = 'Por favor, insira uma senha.';
      valid = false;
    }

    if (!valid) {
      setFormErrors(errors);
      return;
    }

    // Login
    try {
      await login(email, senha);
      navigate("/pagina-inicial");
    } catch (error) {
      setTextoDeErro("Erro ao fazer login: " + error);
      console.error("Erro ao fazer login: ", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className='autenticacao-container-maior'>
      <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <LockOutlinedIcon sx={{ fontSize: 40, marginBottom: 2 }} />
        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          Entrar na Conta
        </Typography>
        {textoDeErro && <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>{textoDeErro}</Typography>}
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ marginBottom: 2 }}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ marginBottom: 2 }}
            error={!!formErrors.senha}
            helperText={formErrors.senha}
          />
          <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Ainda não se cadastrou?{' '}
              <a href="/registro" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Criar uma conta já!
              </a>
            </Typography>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ padding: '10px 0', marginTop: 2 }}
          >
            Entrar
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;