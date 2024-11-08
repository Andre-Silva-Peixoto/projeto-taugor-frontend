import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    IconButton,
    Divider,
    Snackbar,
    Alert,
    AlertColor,
    Grid2,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { Funcionario } from '../../types/Funcionario';

const apiUrl = process.env.REACT_APP_API_URL;

const CadastrarFuncionarios = () => {
    const [idFuncionario, setIdFuncionario] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
    const [fotoUrl, setFotoUrl] = useState<string | null>(null);
    const [form, setForm] = useState<Funcionario>({
        id: '',
        nome: '',
        sexo: '',
        endereco: '',
        telefone: '',
        dataAniversario: '',
        cargo: '',
        dataAdmissao: '',
        setor: '',
        salario: '',
        fotoPerfil: '',
        historico: []
    });

    const cadastrarFuncionario = async (formData: Funcionario, fotoUrl?: string) => {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken();
    
        try {
            const response = await fetch(`${apiUrl}/cadastrar-funcionario`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ ...formData, fotoPerfil: fotoUrl }),
            });
    
            if (!response.ok) {
                throw new Error(`Erro ao cadastrar funcionário: ${response.statusText}`);
            }
    
            if(response.ok){
                const data = await response.json();

                setIdFuncionario(data.id);
            }
            console.log("Funcionário cadastrado com sucesso");
            return true;
        } catch (error) {
            console.error("Erro ao cadastrar funcionário:", error);
            throw error;
        }
    };

    const [errors, setErrors] = useState<Partial<Funcionario>>({});
    const [openSnackbar, setOpenSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
        open: false,
        message: "",
        severity: "success"
    });
    const [openDialog, setOpenDialog] = useState(false); // Estado para o popup de confirmação
    const navigate = useNavigate();

    const handleSnackbarClose = () => {
        setOpenSnackbar({ open: false, message: "", severity: "success" });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let tempErrors: Partial<Funcionario> = {};
        if (!form.nome) tempErrors.nome = "Nome é obrigatório";
        if (!form.sexo) tempErrors.sexo = "Sexo é obrigatório";
        if (!form.endereco) tempErrors.endereco = "Endereço é obrigatório";
        if (!form.telefone) tempErrors.telefone = "Telefone é obrigatório e deve ser válido (ex. 11987654321)";
        if (!form.dataAniversario) tempErrors.dataAniversario = "Data de Aniversário é obrigatória";
        if (!form.cargo) tempErrors.cargo = "Cargo é obrigatório";
        if (!form.dataAdmissao) tempErrors.dataAdmissao = "Data de Admissão é obrigatória";
        if (!form.setor) tempErrors.setor = "Setor é obrigatório";
        if (!form.salario) tempErrors.salario = "Salário é obrigatório";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleUploadFoto = async () => {
        if (fotoPerfil) {
            const storage = getStorage();
            const fotoRef = ref(storage, `fotoPerfil/${fotoPerfil.name}`);
            await uploadBytes(fotoRef, fotoPerfil);
            const url = await getDownloadURL(fotoRef);
            setFotoUrl(url);
            return url;
        }
        return null;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const url = await handleUploadFoto();
                await cadastrarFuncionario(form, url ?? undefined);
                setOpenSnackbar({ open: true, message: "Funcionário cadastrado com sucesso!", severity: "success" });
                setOpenDialog(true);
            } catch (error) {
                setOpenSnackbar({ open: true, message: "Erro ao cadastrar funcionário.", severity: "error" });
            }
        } else {
            setOpenSnackbar({ open: true, message: "Por favor, preencha todos os campos obrigatórios.", severity: "error" });
        }
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFotoPerfil(e.target.files[0]);
            setFotoUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    // Funções de navegação
    const handleVoltarDashboard = () => {
        setOpenDialog(false);
        navigate('/dashboard-de-funcionarios');
    };

    const handleVerFuncionario = () => {
        setOpenDialog(false);
        navigate('/editar-funcionario', {
            state: {
              idFuncionario: idFuncionario,
            }
          });
    };

    const handleCadastrarOutro = () => {
        setForm({
            id: '',
            nome: '',
            sexo: '',
            endereco: '',
            telefone: '',
            dataAniversario: '',
            cargo: '',
            dataAdmissao: '',
            setor: '',
            salario: '',
            fotoPerfil: '',
            historico: []
        });
        setFotoPerfil(null);
        setFotoUrl(null);
        setOpenDialog(false);
    };

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, display: 'flex' }}>
                <Snackbar open={openSnackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={openSnackbar.severity} sx={{ width: '100%' }}>
                        {openSnackbar.message}
                    </Alert>
                </Snackbar>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Funcionário cadastrado com sucesso!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            O funcionário foi cadastrado com sucesso. Deseja cadastrar outro ou voltar para o dashboard?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleVoltarDashboard} color="primary">Voltar para o dashboard</Button>
                        <Button onClick={handleVerFuncionario} color="primary">Ver funcionário cadastrado</Button>
                        <Button onClick={handleCadastrarOutro} color="primary">Cadastrar outro funcionário</Button>
                    </DialogActions>
                </Dialog>

                <Box sx={{ flex: 1, pr: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Fale-nos um pouco sobre você
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Diga quem você é, como os empregadores podem entrar em contato com você e qual a sua profissão.
                    </Typography>

                    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Foto de perfil
                        </Typography>
                        <Box sx={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={fotoUrl || ''}
                                    sx={{ width: 100, height: 100, mb: 1, cursor: 'pointer' }}
                                    onClick={() => document.getElementById('input-foto')?.click()}
                                >
                                    <IconButton
                                        sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                    >
                                        <PhotoCameraIcon sx={{ color: 'white' }} />
                                    </IconButton>
                                </Avatar>
                                <input
                                    id="input-foto"
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    onChange={handleFotoChange}
                                />
                            </Box>
                            <Typography variant="body2">Adicionar foto</Typography>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                            Informações de Contato
                        </Typography>
                        <Grid2 container spacing={2} columns={12} alignItems="center">
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Nome"
                                    name="nome"
                                    fullWidth
                                    value={form.nome}
                                    onChange={handleInputChange}
                                    error={!!errors.nome}
                                    helperText={errors.nome}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Sexo"
                                    name="sexo"
                                    fullWidth
                                    value={form.sexo}
                                    onChange={handleInputChange}
                                    error={!!errors.sexo}
                                    helperText={errors.sexo}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12 }}>
                                <TextField
                                    label="Endereço"
                                    name="endereco"
                                    fullWidth
                                    value={form.endereco}
                                    onChange={handleInputChange}
                                    error={!!errors.endereco}
                                    helperText={errors.endereco}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Telefone"
                                    name="telefone"
                                    fullWidth
                                    value={form.telefone}
                                    onChange={handleInputChange}
                                    error={!!errors.telefone}
                                    helperText={errors.telefone}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Data de Aniversário"
                                    name="dataAniversario"
                                    fullWidth
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={form.dataAniversario}
                                    onChange={handleInputChange}
                                    error={!!errors.dataAniversario}
                                    helperText={errors.dataAniversario}
                                />
                            </Grid2>
                        </Grid2>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom>
                            Informações do Funcionário
                        </Typography>

                        <Grid2 container spacing={2} columns={12}>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Cargo"
                                    name="cargo"
                                    fullWidth
                                    value={form.cargo}
                                    onChange={handleInputChange}
                                    error={!!errors.cargo}
                                    helperText={errors.cargo}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Data de Admissão"
                                    name="dataAdmissao"
                                    fullWidth
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={form.dataAdmissao}
                                    onChange={handleInputChange}
                                    error={!!errors.dataAdmissao}
                                    helperText={errors.dataAdmissao}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12 }}>
                                <TextField
                                    label="Setor"
                                    name="setor"
                                    fullWidth
                                    value={form.setor}
                                    onChange={handleInputChange}
                                    error={!!errors.setor}
                                    helperText={errors.setor}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12 }}>
                                <TextField
                                    label="Salário"
                                    name="salario"
                                    fullWidth
                                    InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
                                    value={form.salario}
                                    onChange={handleInputChange}
                                    error={!!errors.salario}
                                    helperText={errors.salario}
                                />
                            </Grid2>
                        </Grid2>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Salvar
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </>
    );
};

export default CadastrarFuncionarios;