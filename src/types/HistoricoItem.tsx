export interface Alteracao {
    campo: string;
    valorAntigo: string | number;
    valorNovo: string | number;
}
export interface CustomTimestamp {
    _seconds: number;
    _nanoseconds: number;
}
export interface HistoricoItem {
    data: CustomTimestamp;
    alteracoes: Alteracao[];
}