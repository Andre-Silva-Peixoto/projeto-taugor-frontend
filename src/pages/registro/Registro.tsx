import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TextField, Button } from '@mui/material';

const Registro: React.FC = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  //Handle click no botão de registro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password);
    } catch (error) {
      setErrorText("Erro ao registrar: " + error);
      console.error("Erro ao registrar: ", error);
    }
  };

  return (
    <div className='autenticacao-container-maior'>
      <form className='autenticacao-form' onSubmit={handleSubmit}>
        <h2>Registrar</h2>
        {errorText && <p className='autenticacao-texto-erro'>{errorText}</p>}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <p>Já tem uma conta ?</p>
        <a href='/'>Entrar já</a>
        <Button type="submit" variant="contained" color="primary">
          Registrar
        </Button>
      </form>
    </div>
  );
};

export default Registro;
