import { store } from "./store";
import { Campaign, Finding } from "./types";

let counter = 1050;

export function runSimulation(c: Campaign) {
  // For demo: immediately create a sample finding per module
  const now = new Date();
  const id = `F-${counter++}`;

  const samples: Record<Campaign["module"], Omit<Finding,"id"|"time">> = {
    api: {
      title: "BOLA: IDOR on /v1/orders/{id}",
      severity: "Critical",
      module: "API & GraphQL Pentest",
      service: "orders-api",
      status: "Validated",
    },
    identity: {
      title: "Over-privileged role enables S3 PII read",
      severity: "High",
      module: "Identity Path Validation",
      service: "aws-iam",
      status: "Validated",
    },
    k8s: {
      title: "ServiceAccount can escalate via RoleBinding",
      severity: "High",
      module: "Kubernetes Attack Chains",
      service: "gke-prod-cluster",
      status: "Potential",
    },
    saas: {
      title: "Public link exposure in Drive folder",
      severity: "Medium",
      module: "SaaS Exploit Validation",
      service: "google-workspace",
      status: "Validated",
    },
  };

  const f: Finding = { id, time: now.toISOString(), ...samples[c.module] };
  store.addFinding(f);
}
