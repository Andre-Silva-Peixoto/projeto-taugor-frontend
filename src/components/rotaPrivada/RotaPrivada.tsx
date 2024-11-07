import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import MenuLateral from '../menuLateral/MenuLateral';

interface PrivateRouteProps {
  element: React.ReactNode;
  nomeDaPagina: string;
}

const RotaPrivada: React.FC<PrivateRouteProps> = ({ element, nomeDaPagina }) => {
  const user = getAuth().currentUser;

  return user ? (
    <>
      <MenuLateral nomeDaPagina={nomeDaPagina} />
        {element}
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default RotaPrivada;
