import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TextField, Button } from '@mui/material';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [textoDeErro, setTextoDeErro] = useState('');

  //Handle click no botão de login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, senha);
      navigate("/pagina-inicial")
    } catch (error) {
      setTextoDeErro("Erro ao fazer login: " + error);
      console.error("Erro ao fazer login: ", error);
    }
  };

  return (
    <div className='autenticacao-container-maior'>
      <form className='autenticacao-form' onSubmit={handleSubmit}>
        <h2>Entrar na conta</h2>
        {textoDeErro && <p style={{ color: 'red' }}>{textoDeErro}</p>}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <p>Ainda não se cadastrou ?</p>
        <a href='/registro'>Criar uma conta já!</a>
        <Button type="submit" variant="contained" color="primary">
          Entrar
        </Button>
      </form>
    </div>
  );
};

export default Login;