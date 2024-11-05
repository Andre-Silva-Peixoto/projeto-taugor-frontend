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
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Definindo o tipo para os campos do formulário
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

// Estilos para o PDF
const styles = StyleSheet.create({
    page: {
        padding: 20,
    },
    section: {
        margin: 10,
        padding: 10,
        border: '1px solid black',
    },
});

const PDFDocument = ({ form }: { form: FormFields }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Nome: {form.nome}</Text>
                <Text>Sexo: {form.sexo}</Text>
                <Text>Endereço: {form.endereco}</Text>
                <Text>Telefone: {form.telefone}</Text>
                <Text>Data de Aniversário: {form.dataAniversario}</Text>
                <Text>Cargo: {form.cargo}</Text>
                <Text>Data de Admissão: {form.dataAdmissao}</Text>
                <Text>Setor: {form.setor}</Text>
                <Text>Salário: {form.salario}</Text>
            </View>
        </Page>
    </Document>
);

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
        if (!form.sexo) tempErrors.sexo = "Sexo é obrigatório";
        if (!form.endereco) tempErrors.endereco = "Endereço é obrigatório";
        if (!form.telefone) tempErrors.telefone = "Telefone é obrigatório";
        if (!form.dataAniversario) tempErrors.dataAniversario = "Data de aniversário é obrigatória";
        if (!form.cargo) tempErrors.cargo = "Cargo é obrigatório";
        if (!form.dataAdmissao) tempErrors.dataAdmissao = "Data de admissão é obrigatória";
        if (!form.setor) tempErrors.setor = "Setor é obrigatório";
        if (!form.salario) tempErrors.salario = "Salário é obrigatório";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Lógica de envio do formulário
            console.log('Formulário enviado com sucesso', form);
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

            <Box sx={{ flex: 1, pl: 2 }}>
                <PDFViewer width="100%" height="600px">
                    <PDFDocument form={form} />
                </PDFViewer>
            </Box>
        </Container>
    );
};

export default CadastrarFuncionarios;
