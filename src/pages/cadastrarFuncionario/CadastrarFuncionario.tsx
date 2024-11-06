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
    FormControlLabel,
    Checkbox,
    Divider,
    Stack,
    Grid2
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { getAuth } from "firebase/auth";
const apiUrl = process.env.REACT_APP_API_URL;

// Função para cadastrar funcionário
const cadastrarFuncionario = async (formData: FormFields) => {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();
        
    try {
        const response = await fetch(`${apiUrl}/cadastrar-funcionario`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`Erro ao cadastrar funcionário: ${response.statusText}`);
        }

        console.log("Funcionário cadastrado com sucesso");
        return true;
    } catch (error) {
        console.error("Erro ao cadastrar funcionário:", error);
        throw error;
    }
};

interface FormFields {
    nome: string;
    sexo: string;
    endereco: string;
    telefone: string;
    dataAniversario: string;
    cargo: string;
    dataAdmissao: string;
    setor: string;
    salario: string;
}

const CadastrarFuncionarios = () => {
    const [form, setForm] = useState<FormFields>({
        nome: '',
        sexo: '',
        endereco: '',
        telefone: '',
        dataAniversario: '',
        cargo: '',
        dataAdmissao: '',
        setor: '',
        salario: ''
    });

    const [errors, setErrors] = useState<Partial<FormFields>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let tempErrors: Partial<FormFields> = {};
        if (!form.nome) tempErrors.nome = "Nome é obrigatório";
        if (!form.cargo) tempErrors.cargo = "Cargo é obrigatório";
        if (!form.dataAdmissao) tempErrors.dataAdmissao = "Data de admissão é obrigatória";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                await cadastrarFuncionario(form);
                console.log('Formulário enviado com sucesso', form);
                // Aqui você pode resetar o formulário
                setForm({
                    nome: '',
                    sexo: '',
                    endereco: '',
                    telefone: '',
                    dataAniversario: '',
                    cargo: '',
                    dataAdmissao: '',
                    setor: '',
                    salario: ''
                });
                // Adicionar uma mensagem de sucesso para o usuário
            } catch (error) {
                console.error("Erro ao enviar o formulário:", error);
                // Tratar erro se necessário
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }} style={{ display: 'flex' }}>
            <Box sx={{ flex: 1, pr: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Fale-nos um pouco sobre você
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Diga quem você é, como os empregadores podem entrar em contato com você e qual a sua profissão.
                </Typography>

                <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
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
                                placeholder="ex. 23 Jun 1985"
                                value={form.dataAniversario}
                                onChange={handleInputChange}
                                error={!!errors.dataAniversario}
                                helperText={errors.dataAniversario}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }} alignSelf="center">
                            <Stack direction="column" alignItems="center">
                                <Avatar sx={{ width: 100, height: 100 }}>
                                    <AddPhotoAlternateIcon />
                                </Avatar>
                                <IconButton color="primary" component="label" sx={{ mt: 1 }}>
                                    <input hidden accept="image/*" type="file" />
                                    Adicionar Foto
                                </IconButton>
                                <FormControlLabel
                                    control={<Checkbox />}
                                    label="Foto Redonda"
                                />
                            </Stack>
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
                                placeholder="ex. 01 Jan 2022"
                                value={form.dataAdmissao}
                                onChange={handleInputChange}
                                error={!!errors.dataAdmissao}
                                helperText={errors.dataAdmissao}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
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
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Salário"
                                name="salario"
                                fullWidth
                                placeholder="ex. 3000"
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
    );
}

export default CadastrarFuncionarios;
