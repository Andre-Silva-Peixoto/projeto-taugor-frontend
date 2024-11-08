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
    Dialog,
    DialogActions,
    DialogTitle,
    Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { Funcionario } from '../../types/Funcionario';

const ListagemFuncionarios = () => {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [selectedFuncionarioId, setSelectedFuncionarioId] = useState<string | null>(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFuncionarios = async () => {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();

            try {
                const response = await fetch(`${apiUrl}/listar-funcionarios`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setFuncionarios(data);
            } catch (error) {
                console.error('Erro ao buscar funcionários:', error);
            }
        };

        fetchFuncionarios();
    }, [apiUrl]);

    const handleDelete = async () => {
        if (selectedFuncionarioId) {
            console.log(`Deletando funcionário com ID: ${selectedFuncionarioId}`);
            // Enviar a requisição para deletar o funcionário
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();

            try {
                await fetch(`${apiUrl}/deletar-funcionario/${selectedFuncionarioId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFuncionarios(funcionarios.filter(f => f.id !== selectedFuncionarioId));
                setConfirmDeleteDialogOpen(false);

            } catch (error) {
                console.error('Erro ao enviar requisição de deletação', error);
            }
        }
    };

    const handleEdit = (idFuncionario: string) => {
        navigate('/editar-funcionario', {
            state: {
                idFuncionario: idFuncionario,
            }
        });
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

                {funcionarios.length >= 5 &&
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
                }

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Foto</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Cargo</TableCell>
                                <TableCell>Setor</TableCell>
                                <TableCell>Salário</TableCell>
                                <TableCell align='right'>Ações</TableCell>
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
                                        <IconButton sx={{ mr: 1 }} onClick={() => handleEdit(funcionario.id)} title="Editar/Visualizar Funcionário">
                                            <VisibilityIcon />
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            sx={{ mr: 1 }}
                                            onClick={() => {
                                                setSelectedFuncionarioId(funcionario.id);
                                                setConfirmDeleteDialogOpen(true);
                                            }}
                                            title="Deletar funcionário"
                                        >
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

                {funcionarios.length >= 5 &&
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
                }
            </Paper>

            {/* Diálogo de Confirmação de Deleção */}
            <Dialog
                open={confirmDeleteDialogOpen}
                onClose={() => setConfirmDeleteDialogOpen(false)}
            >
                <DialogTitle>Você tem certeza que deseja deletar este funcionário?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteDialogOpen(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="secondary"
                    >
                        Deletar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ListagemFuncionarios;