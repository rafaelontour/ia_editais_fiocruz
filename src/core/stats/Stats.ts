export interface KpiStats {
    total_users: number;
    total_documents: number;
    total_units: number;
    total_analyses: number;
}

export interface DocumentCountByUnit {
    unit_name: string;
    document_count: number;
}
export interface DocumentCountByUnitList {
    stats: DocumentCountByUnit[];
}

export interface TypificationUsage {
    typification_name: string;
    usage_count: number;
}
export interface TypificationUsageList {
    stats: TypificationUsage[];
}



export interface IInfoBarItem {
    title: string;
    value: string | number;
}

export interface IChartData {
    tipo: string;
    valor: number;
    fill?: string;
}