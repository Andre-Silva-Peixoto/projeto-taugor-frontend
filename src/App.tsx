import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/login/Login';
import Registro from './pages/registro/Registro';
import PaginaInicial from './pages/paginaInicial/PaginaInicial';
import CadastrarFuncionarios from './pages/cadastrarFuncionario/CadastrarFuncionario';
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/pagina-inicial" element={<PaginaInicial />} />
          <Route path="/cadastrar-funcionarios" element={<CadastrarFuncionarios />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
