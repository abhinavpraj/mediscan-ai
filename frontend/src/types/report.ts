export type StructuredReport = {
  patient_name: string;
  age: number | null;
  gender: string | null;
  report_type: string;
  hemoglobin: number | null;
  glucose: number | null;
  cholesterol: string | null;
  blood_pressure: string | null;
  medications: string[];
  risk_flags: string[];
  recommendation: string;
  overall_risk?: string | null;
  clinical_summary?: string[];
  recommendations?: string[];
  parameters?: any[];
  abnormal_parameters?: any[];
};

export type Report = {
  id: number;
  patient_name: string;
  age: number | null;
  gender: string | null;
  report_type: string;
  raw_text: string;
  structured_json: StructuredReport;
  source_filename: string;
  created_at: string;
  overall_risk?: string | null;
  clinical_summary?: string[];
  recommendations?: string[];
  parameters?: any[];
  abnormal_parameters?: any[];
  processed_at?: string | null;
};

