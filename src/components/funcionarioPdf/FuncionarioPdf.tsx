import React, { useEffect, useState } from 'react';
import { Funcionario } from '../../types/Funcionario';
import { PDFDocument, rgb } from 'pdf-lib';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';

export const generateFuncionarioPDF = async (funcionario: Funcionario) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const fontSize = 12;

    // Título
    page.drawText('Currículo Profissional', {
        x: 50,
        y: height - 50,
        size: 20,
        color: rgb(0, 0, 0.8),
    });

    // Informação do perfil
    const headerY = height - 100;
    page.drawText(funcionario.nome, {
        x: 50,
        y: headerY,
        size: 18,
        color: rgb(0, 0, 0),
    });

    // Foto do perfil
    if (funcionario.fotoPerfil) {
        try {
            const response = await fetch(funcionario.fotoPerfil);
            const blob = await response.blob();
            const base64Image = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
            const image = await pdfDoc.embedPng(base64Image.split(',')[1]);
            const imageDims = image.scale(0.2);
            page.drawImage(image, {
                x: width - imageDims.width - 50,
                y: headerY - imageDims.height / 2,
                width: imageDims.width,
                height: imageDims.height,
            });
        } catch (error) {
            console.error('Erro ao carregar a foto de perfil:', error);
        }
    }

    // Dados pessoais e profissionais
    page.drawText(`Sexo: ${funcionario.sexo}`, { x: 50, y: headerY - 40, size: fontSize });
    page.drawText(`Endereço: ${funcionario.endereco}`, { x: 50, y: headerY - 60, size: fontSize });
    page.drawText(`Telefone: ${funcionario.telefone}`, { x: 50, y: headerY - 80, size: fontSize });
    page.drawText(`Data de Aniversário: ${funcionario.dataAniversario ? dayjs(funcionario.dataAniversario).format('DD/MM/YYYY') : ''}`, {
        x: 50,
        y: headerY - 100,
        size: fontSize
    });
    page.drawText(`Cargo: ${funcionario.cargo}`, { x: 50, y: headerY - 140, size: fontSize });
    page.drawText(`Data de Admissão: ${funcionario.dataAdmissao ? dayjs(funcionario.dataAdmissao).format('DD/MM/YYYY') : ''}`, {
        x: 50,
        y: headerY - 160,
        size: fontSize
    });
    page.drawText(`Setor: ${funcionario.setor}`, { x: 50, y: headerY - 180, size: fontSize });
    page.drawText(`Salário: R$ ${funcionario.salario}`, { x: 50, y: headerY - 200, size: fontSize });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
};

interface FuncionarioPdfProps {
    funcionario: Funcionario;
}

const FuncionarioPdf: React.FC<FuncionarioPdfProps> = ({ funcionario }) => {
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

    const fetchImageAsBase64 = async (url: string) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const generatePDF = async () => {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();
        const fontSize = 12;

        // Title
        page.drawText('Currículo Profissional', {
            x: 50,
            y: height - 50,
            size: 20,
            color: rgb(0, 0, 0.8),
        });

        // Profile Information (Nome, Foto)
        const headerY = height - 100;
        page.drawText(funcionario.nome, {
            x: 50,
            y: headerY,
            size: 18,
            color: rgb(0, 0, 0),
        });

        // If there's a profile picture, display it
        if (funcionario.fotoPerfil) {
            try {
                const base64Image = await fetchImageAsBase64(funcionario.fotoPerfil);
                const image = await pdfDoc.embedPng(base64Image.split(',')[1]);
                const imageDims = image.scale(0.2);
                page.drawImage(image, {
                    x: width - imageDims.width - 50,
                    y: headerY - imageDims.height / 2,
                    width: imageDims.width,
                    height: imageDims.height,
                });
            } catch (error) {
                console.error('Erro ao carregar a foto de perfil:', error);
            }
        }

        // Personal Details Section
        page.drawText(`Sexo: ${funcionario.sexo}`, { x: 50, y: headerY - 40, size: fontSize });
        page.drawText(`Endereço: ${funcionario.endereco}`, { x: 50, y: headerY - 60, size: fontSize });
        page.drawText(`Telefone: ${funcionario.telefone}`, { x: 50, y: headerY - 80, size: fontSize });
        page.drawText(`Data de Aniversário: ${funcionario.dataAniversario ? dayjs(funcionario.dataAniversario).format('DD/MM/YYYY') : ''}`, {
            x: 50,
            y: headerY - 100,
            size: fontSize
        });

        // Professional Details Section
        const sectionY = headerY - 150;
        page.drawText('Informações Profissionais', {
            x: 50,
            y: sectionY,
            size: 14,
            color: rgb(0, 0, 0.7),
        });

        page.drawText(`Cargo: ${funcionario.cargo}`, { x: 50, y: sectionY - 20, size: fontSize });
        page.drawText(`Data de Admissão: ${funcionario.dataAdmissao ? dayjs(funcionario.dataAdmissao).format('DD/MM/YYYY') : ''}`, {
            x: 50,
            y: sectionY - 40,
            size: fontSize
        });
        page.drawText(`Setor: ${funcionario.setor}`, { x: 50, y: sectionY - 60, size: fontSize });
        page.drawText(`Salário: R$ ${funcionario.salario}`, { x: 50, y: sectionY - 80, size: fontSize });

        // PDF Footer (Optional)
        page.drawText('© 2024 Currículo Gerado', {
            x: width - 150,
            y: 30,
            size: 8,
            color: rgb(0.5, 0.5, 0.5),
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const pdfBlobUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(pdfBlobUrl);
    };

    const downloadPDF = () => {
        if (pdfBlobUrl) {
            const link = document.createElement('a');
            link.href = pdfBlobUrl;
            link.download = `${funcionario.nome}-Curriculo.pdf`;
            link.click();
        }
    };

    useEffect(() => {
        generatePDF();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [funcionario]);

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Preview de PDF
                </Typography>
                <Button variant="outlined" color="secondary" onClick={downloadPDF}>
                    Baixar Currículo em PDF
                </Button>
            </Box>
            {pdfBlobUrl && (
                <div>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer fileUrl={pdfBlobUrl} />
                    </Worker>
                </div>
            )}
        </div>
    );
};

export default FuncionarioPdf;