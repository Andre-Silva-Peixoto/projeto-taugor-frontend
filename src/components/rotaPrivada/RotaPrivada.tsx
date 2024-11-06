import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";

interface PrivateRouteProps {
  element: React.ReactNode;
}

const RotaPrivada: React.FC<PrivateRouteProps> = ({ element }) => {
  const user = getAuth().currentUser;

  // Verifica se o usuário está logado. Se não, redireciona para o login
  return user ? <>{element}</> : <Navigate to="/" />;
};

export default RotaPrivada;