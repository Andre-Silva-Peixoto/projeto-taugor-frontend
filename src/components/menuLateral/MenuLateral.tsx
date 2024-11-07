import React from 'react';
import { AppBar, Divider, IconButton, ListItemButton, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import { getAuth, signOut } from 'firebase/auth';
import { Drawer, List, ListItemText, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';

interface MenuLateralProps {
    nomeDaPagina: string;
}

const MenuLateral: React.FC<MenuLateralProps> = ({ nomeDaPagina }) => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [menuAberto, setMenuAberto] = React.useState(false);

    // Função para abrir/fechar o menu lateral
    const alternarMenu = () => {
        setMenuAberto(!menuAberto);
    };

    // Função de deslogar
    function Deslogar() {
        signOut(auth)
            .then(() => {
                navigate('/');
            })
            .catch((erro) => {
                console.error('Erro ao deslogar: ', erro.message);
            });
    }

    // Função para fechar o menu ao navegar
    const navegarPara = (caminho: string) => {
        navigate(caminho);
        setMenuAberto(false); // Fecha o menu ao mudar de página
    };

    return (
        <>
            <AppBar position="sticky" color="primary">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={alternarMenu}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {nomeDaPagina}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer open={menuAberto} onClose={alternarMenu}>
                <List sx={{ width: 250 }}>

                    <ListItemButton onClick={() => navegarPara('/pagina-inicial')}>
                        <ListItemIcon>
                            <DashboardIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Dashboard de Funcionários" />
                    </ListItemButton>

                    <Divider />

                    <ListItemButton onClick={() => navegarPara('/cadastrar-funcionario')}>
                        <ListItemIcon>
                            <PersonAddIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cadastro de Funcionário" />
                    </ListItemButton>

                    <ListItemButton onClick={() => navegarPara('/gerenciamento-de-funcionarios')}>
                        <ListItemIcon>
                            <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gerenciamento de Funcionários" />
                    </ListItemButton>

                    <ListItemButton onClick={() => navegarPara('/historico')}>
                        <ListItemIcon>
                            <HistoryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Histórico" />
                    </ListItemButton>

                    <Divider />

                    <ListItemButton onClick={Deslogar}>
                        <ListItemText primary="Deslogar" />
                    </ListItemButton>

                </List>
            </Drawer>
        </>
    );
};

export default MenuLateral;