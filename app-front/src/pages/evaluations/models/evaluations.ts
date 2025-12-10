export interface EvaluationSummaryResponse {
    code: string;
    evaluationName: string;
    evaluationType: string;
    plannedDate: string;
    statusName: string;
    totalStudents: number;
    approved: number;
    failed: number;
    ungraded: number;
    averageGrade: number | null;
    maxGrade: number | null;
    minGrade: number | null;
    medianGrade: number | null;
    gradeDistribution: {
        "0-10": number;
        "11-15": number;
        "16-20": number;
    };
    statusDistribution: {
        approved: number;
        failed: number;
        ungraded: number;
    };
}



export interface EvaluationSummary {
    code: string;
    evaluationName: string;
    evaluationType: string;
    plannedDate: string;
    statusName: string;
    totalStudents: number;
    approved: number;
    failed: number;
    ungraded: number;
    averageGrade: number | null;
    maxGrade: number | null;
    minGrade: number | null;
    medianGrade: number | null;
    gradeDistribution: {
        '0-10': number;
        '11-15': number;
        '16-20': number;
    };
    statusDistribution: {
        approved: number;
        failed: number;
        ungraded: number;
    };
}



export interface TheoryConfigResponse {
    config_id: number;
    name: string;
    config_name: string;
    total_questions: number;
    notes: string;
    created_at: string;
    is_active: boolean;
}

export interface TheoryConfig {
    id: number;
    name: string;
    totalQuestions: number;
    notes: string;
    createdAt: Date;
    isActive: boolean;
}