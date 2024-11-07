import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/login/Login';
import Registro from './pages/registro/Registro';
import PaginaInicial from './pages/paginaInicial/PaginaInicial';
import CadastrarFuncionarios from './pages/cadastrarFuncionario/CadastrarFuncionario';
import PrivateRoute from './components/rotaPrivada/RotaPrivada';
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route path="/pagina-inicial"
            element={
              <PrivateRoute 
                element={
                  <PaginaInicial />
                }
                nomeDaPagina={'Dashboard de Funcionários'}
              />
            }
          />

          <Route path="/cadastrar-funcionario"
            element={
              <PrivateRoute 
                element={
                  <CadastrarFuncionarios />
                }
                nomeDaPagina={'Cadastrar Funcionário'}
              />
            }
          />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
