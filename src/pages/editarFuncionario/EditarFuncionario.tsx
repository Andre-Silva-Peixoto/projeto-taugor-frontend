import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    Avatar,
    IconButton,
    Snackbar,
    Alert,
    AlertColor,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItemButton,
    Collapse,
    ListItemText,
    Grid2,
    Divider
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate, useLocation } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Funcionario } from '../../types/Funcionario';
import { HistoricoItem } from '../../types/HistoricoItem';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FuncionarioPdf from '../../components/funcionarioPdf/FuncionarioPdf';
import TextFieldDebounced from '../../components/textFieldDebounced/TextFieldDebounced';

const apiUrl = process.env.REACT_APP_API_URL;

const EditarFuncionario = () => {
    const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
    const [fotoUrl, setFotoUrl] = useState<string | null>(null);
    const [form, setForm] = useState<Funcionario>({
        id: '',
        nome: '',
        sexo: '',
        endereco: '',
        telefone: '',
        dataAniversario: dayjs(),
        cargo: '',
        dataAdmissao: dayjs(),
        setor: '',
        salario: '',
        fotoPerfil: '',
        historico: []
    });
    const [funcionarioInicial, setFuncionarioInicial] = useState<Funcionario>({
        id: '',
        nome: '',
        sexo: '',
        endereco: '',
        telefone: '',
        dataAniversario: dayjs(),
        cargo: '',
        dataAdmissao: dayjs(),
        setor: '',
        salario: '',
        fotoPerfil: '',
        historico: []
    });
    const [errorDataAdmissao, setErrorDataAdmissao] = useState(false);
    const [helperTextDataAdmissao, setHelperTextDataAdmissao] = useState('');

    const [errorDataAniversario, setErrorDataAniversario] = useState(false);
    const [helperTextDataAniversario, setHelperTextDataAniversario] = useState('');

    const [historico, setHistorico] = useState<HistoricoItem[]>([]);
    const [errors, setErrors] = useState<Partial<Funcionario>>({});
    const [openSnackbar, setOpenSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
        open: false,
        message: "",
        severity: "success"
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [historicoDialogOpen, setHistoricoDialogOpen] = useState(false);
    const [expandIndex, setExpandIndex] = useState<number | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { idFuncionario }: { idFuncionario: string } = location.state || {};

    const formatarDatas = (data: any) => {
        const dadosFormatados = { ...data };

        dadosFormatados.dataAniversario = dayjs(data.dataAniversario);
        dadosFormatados.dataAdmissao = dayjs(data.dataAdmissao);
        return dadosFormatados;
    }

    const detalharFuncionario = async () => {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken();

        try {
            const response = await fetch(`${apiUrl}/detalhar-funcionario/${idFuncionario}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            const dadosFormatados = formatarDatas(data);
            setForm(dadosFormatados);
            setFuncionarioInicial(dadosFormatados);
            setHistorico(data.historico);
        } catch (error) {
            console.error('Erro ao buscar funcionário:', error);
        }
    };

    // Converter timestamp para uma data
    const formatTimestamp = (timestamp: { _seconds: number, _nanoseconds: number }): string => {

        const date = new Date(timestamp._seconds * 1000);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // Retorna a data no formato dd/mm/yyyy mm/hh
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const editarFuncionario = async (idFuncionario: string, formData: Funcionario, fotoUrl?: string) => {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken();

        try {
            const response = await fetch(`${apiUrl}/editar-funcionario/${idFuncionario}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ ...formData, fotoPerfil: fotoUrl }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao editar funcionário: ${response.statusText}`);
            }

            console.log("Funcionário editado com sucesso");
            return true;
        } catch (error) {
            console.error("Erro ao editar funcionário:", error);
            throw error;
        }
    };



    useEffect(() => {
        detalharFuncionario();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSnackbarClose = () => {
        setOpenSnackbar({ open: false, message: "", severity: "success" });
    };

    function atualizarFormulario(campo: string, valor: string) {
        setForm((prevForm) => ({
            ...prevForm,
            [campo]: valor,
        }));
    }
    const handleSubmit = async () => {
        if (funcionarioInicial === form && !fotoPerfil) {
            setOpenSnackbar({ open: true, message: "Nenhuma alteração foi feita.", severity: "info" });
        }else{
            if (validateForm()) {
                try {
                    const formDataWithDate = {
                        ...form,
                        dataAdmissao: form.dataAdmissao ? dayjs(form.dataAdmissao) : null,
                        dataAniversario: form.dataAniversario ? dayjs(form.dataAniversario) : null
                    };
                    const url = await handleUploadFoto();
                    await editarFuncionario(idFuncionario, formDataWithDate, url ?? undefined);
                    setOpenSnackbar({ open: true, message: "Funcionário editado com sucesso!", severity: "success" });
                    setOpenDialog(true);
                } catch (error) {
                    setOpenSnackbar({ open: true, message: "Erro ao editar funcionário.", severity: "error" });
                }
            } else {
                setOpenSnackbar({ open: true, message: "Por favor, preencha todos os campos obrigatórios.", severity: "error" });
            }
        }
    };

    // Função para gerar um nome único para a imagem
    const generateUniqueFileName = (idFuncionario: string): string => {
        const timestamp = Date.now();
        return `fotoPerfil/${idFuncionario}_${timestamp}`;
    };

    // Função para realizar o upload da foto
    const handleUploadFoto = async (): Promise<string | null> => {
        if (fotoPerfil) {
            const storage = getStorage();
            const uniqueFileName = generateUniqueFileName(idFuncionario);
            const fotoRef = ref(storage, uniqueFileName);
            await uploadBytes(fotoRef, fotoPerfil);
            return await getDownloadURL(fotoRef);
        }
        return null;
    };

    const validateForm = () => {
        let tempErrors: Partial<Funcionario> = {};
        
        if (!form.nome) tempErrors.nome = "Nome é obrigatório";
        if (!form.sexo) tempErrors.sexo = "Sexo é obrigatório";
        if (!form.endereco) tempErrors.endereco = "Endereço é obrigatório";
        if (!form.telefone) tempErrors.telefone = "Telefone é obrigatório e deve ser válido (ex. 11987654321)";
    
        if (!form.dataAniversario) {
            setErrorDataAniversario(true);
            setHelperTextDataAniversario("Data de aniversário é obrigatória");
        } else {
            setErrorDataAniversario(false);
            setHelperTextDataAniversario("");
        }
    
        if (!form.dataAdmissao) {
            setErrorDataAdmissao(true);
            setHelperTextDataAdmissao("Data de Admissão é obrigatória");
        } else {
            setErrorDataAdmissao(false);
            setHelperTextDataAdmissao("");
        }
    
        if (!form.cargo) tempErrors.cargo = "Cargo é obrigatório";
        if (!form.setor) tempErrors.setor = "Setor é obrigatório";
        if (!form.salario) tempErrors.salario = "Salário é obrigatório";
    
        setErrors(tempErrors);
    
        const hasDateErrors = !form.dataAniversario || !form.dataAdmissao;
        return Object.keys(tempErrors).length === 0 && !hasDateErrors;
    };

    const handleToggleExpand = (index: number) => {
        setExpandIndex(expandIndex === index ? null : index);
    };

    const sortedHistorico = [...historico].sort((a, b) => b.data._seconds - a.data._seconds);
    useEffect(() => {
        setExpandIndex(0);
    }, []);

    const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
    
            const image = new Image();
            image.src = URL.createObjectURL(file);
    
            image.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
    
                const context = canvas.getContext("2d");
                if (context) {
                    context.drawImage(image, 0, 0);
    
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const pngFile = new File([blob], "fotoPerfil.png", { type: "image/png" });
    
                            setFotoPerfil(pngFile);
                            const pngUrl = URL.createObjectURL(pngFile);
                            setFotoUrl(pngUrl);
    
                            setForm((prevForm) => ({
                                ...prevForm,
                                fotoPerfil: pngUrl,
                            }));
    
                            URL.revokeObjectURL(image.src);
                        }
                    }, "image/png");
                }
            };
        }
    };

    //Formatar campos do histórico
    const formatFieldName = (fieldName: string): string => {
        const formatted = fieldName.replace(/([a-z])([A-Z])/g, '$1 $2');

        return formatted
            .split(' ')
            .map((word, index) => {
                if (index === 0) {
                    return capitalizeFirstLetter(word);
                }
                return word.toLowerCase();
            })
            .join(' ')
            .replace(/([A-Za-z]+) ([A-Za-z]+)/g, (match, p1, p2) => {
                return `${p1} de ${p2}`;
            });
    };

    const capitalizeFirstLetter = (word: string): string => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    };

    const formatarDataHistorico = (data: Date | any): string => {
        return dayjs(data).format("DD/MM/YYYY");
    };

    return (
        <div style={{ display: 'flex' }}>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Snackbar open={openSnackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={openSnackbar.severity} sx={{ width: '100%' }}>
                        {openSnackbar.message}
                    </Alert>
                </Snackbar>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Funcionário editado com sucesso!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            O funcionário foi editado com sucesso. Deseja continuar editando ou voltar para a lista de funcionários ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => navigate('/gerenciamento-de-funcionarios')} color="primary">Voltar para a lista de funcionários</Button>
                        <Button onClick={() => { setOpenDialog(false); detalharFuncionario() }} color="primary">Continuar editando</Button>
                        <Button onClick={() => navigate('/dashboard-de-funcionarios')} color="primary">Ir para o Dashboard</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={historicoDialogOpen} onClose={() => setHistoricoDialogOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Histórico de Alterações</DialogTitle>
                    <DialogContent dividers>
                        {sortedHistorico.length > 0 ? sortedHistorico.map((item, index) => (
                            <Box key={index} mb={2}>
                                <ListItemButton onClick={() => handleToggleExpand(index)}>
                                    <ListItemText
                                        primary={`Data: ${formatTimestamp(item.data)}`}
                                        secondary={index === 0 ? (`Última Alteração feita, alteração de ${formatFieldName(item.alteracoes[0].campo)}`) : `Alteração de ${formatFieldName(item.alteracoes[0].campo)}`}
                                    />
                                    {expandIndex === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </ListItemButton>
                                <Collapse in={expandIndex === index} timeout="auto" unmountOnExit>
                                    {item.alteracoes.map((alteracao, idx) => (
                                        <Box key={idx} sx={{ pl: 2, py: 1, borderBottom: '1px solid #ddd' }}>
                                            <Typography variant="body2">
                                                <strong>{formatFieldName(alteracao.campo)} Antigo: </strong>
                                                {alteracao.campo === 'fotoPerfil' ? (
                                                    <Avatar
                                                        alt="Foto de perfil antiga"
                                                        src={typeof alteracao.valorAntigo === 'string' ? alteracao.valorAntigo : undefined}
                                                        sx={{ width: 56, height: 56 }}
                                                    />
                                                ) : (
                                                    alteracao.campo === 'dataAniversario' || alteracao.campo === 'dataAdmissao' ? formatarDataHistorico(alteracao.valorAntigo) : alteracao.valorAntigo
                                                )}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>{formatFieldName(alteracao.campo)} Novo: </strong>
                                                {alteracao.campo === 'fotoPerfil' ? (
                                                    <Avatar
                                                        alt="Foto de perfil nova"
                                                        src={typeof alteracao.valorNovo === 'string' ? alteracao.valorNovo : undefined}
                                                        sx={{ width: 56, height: 56 }}
                                                    />
                                                ) : (
                                                    alteracao.campo === 'dataAniversario' || alteracao.campo === 'dataAdmissao' ? formatarDataHistorico(alteracao.valorNovo) : alteracao.valorNovo
                                                )}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Collapse>
                            </Box>
                        )
                        ) :
                            <Box>
                                <DialogTitle>Este funcionário ainda não teve nenhuma alteração.</DialogTitle>
                            </Box>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setHistoricoDialogOpen(false)} color="primary">Fechar</Button>
                    </DialogActions>
                </Dialog>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Editar Funcionário
                    </Typography>
                    <Button variant="outlined" color="secondary" onClick={() => setHistoricoDialogOpen(true)}>
                        Ver Histórico
                    </Button>
                </Box>

                <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Foto de perfil
                    </Typography>
                    <Box sx={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={fotoUrl ? fotoUrl : (form.fotoPerfil || '')}
                                sx={{ width: 100, height: 100, mb: 1, cursor: 'pointer' }}
                                onClick={() => document.getElementById('input-foto')?.click()}
                            >
                                <IconButton
                                    sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                >
                                    <PhotoCameraIcon sx={{ color: '#fff' }} />
                                </IconButton>
                            </Avatar>
                            <input
                                type="file"
                                id="input-foto"
                                style={{ display: 'none' }}
                                onChange={handleFotoChange}
                                accept="image/*"
                            />
                        </Box>
                    </Box>

                    {/* Campos do formulário */}
                    <Typography variant="h6" gutterBottom>
                        Informações de Contato
                    </Typography>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <TextFieldDebounced
                                label="Nome"
                                fullWidth
                                value={form.nome}
                                onChange={(v) => v}
                                changeForm={atualizarFormulario}
                                name="nome"
                                error={Boolean(errors.nome)}
                                helperText={errors.nome}

                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <TextFieldDebounced
                                label="Sexo"
                                fullWidth
                                value={form.sexo}
                                onChange={(v) => v}
                                changeForm={atualizarFormulario}
                                name="sexo"
                                error={Boolean(errors.sexo)}
                                helperText={errors.sexo}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                            <TextFieldDebounced
                                label="Endereço"
                                fullWidth
                                value={form.endereco}
                                onChange={(v) => v}
                                changeForm={atualizarFormulario}
                                name="endereco"
                                error={Boolean(errors.endereco)}
                                helperText={errors.endereco}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <TextFieldDebounced
                                label="Telefone"
                                fullWidth
                                value={form.telefone}
                                onChange={(v) => v}
                                changeForm={atualizarFormulario}
                                name="telefone"
                                error={Boolean(errors.telefone)}
                                helperText={errors.telefone}
                            />
                        </Grid2>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Data de Aniversário"
                                value={form.dataAniversario}
                                onChange={(newValue: Dayjs | null) =>
                                    setForm({
                                        ...form,
                                        dataAniversario: newValue
                                    })
                                }
                                slotProps={{
                                    textField: {
                                        error: errorDataAniversario,
                                        helperText: helperTextDataAniversario,
                                    }
                                }}
                                format='DD/MM/YYYY'
                            />
                        </LocalizationProvider>
                    </Grid2>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        Informações do Funcionário
                    </Typography>

                    <Grid2 container spacing={2} columns={12}>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <TextFieldDebounced
                                label="Cargo"
                                fullWidth
                                value={form.cargo}
                                onChange={(v) => v}
                                changeForm={atualizarFormulario}
                                name="cargo"
                                error={Boolean(errors.cargo)}
                                helperText={errors.cargo}
                            />
                        </Grid2>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Data de Admissão"
                                value={form.dataAdmissao}
                                onChange={(newValue: Dayjs | null) =>
                                    setForm({
                                        ...form,
                                        dataAdmissao: newValue
                                    })
                                }
                                slotProps={{
                                    textField: {
                                        error: errorDataAdmissao,
                                        helperText: helperTextDataAdmissao,
                                    }
                                }}
                                format='DD/MM/YYYY'
                            />
                        </LocalizationProvider>
                        <Grid2 size={{ xs: 12 }}>
                            <TextFieldDebounced
                                label="Setor"
                                fullWidth
                                value={form.setor}
                                onChange={(v) => v}
                                changeForm={atualizarFormulario}
                                name="setor"
                                error={Boolean(errors.setor)}
                                helperText={errors.setor}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                            <TextFieldDebounced
                                label="Salário"
                                fullWidth
                                value={form.salario}
                                debounceMs={300}
                                changeForm={atualizarFormulario}
                                onChange={(v) => v}
                                name="salario"
                                error={Boolean(errors.salario)}
                                helperText={errors.salario}
                            />
                        </Grid2>
                    </Grid2>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Salvar
                        </Button>
                    </Box>
                </Paper>
            </Container>
            <Container sx={{ mt: 4 }}>
                <FuncionarioPdf funcionario={form}></FuncionarioPdf>
            </Container>
        </div>
    );
};

export default EditarFuncionario;
