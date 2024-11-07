import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TextField, Button, Box, Typography, Paper, Container, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';

const Registro: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Regex email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Regex senha (mínimo de 5 caracteres com letras e números)
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{5,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError('');
    setPasswordError('');
    let valid = true;

    // Validação do email
    if(!email) {
      setEmailError('Por favor, insira um email.');
      valid = false;
    }else if (!emailRegex.test(email)) {
      setEmailError('Por favor, insira um email válido.');
      valid = false;
    }

    // Validação da senha
    if (!password) {
      setPasswordError('Por favor, insira uma senha.');
      valid = false;
    }else if (!passwordRegex.test(password)) {
      setPasswordError('A senha deve ter pelo menos 5 caracteres e conter letras e números.');
      valid = false;
    }

    //Registro
    if(valid){
      try {
        await register(email, password);
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        setErrorText('Erro ao registrar: ' + error);
        console.error('Erro ao registrar: ', error);
      }
    }else{
      return
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs" className='autenticacao-container-maior'>
      <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <PersonAddAltOutlinedIcon sx={{ fontSize: 40, marginBottom: 2 }} />
        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          Criar Conta
        </Typography>
        {errorText && <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>{errorText}</Typography>}
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
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ marginBottom: 2 }}
            error={!!passwordError}
            helperText={passwordError}
          />
          <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Já tem uma conta?{' '}
              <a href="/" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Entrar já!
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
            Registrar
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        message="Conta criada com sucesso!"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{
          bottom: 50,
        }}
      />
    </Container>
  );
};

export default Registro;