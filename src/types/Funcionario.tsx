import { Dayjs } from "dayjs";
import { HistoricoItem } from "./HistoricoItem";


export interface Funcionario {
    id: string;
    nome: string;
    sexo: string;
    endereco: string;
    telefone: string;
    dataAniversario: Dayjs | null;
    cargo: string;
    dataAdmissao: Dayjs | null;
    setor: string;
    salario: string;
    fotoPerfil: string;
    historico: HistoricoItem[] | string;
}