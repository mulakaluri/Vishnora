export type Severity = "Critical" | "High" | "Medium" | "Low";
export type FindingStatus = "Validated" | "Potential";

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  module: string;
  service: string;
  status: FindingStatus;
  time: string; // ISO or readable
}

export interface Campaign {
  id: string;
  module: "api" | "identity" | "k8s" | "saas";
  env: "staging" | "prod";
  safe: boolean;
  rate: number;
  notes?: string;
  status: "queued" | "running" | "completed" | "failed";
  createdAt: string;
}
