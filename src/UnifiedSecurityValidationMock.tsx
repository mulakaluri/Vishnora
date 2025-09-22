import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Play,
  Settings as Cog,
  Zap,
  Network,
  GitBranch,
  Activity,
  Bug,
  Lock,
  ArrowRight,
  Eye,
  Terminal,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart4,
  Rocket,
  Cpu,
  Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
} from "recharts";

/**
 * Unified Security Validation — Clickable UI Mock
 * Brand placeholder; swap later. Designed for fast investor/demo iteration.
 * Pages:
 *  - Campaign Launcher
 *  - Results Dashboard
 *  - Finding Detail (with replayable PoC)
 *  - Identity Graph (attack paths)
 */

const riskTrend = [
  { day: "Mon", risk: 82 },
  { day: "Tue", risk: 78 },
  { day: "Wed", risk: 76 },
  { day: "Thu", risk: 70 },
  { day: "Fri", risk: 64 },
  { day: "Sat", risk: 66 },
  { day: "Sun", risk: 61 },
];

const findingsSeed = [
  {
    id: "F-1029",
    title: "BOLA: Unauthenticated object access on /v1/users/{id}",
    severity: "Critical",
    module: "API & GraphQL Pentest",
    service: "accounts-api",
    status: "Validated",
    time: "2025-09-18 10:22",
  },
  {
    id: "F-1037",
    title: "Excessive token scope enables lateral read to PII bucket",
    severity: "High",
    module: "Identity Path Validation",
    service: "aws-iam",
    status: "Validated",
    time: "2025-09-19 16:05",
  },
  {
    id: "F-1042",
    title: "K8s service account can escalate to cluster-admin via RoleBinding",
    severity: "High",
    module: "Kubernetes Attack Chains",
    service: "gke-prod-cluster",
    status: "Potential",
    time: "2025-09-20 09:12",
  },
  {
    id: "F-1049",
    title: "Public GitHub Actions secret exposed via PR from fork",
    severity: "Medium",
    module: "SaaS Exploit Validation",
    service: "github-ci",
    status: "Validated",
    time: "2025-09-21 13:47",
  },
];

const sevColor: Record<string, string> = {
  Critical: "bg-red-600/90",
  High: "bg-orange-500/90",
  Medium: "bg-amber-500/90",
  Low: "bg-emerald-500/90",
};

