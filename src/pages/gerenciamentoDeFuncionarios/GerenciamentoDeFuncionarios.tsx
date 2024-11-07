import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Avatar,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

interface Funcionario {
    id: string;
    nome: string;
    sexo: string;
    endereco: string;
    telefone: string;
    dataAniversario: string;
    cargo: string;
    dataAdmissao: string;
    setor: string;
    salario: string;
    fotoPerfil: string;
}

const ListagemFuncionarios = () => {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const response = await fetch(`${apiUrl}/listar-funcionarios`);
                const data = await response.json();
                setFuncionarios(data);
            } catch (error) {
                console.error('Erro ao buscar funcionários:', error);
            }
        };

        fetchFuncionarios();
    }, [apiUrl]);

    const handleDelete = (id: string) => {
        console.log(`Deletando funcionário com ID: ${id}`);
    };

    const handleEdit = (id: string) => {
        navigate(`/editar-funcionario/${id}`);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ mt: 2, padding: 2 }}>
                <TablePagination
                    component="div"
                    count={funcionarios.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage="Funcionários por página"
                    sx={{ alignSelf: 'flex-start', mb: 2 }}
                />

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Foto</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Cargo</TableCell>
                                <TableCell>Setor</TableCell>
                                <TableCell>Salário</TableCell>
                                <TableCell align='right'>Gerenciar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {funcionarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((funcionario) => (
                                <TableRow key={funcionario.id}>
                                    <TableCell>
                                        <Avatar src={funcionario.fotoPerfil} alt={funcionario.nome} />
                                    </TableCell>
                                    <TableCell>{funcionario.nome}</TableCell>
                                    <TableCell>{funcionario.cargo}</TableCell>
                                    <TableCell>{funcionario.setor}</TableCell>
                                    <TableCell>{funcionario.salario}</TableCell>
                                    <TableCell align='right'>
                                        <IconButton onClick={() => handleEdit(funcionario.id)} title="Editar/Visualizar Funcionário">
                                            <VisibilityIcon fontSize="small" style={{ marginLeft: 10 }} />
                                            <EditIcon fontSize="small" style={{ position: 'absolute' }} />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(funcionario.id)} title="Deletar funcionário">
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton title="Baixar o perfil do funcionário como PDF">
                                            <PictureAsPdfIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <TablePagination
                        component="div"
                        count={funcionarios.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        labelRowsPerPage="Funcionários por página"
                    />
                </Box>
            </Paper>
        </Container>
    );
};

export default ListagemFuncionarios;
