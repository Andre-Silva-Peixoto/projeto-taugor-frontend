import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/login/Login';
import Registro from './pages/registro/Registro';
import DashboardDeFuncionarios from './pages/dashboardDeFuncionarios/DashboardDeFuncionarios';
import CadastrarFuncionarios from './pages/cadastrarFuncionario/CadastrarFuncionario';
import PrivateRoute from './components/rotaPrivada/RotaPrivada';
import GerenciamentoDeFuncionarios from './pages/gerenciamentoDeFuncionarios/GerenciamentoDeFuncionarios';
import EditarFuncionario from './pages/editarFuncionario/EditarFuncionario';
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route path="/dashboard-de-funcionarios"
            element={
              <PrivateRoute
                element={
                  <DashboardDeFuncionarios />
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

          <Route path="/gerenciamento-de-funcionarios"
            element={
              <PrivateRoute
                element={
                  <GerenciamentoDeFuncionarios />
                }
                nomeDaPagina={'Gerenciamento de Funcionários'}
              />
            }
          />

          <Route path="/editar-funcionario"
            element={
              <PrivateRoute
                element={
                  <EditarFuncionario />
                }
                nomeDaPagina={'Editar / Visualizar Funcionário'}
              />
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