function StatCard({ icon: Icon, label, value, delta, tone = "default" }: any) {
  const toneMap: Record<string, string> = {
    default: "bg-white border",
    success: "bg-emerald-50 border-emerald-200",
    warn: "bg-amber-50 border-amber-200",
    danger: "bg-rose-50 border-rose-200",
  };
  return (
    <Card className={`rounded-2xl ${toneMap[tone]} shadow-sm hover:shadow-md transition-shadow`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {delta && (
          <p className="text-xs text-muted-foreground mt-1">{delta}</p>
        )}
      </CardContent>
    </Card>
  );
}

function RiskChart() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Risk trend</CardTitle>
        <CardDescription>Validated risk score (lower is better)</CardDescription>
      </CardHeader>
      <CardContent className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={riskTrend} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="risk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <RTooltip />
            <Area type="monotone" dataKey="risk" stroke="#22c55e" fill="url(#risk)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function FindingsTable({ items, onOpenDetail }: { items: any[]; onOpenDetail: (id: string) => void }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Recent validated findings</CardTitle>
            <CardDescription>Replayable PoCs and fix-ready playbooks</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input className="w-48" placeholder="Search findings…" />
            <Select>
              <SelectTrigger className="w-40"><SelectValue placeholder="Filter severity" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Severity</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[110px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="text-right">When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((f) => (
              <TableRow key={f.id} className="cursor-pointer" onClick={() => onOpenDetail(f.id)}>
                <TableCell className="font-medium">{f.id}</TableCell>
                <TableCell className="max-w-[420px] truncate">{f.title}</TableCell>
                <TableCell>{f.module}</TableCell>
                <TableCell>{f.service}</TableCell>
                <TableCell>
                  <Badge variant={f.status === "Validated" ? "default" : "secondary"} className="rounded-full">{f.status}</Badge>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${sevColor[f.severity] || "bg-slate-400"}`}>{f.severity}</span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{f.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AttackPathGraph() {
  // Minimal SVG graph—purely illustrative
  const nodes = [
    { id: "n1", x: 60, y: 90, label: "Public API" },
    { id: "n2", x: 220, y: 60, label: "Identity: svc-api" },
    { id: "n3", x: 380, y: 100, label: "S3 PII Bucket" },
    { id: "n4", x: 220, y: 160, label: "K8s Cluster" },
  ];
  const edges = [
    ["n1", "n2"],
    ["n2", "n3"],
    ["n2", "n4"],
  ];
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Attack path</CardTitle>
        <CardDescription>Exploit chain validated end-to-end</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-72 rounded-xl border bg-muted/40">
          <svg width="100%" height="100%" viewBox="0 0 500 260">
            {edges.map(([a, b], i) => {
              const A = nodes.find((n) => n.id === a)!;
              const B = nodes.find((n) => n.id === b)!;
              return (
                <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#94a3b8" strokeWidth={2} />
              );
            })}
            {nodes.map((n) => (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={22} fill="#111827" stroke="#22c55e" strokeWidth={2} />
                <text x={n.x} y={n.y + 40} textAnchor="middle" fontSize="12" fill="#475569">{n.label}</text>
              </g>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}

function ReplayableProof() {
  const snippet = `curl -i -X GET \n  'https://api.example.com/v1/users/123' \n  -H 'Authorization: Bearer <token_with_insufficient_scopes>'`;
  const copy = async () => {
    await navigator.clipboard.writeText(snippet);
    toast.success("Copied PoC to clipboard");
  };
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Replayable proof (PoC)</CardTitle>
        <CardDescription>Exact request to reproduce the issue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-black text-green-300 rounded-xl p-4 text-sm font-mono overflow-auto border border-slate-800">
          <pre className="whitespace-pre-wrap leading-relaxed">{snippet}</pre>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">Export as HAR · Save to Jira</div>
        <Button size="sm" onClick={copy}>
          <Terminal className="h-4 w-4 mr-2" /> Copy command
        </Button>
      </CardFooter>
    </Card>
  );
}

function FixPlaybook() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Fix playbook</CardTitle>
        <CardDescription>Minimal steps to break the attack path</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal ml-5 space-y-2 text-sm">
          <li>Restrict token scope: remove <code>users:read:any</code> from <code>svc-api</code> role.</li>
          <li>Add ABAC rule: user can only read <code>userId == token.sub</code>.</li>
          <li>Rotate token and invalidate old refresh tokens.</li>
          <li>Regression test: rerun campaign to confirm path broken.</li>
        </ol>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm">
          <FileText className="h-4 w-4 mr-2" /> Export as Jira task
        </Button>
      </CardFooter>
    </Card>
  );
}

function NewCampaignDialog({ onLaunch }: { onLaunch: (payload: any) => void }) {
  const [module, setModule] = useState("api");
  const [env, setEnv] = useState("staging");
  const [safe, setSafe] = useState(true);
  const [rate, setRate] = useState(10);
  const [notes, setNotes] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm"><Play className="h-4 w-4 mr-2" /> New campaign</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Launch new campaign</DialogTitle>
          <DialogDescription>Choose a surface and parameters. All campaigns run in safe mode by default.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Module</Label>
            <div className="col-span-3">
              <Select value={module} onValueChange={setModule}>
                <SelectTrigger><SelectValue placeholder="Select module" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="api">API & GraphQL Pentest</SelectItem>
                  <SelectItem value="identity">Identity Path Validation</SelectItem>
                  <SelectItem value="k8s">Kubernetes Attack Chains</SelectItem>
                  <SelectItem value="saas">SaaS Exploit Validation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Environment</Label>
            <div className="col-span-3">
              <Select value={env} onValueChange={setEnv}>
                <SelectTrigger><SelectValue placeholder="Select environment" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="prod">Production (shadow)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Safe mode</Label>
            <div className="col-span-3 flex items-center gap-3">
              <Switch checked={safe} onCheckedChange={setSafe} />
              <span className="text-xs text-muted-foreground">Rate-limited, non-destructive checks with canary identities</span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Rate limit</Label>
            <div className="col-span-3 flex items-center gap-3">
              <Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-28" />
              <span className="text-xs text-muted-foreground">req/sec</span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" placeholder="Context for this run (e.g., PR #482 API changes)" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => { onLaunch({ module, env, safe, rate, notes }); toast.success("Campaign launched"); }}>Launch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LauncherScreen() {
  const cards = [
    { icon: Bug, title: "API & GraphQL Pentest", desc: "Stateful fuzzing, authZ matrix, logic tests in CI.", tag: "Phase 1" },
    { icon: Lock, title: "Identity Path Validation", desc: "AD/Entra graph + safe canary actions.", tag: "Phase 1" },
    { icon: Network, title: "Kubernetes Attack Chains", desc: "Exploit chains across K8s workloads.", tag: "Phase 2" },
    { icon: Cloud, title: "SaaS Exploit Validation", desc: "Benign exploit sims in popular SaaS.", tag: "Phase 2" },
    { icon: Cpu, title: "LLM App Red-Team", desc: "OWASP LLM Top 10 test packs.", tag: "Phase 3" },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {cards.map((c, idx) => (
        <Card key={idx} className="rounded-2xl hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <c.icon className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-base">{c.title}</CardTitle>
              </div>
              <Badge variant="outline" className="rounded-full">{c.tag}</Badge>
            </div>
            <CardDescription>{c.desc}</CardDescription>
          </CardHeader>
          <CardFooter className="flex items-center justify-between">
            <Button variant="secondary" size="sm"><SettingsIcon /> Configure</Button>
            <Button size="sm"><Play className="h-4 w-4 mr-2" /> Quick run</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SettingsIcon() {
  return <Cog className="h-4 w-4 mr-2" />;
}

function DashboardScreen({ onOpenDetail }: { onOpenDetail: (id: string) => void }) {
  const [findings, setFindings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/findings");
      const data = await res.json();
      setFindings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon={ShieldCheck} label="Validated criticals" value={findings.filter(f=>f.severity==="Critical" && f.status==="Validated").length} delta="live" tone="success" />
          <StatCard icon={GitBranch} label="Paths broken" value="7" delta="demo" tone="default" />
          <StatCard icon={Zap} label="Avg. time to fix" value="2.4d" delta="demo" tone="default" />
          <StatCard icon={Activity} label="Active campaigns" value="1" delta="demo" tone="warn" />
        </div>
        <RiskChart />
        {loading ? (
          <Card className="rounded-2xl"><CardContent className="p-6 text-sm text-muted-foreground">Loading findings…</CardContent></Card>
        ) : (
          <FindingsTable items={findings} onOpenDetail={onOpenDetail} />
        )}
      </div>
      <div className="space-y-5">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Quick launch</CardTitle>
            <CardDescription>Run a safe campaign in seconds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Select defaultValue="api">
                <SelectTrigger className="w-full"><SelectValue placeholder="Module" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="api">API & GraphQL</SelectItem>
                  <SelectItem value="identity">Identity Paths</SelectItem>
                  <SelectItem value="k8s">Kubernetes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Input placeholder="Target (e.g., https://api.example.com)" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <span className="text-sm text-muted-foreground">Safe mode</span>
              </div>
              <Button size="sm" onClick={load}><Play className="h-4 w-4 mr-2" /> Refresh</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Upcoming schedules</CardTitle>
            <CardDescription>Automated weekly validations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {["API smoke (staging)", "Identity graph (prod shadow)", "K8s RBAC review"].map((name, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border p-3">
                <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{name}</span></div>
                <Badge variant="secondary" className="rounded-full">Every Tue 02:00</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <NewCampaignDialog onLaunch={() => setTimeout(load, 300)} />
      </div>
    </div>
  );
}

function FindingDetailScreen() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2 space-y-5">
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">BOLA: Unauthenticated object access</CardTitle>
                <CardDescription>API & GraphQL Pentest · accounts-api</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="rounded-full bg-red-600">Critical</Badge>
                <Badge variant="outline" className="rounded-full">Validated</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">Impact</div>
                <div className="font-medium">Read any user record</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">Exploit preconditions</div>
                <div className="font-medium">Missing ownership check</div>
              </div>
            </div>
            <Separator />
            <AttackPathGraph />
          </CardContent>
        </Card>
        <ReplayableProof />
      </div>
      <div className="space-y-5">
        <FixPlaybook />
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Validation checks</CardTitle>
            <CardDescription>Non-destructive, rate-limited</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Canary identity only</span><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
            <div className="flex items-center justify-between"><span>Data scrubbed at source</span><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
            <div className="flex items-center justify-between"><span>Write operations blocked</span><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function IdentityGraphScreen() {
  const items = [
    { id: 1, path: "svc-api → role:reader → s3:pii-bucket", severity: "High", state: "Validated" },
    { id: 2, path: "user:devops → group:ops-admin → iam:passRole", severity: "Medium", state: "Potential" },
    { id: 3, path: "workload:ci → role:artifact-reader → kms:decrypt", severity: "High", state: "Validated" },
  ];
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2 space-y-5">
        <AttackPathGraph />
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Attack paths</CardTitle>
            <CardDescription>Sorted by exploitability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between border rounded-xl p-3">
                <div className="text-sm">{it.path}</div>
                <div className="flex items-center gap-2">
                  <Badge className={`rounded-full text-white ${sevColor[it.severity]}`}>{it.severity}</Badge>
                  <Badge variant={it.state === "Validated" ? "default" : "secondary"} className="rounded-full">{it.state}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-5">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Graph filters</CardTitle>
            <CardDescription>Focus on the riskiest edges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Show validated only</span><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><span>Include SaaS identities</span><Switch /></div>
            <div className="flex items-center justify-between"><span>Cloud: AWS</span><Switch defaultChecked /></div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Content packs</CardTitle>
            <CardDescription>Adversary techniques & campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {["Ransomware initial access", "Cloud lateral movement", "K8s privilege escalation"].map((name, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border p-3">
                <span>{name}</span>
                <Button size="sm" variant="secondary">Install</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function UnifiedSecurityValidationMock() {
  const [page, setPage] = useState("dashboard");

  const Page = useMemo(() => {
    switch (page) {
      case "launcher":
        return <LauncherScreen />;
      case "finding":
        return <FindingDetailScreen />;
      case "identity":
        return <IdentityGraphScreen />;
      default:
        return <DashboardScreen onOpenDetail={() => setPage("finding")} />;
    }
  }, [page]);

  return (
    <TooltipProvider>
      <div className="min-h-[85vh] bg-gradient-to-b from-slate-50 to-white text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-emerald-600 text-white grid place-items-center shadow-sm"><ShieldCheck className="h-5 w-5" /></div>
              <div>
                <div className="text-xl font-semibold tracking-tight">Vishnora</div>
                <div className="text-xs text-muted-foreground">Autonomous Security Validation</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPage("launcher")}><Rocket className="h-4 w-4 mr-2" />Launcher</Button>
              <Button variant="ghost" size="sm" onClick={() => setPage("dashboard")}><BarChart4 className="h-4 w-4 mr-2" />Dashboard</Button>
              <Button variant="ghost" size="sm" onClick={() => setPage("identity")}><Network className="h-4 w-4 mr-2" />Identity Graph</Button>
              <NewCampaignDialog onLaunch={() => toast.success("Campaign scheduled")} />
            </div>
          </div>

          {/* Hero strip */}
          <Card className="rounded-2xl mb-6 border-emerald-100 bg-emerald-50/60">
            <CardContent className="py-5 flex items-center justify-between gap-6">
              <div>
                <div className="text-2xl font-semibold">Don’t scan. Prove.</div>
                <p className="text-sm text-muted-foreground mt-1">Run safe, continuous campaigns across APIs, identity, K8s/Cloud, and SaaS. Get replayable proof and fix-ready playbooks.</p>
              </div>
              <div className="hidden sm:block">
                <div className="rounded-xl border bg-white p-3 shadow-sm text-sm">
                  <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Safe mode</div>
                  <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Canary identities</div>
                  <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Replayable PoCs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {Page}
        </div>
      </div>
      <Toaster richColors />
    </TooltipProvider>
  );
}
