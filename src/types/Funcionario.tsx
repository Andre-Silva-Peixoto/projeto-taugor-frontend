import { HistoricoItem } from "./HistoricoItem";


export interface Funcionario {
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
    historico: HistoricoItem[] | string;
}