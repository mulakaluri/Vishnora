import { Campaign, Finding } from "./types";

class Store {
  findings: Finding[] = [
    {
      id: "F-1029",
      title: "BOLA: Unauthenticated object access on /v1/users/{id}",
      severity: "Critical",
      module: "API & GraphQL Pentest",
      service: "accounts-api",
      status: "Validated",
      time: new Date().toISOString(),
    },
  ];

  campaigns: Campaign[] = [];

  addCampaign(c: Campaign) {
    this.campaigns.unshift(c);
  }
  listCampaigns() {
    return this.campaigns;
  }
  addFinding(f: Finding) {
    this.findings.unshift(f);
  }
  listFindings() {
    return this.findings;
  }
}

// keep data across dev hot-reloads
const g = globalThis as unknown as { __VISHNORA_STORE?: Store };
export const store = g.__VISHNORA_STORE || (g.__VISHNORA_STORE = new Store());
