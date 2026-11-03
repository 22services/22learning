/* Dynatrace Chalkboard Masterclass — lessons 7 to 12 (short edition).
   Scene fields: t title · e emoji · k kid picture (on screen) · n narration (spoken + captions)
   v visual {flow|stack|compare|chips|code} · w "check it at work" tip for a Managed tenant
   img [file, caption, official source page] · **text** = official term. */
window.EPISODES = (window.EPISODES || []).concat([
 {
  "id": 7,
  "phase": "Phase III · Engineering and automation",
  "minutes": 9,
  "title": "Kubernetes and cloud observability",
  "blurb": "Containers, Kubernetes objects, the Dynatrace Operator and DynaKube, OpenShift, AWS, Azure, GCP.",
  "scenes": [
   {
    "t": "Containers: lunch boxes for programs",
    "e": "🍱",
    "k": "A lunch box holds everything for lunch: the sandwich, the fork, the napkin. Open it anywhere, lunch is the same.",
    "n": "A **container** packages an app and its libraries. It is isolated by **namespaces** and limited by **cgroups**, and it shares the host kernel. A container that hits its memory limit is **OOMKilled**, even if the host has free memory.",
    "v": {
     "type": "compare",
     "cols": [
      [
       "Virtual machine",
       [
        "Own guest OS and kernel",
        "Heavier, slower to start",
        "Long-lived, named servers"
       ]
      ],
      [
       "Container",
       [
        "Shares host kernel",
        "namespaces (isolation) + cgroups (limits)",
        "Short-lived, many per host, OOMKilled at limit"
       ]
      ]
     ]
    },
    "w": "Your menu has Containers. Check whether any hosts run Docker or Podman workloads."
   },
   {
    "t": "Kubernetes: the school principal",
    "e": "🏫",
    "k": "The principal decides which class each child sits in, replaces a sick teacher, and keeps the right number of children in each room.",
    "n": "The **Kubernetes control plane**, meaning the API server, scheduler, controllers and **etcd**, decides what runs where. **Nodes** run **pods**. **Deployments**, **StatefulSets** and **DaemonSets** keep pods running. **Namespaces** separate teams.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🧠",
       "Control plane",
       "API server · scheduler · controllers · etcd",
       "hot"
      ],
      [
       "🖥️",
       "Nodes",
       "kubelet · container runtime"
      ],
      [
       "📦",
       "Workloads",
       "Deployment · StatefulSet · DaemonSet · Job"
      ],
      [
       "🫛",
       "Pods",
       "one or more containers, shared network"
      ],
      [
       "🏷️",
       "Namespaces + labels",
       "team / app separation"
      ]
     ]
    },
    "w": "Infrastructure Observability → Kubernetes. Is any cluster connected? If not, OpenShift may be monitored elsewhere."
   },
   {
    "t": "The Dynatrace Operator and DynaKube",
    "e": "🤖",
    "k": "A robot helper lives in the school. You give it one instruction card, and it puts a spy in every classroom by itself.",
    "n": "On Kubernetes you install the **Dynatrace Operator** with **Helm**, then create a **DynaKube** resource. It sets the mode, the **ActiveGate** for Kubernetes API monitoring, and which namespaces to include. The Operator keeps everything in that desired state.",
    "v": {
     "type": "code",
     "lang": "bash + yaml · Operator",
     "code": "helm install dynatrace-operator oci://public.ecr.aws/dynatrace/dynatrace-operator \\\n  --create-namespace --namespace dynatrace --atomic\n\n# DynaKube (check the apiVersion supported by your Operator version)\napiVersion: dynatrace.com/v1beta3\nkind: DynaKube\nmetadata: { name: prod-eu, namespace: dynatrace }\nspec:\n  apiUrl: https://abc12345.live.dynatrace.com/api\n  oneAgent:\n    cloudNativeFullStack: {}          # per-pod injection + host monitoring\n  activeGate:\n    capabilities: [kubernetes-monitoring, routing]\n    resources: { requests: { cpu: 500m, memory: 1.5Gi } }",
     "note": "Tokens go in a Secret named like the DynaKube (apiToken, dataIngestToken). Never commit them."
    },
    "w": "If a cluster exists, ask to read its DynaKube YAML in Git. It is a perfect interview talking point."
   },
   {
    "t": "Deployment modes on Kubernetes",
    "e": "🎛️",
    "k": "You can watch the whole school, only certain classrooms, or only the building walls.",
    "n": "Modes: **cloudNativeFullStack**, the usual default, gives nodes plus pod injection through a **webhook** and **CSI driver**. **applicationMonitoring** injects pods only. **hostMonitoring** watches nodes only. Existing pods need a restart to be injected.",
    "v": {
     "type": "chips",
     "items": [
      [
       "cloudNativeFullStack",
       "Nodes + webhook injection into pods. Usual default"
      ],
      [
       "applicationMonitoring",
       "Pod injection only. No host agent. Restricted platforms"
      ],
      [
       "hostMonitoring",
       "Nodes only, infrastructure view"
      ],
      [
       "classicFullStack",
       "Older DaemonSet approach"
      ],
      [
       "Namespace selector",
       "Choose which namespaces get injected"
      ],
      [
       "Webhook + CSI driver",
       "How code modules reach pods"
      ]
     ],
     "note": "**Gotcha:** pods started before the Operator need a restart (rollout restart) to be injected."
    },
    "w": "Kubernetes page → cluster settings shows which mode and Operator version is in use.",
    "img": [
     "cloud-native-fullstack.webp",
     "Official diagram of cloud-native full-stack injection.",
     "https://docs.dynatrace.com/docs/ingest-from/setup-on-k8s/how-it-works/cloud-native-fullstack"
    ]
   },
   {
    "t": "What you see: the Kubernetes app",
    "e": "🔭",
    "k": "From the principal's office you can see every class, every child, and who is feeling sick.",
    "n": "The **Kubernetes app** shows clusters, nodes, namespaces, workloads and pods, with **throttling**, memory against **limits**, **restarts** and **OOM kills**. Teach clients that **requests** drive scheduling and **limits** apply at runtime.",
    "v": {
     "type": "code",
     "lang": "DQL · Kubernetes",
     "code": "// Containers killed for memory in the last 24h, by namespace and workload\nfetch events, from: now() - 24h\n| filter k8s.namespace.name != \"kube-system\"\n| filter contains(toString(event.name), \"OOM\") or contains(toString(event.reason), \"OOM\")\n| summarize kills = count(), by: { k8s.namespace.name, k8s.workload.name }\n| sort kills desc",
     "note": "Event field names differ between sources. Inspect a sample first, then refine the filter."
    },
    "w": "Managed has the classic Kubernetes pages. The new app shown here is SaaS.",
    "img": [
     "k8s-health.webp",
     "The Kubernetes app (SaaS) with cluster health signals.",
     "https://docs.dynatrace.com/docs/observe/infrastructure-observability/kubernetes-app"
    ]
   },
   {
    "t": "OpenShift specifics",
    "e": "🎩",
    "k": "Same school, stricter rules: every helper needs a special badge before entering.",
    "n": "**OpenShift** installs the certified Operator from **OperatorHub**. Expect **Security Context Constraints**, projects with policy, routes, and **image mirroring** for air-gapped clusters.",
    "v": {
     "type": "chips",
     "items": [
      [
       "OperatorHub",
       "Install the certified Dynatrace Operator"
      ],
      [
       "SCC",
       "Security Context Constraints: permissions for agent pods"
      ],
      [
       "Projects",
       "Namespaces with policy"
      ],
      [
       "Image mirroring",
       "Air-gapped clusters need an internal registry"
      ],
      [
       "Routes",
       "OpenShift ingress model"
      ],
      [
       "Monitoring stack",
       "Coexists with built-in Prometheus"
      ]
     ]
    },
    "w": "Banks often run OpenShift. Ask whether yours does, and how Dynatrace is deployed there."
   },
   {
    "t": "AWS, Azure and Google Cloud",
    "e": "☁️",
    "k": "Some toys are rented from big toy shops. You cannot put a spy inside, but the shop sends you a report card.",
    "n": "Managed cloud services are monitored through APIs. **AWS** uses an **IAM role** and CloudWatch **Metric Streams**. **Azure** uses a **service principal**. **GCP** uses a **service account**. Logs arrive through Firehose, Event Hubs or Pub/Sub.",
    "v": {
     "type": "compare",
     "cols": [
      [
       "Agent-based (inside)",
       [
        "EC2, Azure VMs, GCE: OneAgent",
        "EKS, AKS, GKE: Operator + DynaKube",
        "Lambda / Functions: layers or OTel"
       ]
      ],
      [
       "API-based (outside)",
       [
        "AWS: IAM role + CloudWatch / Metric Streams",
        "Azure: service principal + Monitor",
        "GCP: service account + Cloud Monitoring",
        "Logs: Firehose · Event Hubs · Pub/Sub"
       ]
      ]
     ],
     "note": "Cloud tags become Dynatrace tags. Agree a tagging policy (app, team, env, cost-centre) at the start."
    },
    "w": "Your menu lists AWS, Azure and GCP. Open each one to see whether an integration is configured."
   },
   {
    "t": "Production scenario: pods restarting at night",
    "e": "🌙",
    "k": "Every night at two, one child falls asleep in class. Is it the child, the room, or the timetable?",
    "n": "Pods restart every night at two? Check the restart reason, memory against the limit, what runs at two, the last traces and logs, and node pressure. Then fix limits, a leak or the schedule. Tell it as a story with evidence.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "1️⃣",
       "Restart reason",
       "OOMKilled vs liveness probe failure"
      ],
      [
       "2️⃣",
       "Memory vs limit",
       "working set trend before each restart",
       "hot"
      ],
      [
       "3️⃣",
       "What runs at 02:00?",
       "CronJob, backup, batch, other time zone"
      ],
      [
       "4️⃣",
       "Traces and logs",
       "last requests and errors before restart"
      ],
      [
       "5️⃣",
       "Node pressure",
       "evictions, noisy neighbours",
       "warn"
      ]
     ]
    },
    "w": "Swap pods for your batch servers and you get the same method for a classic night-time incident."
   }
  ],
  "quiz": [
   {
    "q": "What does the Dynatrace Operator use to know what to deploy?",
    "o": [
     "A DynaKube custom resource",
     "A Grafana dashboard",
     "A crontab"
    ],
    "a": 0,
    "why": "The Operator reconciles the DynaKube spec into running components."
   },
   {
    "q": "Which mode is usually recommended for full observability on Kubernetes?",
    "o": [
     "hostMonitoring",
     "cloudNativeFullStack",
     "None"
    ],
    "a": 1,
    "why": "It combines node monitoring and pod injection via webhook and CSI driver."
   },
   {
    "q": "How does Dynatrace monitor AWS managed services like RDS?",
    "o": [
     "By installing OneAgent inside RDS",
     "Through the AWS integration with an IAM role and CloudWatch data",
     "It cannot"
    ],
    "a": 1,
    "why": "Managed services are monitored through cloud APIs."
   }
  ],
  "interview": [
   {
    "q": "Design Dynatrace monitoring for 12 EKS clusters across 3 regions.",
    "a": "Operator via **Helm** or **GitOps (Argo CD)**, one **DynaKube** per cluster from a template, **cloudNativeFullStack**, ActiveGate per cluster with **kubernetes-monitoring** and **routing**, **network zones** per region. Namespace selectors to exclude system namespaces if needed. Tag from **k8s labels** (team, app, env). **AWS integration** for managed services, logs via OneAgent or Firehose with **OpenPipeline** routing to buckets. Config as code for alerting and segments. Validate token handling via secrets manager, and test upgrades in a non-prod cluster first."
   },
   {
    "q": "Security team refuses privileged DaemonSets. What can you offer?",
    "a": "Explain what the host agent needs and why, then offer **applicationMonitoring** mode: pod-level injection only, no host agent, so less privilege but no full host visibility. Complement node metrics with the **Kubernetes API monitoring** via ActiveGate and, if needed, OTel or Prometheus scraping. Document the visibility gaps clearly so the decision is informed."
   }
  ]
 },
 {
  "id": 8,
  "phase": "Phase IV · Advanced capabilities",
  "minutes": 8,
  "title": "Davis analytics, SLOs and alerting design",
  "blurb": "Anomaly detection settings, metric events, SLOs, alert routing and a problem management process.",
  "scenes": [
   {
    "t": "Three ways to detect trouble",
    "e": "🚦",
    "k": "You can notice danger three ways: a smoke alarm with a fixed level, a parent who knows your usual mood, or a friend who learns patterns over time.",
    "n": "Three detection styles: **built-in anomaly detection**; **metric events**, or **custom alerts**, using static, auto-adaptive or seasonal models; and **anomaly detectors** on Grail. Choose the simplest model that fits the signal.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🏗️",
       "Built-in anomaly detection",
       "Services, apps, hosts, k8s · tune per entity or tag"
      ],
      [
       "📐",
       "Metric events / custom alerts",
       "static · auto-adaptive · seasonal baseline",
       "hot"
      ],
      [
       "🔎",
       "Anomaly detectors on Grail",
       "DQL query + model, on a schedule"
      ],
      [
       "📤",
       "Custom events via API",
       "External tools push events into Davis"
      ]
     ]
    },
    "w": "Settings → Anomaly detection → Metric events. Count how many custom alerts your team created."
   },
   {
    "t": "Tuning without breaking things",
    "e": "🎻",
    "k": "You tune a guitar string a little at a time. Too tight, it snaps. Too loose, no music.",
    "n": "Tune sensitivity for **response time**, **failure rate** and **traffic**, globally, by tag or per service. Use a **sliding window** to ignore single spikes. Tune with evidence from last month, and store the changes as code.",
    "v": {
     "type": "chips",
     "items": [
      [
       "Response time",
       "Absolute + relative degradation thresholds"
      ],
      [
       "Failure rate",
       "Auto baseline or fixed %"
      ],
      [
       "Traffic",
       "Drops and spikes"
      ],
      [
       "Sliding window",
       "e.g. 3 of 5 samples to alert"
      ],
      [
       "Scope",
       "Global → tag → single service"
      ],
      [
       "Evidence",
       "Review last month's problems before tuning"
      ]
     ]
    },
    "w": "Pick the noisiest service from last month and look at its anomaly detection settings."
   },
   {
    "t": "SLOs: promises with numbers",
    "e": "🤝",
    "k": "You promise mum to be home on time 99 days out of 100. That one late day is your \"error budget\".",
    "n": "An **SLI** measures good behaviour. An **SLO** sets the target, like ninety nine point five percent over twenty eight days. The **error budget** is the remainder, and **burn rate** shows how fast you spend it.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "📏",
       "SLI",
       "good requests / total requests"
      ],
      [
       "🎯",
       "SLO",
       "99.5% over 28 days",
       "hot"
      ],
      [
       "💰",
       "Error budget",
       "0.5% of requests may fail or be slow"
      ],
      [
       "🔥",
       "Burn rate",
       "2× = budget gone in 14 days → alert",
       "warn"
      ]
     ]
    },
    "w": "Your menu has Service-Level Objectives. Check whether any exist and what they measure."
   },
   {
    "t": "Alert routing that people trust",
    "e": "📬",
    "k": "The right letter to the right house. Nobody likes getting someone else's mail at three in the morning.",
    "n": "Routing matters as much as detection. Classic uses **alerting profiles** plus **problem notifications**. The new platform uses **Workflows** triggered by problems. Route by ownership **tags**, so the right team is woken.",
    "v": {
     "type": "flow",
     "nodes": [
      [
       "📦",
       "Problem",
       "opened by Davis"
      ],
      [
       "🏷️",
       "Ownership",
       "tags: team, env, app"
      ],
      [
       "🧭",
       "Filter",
       "profile or workflow"
      ],
      [
       "📟",
       "Route",
       "PagerDuty · Teams · ITSM"
      ],
      [
       "🔁",
       "Feedback",
       "close loop · postmortem"
      ]
     ]
    },
    "w": "Settings → Alerting → Alerting profiles and Problem notifications. Map who gets what."
   },
   {
    "t": "Change events make Davis smarter",
    "e": "📝",
    "k": "If you tell the doctor \"I ate shrimp at lunch\", he finds the cause of the tummy ache much faster.",
    "n": "Send **deployment events** from CI/CD through the **Events API**. Davis then shows the change as evidence: this started five minutes after release one point four. A cheap, valuable week-one win.",
    "v": {
     "type": "code",
     "lang": "bash · Events API v2",
     "code": "curl -X POST \"$DT_URL/api/v2/events/ingest\" \\\n  -H \"Authorization: Api-Token $DT_TOKEN\" -H \"Content-Type: application/json\" \\\n  -d '{\n    \"eventType\": \"CUSTOM_DEPLOYMENT\",\n    \"title\": \"checkout 1.4.0 deployed\",\n    \"entitySelector\": \"type(SERVICE),tag(app:checkout),tag(env:prod)\",\n    \"properties\": { \"dt.event.deployment.version\": \"1.4.0\",\n                    \"dt.event.deployment.release_stage\": \"production\",\n                    \"ci.pipeline\": \"gitlab#18233\" }\n  }'",
     "note": "Token scope: **events.ingest**."
    },
    "w": "Open the Releases page in your menu. Empty means nobody sends deployment events yet: an easy improvement.",
    "img": [
     "problem-deployment.webp",
     "A problem with a deployment highlighted as the root cause (SaaS).",
     "https://docs.dynatrace.com/docs/dynatrace-intelligence/problems-app"
    ]
   },
   {
    "t": "Problem management, end to end",
    "e": "🔁",
    "k": "When something breaks: notice, call the right helper, fix it, then learn so it does not happen again.",
    "n": "End to end: Davis opens a problem, an **ITSM** incident is created for the owner, the engineer diagnoses, the incident closes with the problem, and a **postmortem** follows. Track **MTTD**, **MTTA** and **MTTR**.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🔎",
       "Detect",
       "Davis problem · MTTD"
      ],
      [
       "📨",
       "Notify",
       "workflow → ITSM incident · MTTA"
      ],
      [
       "🛠️",
       "Diagnose + fix",
       "problem page, traces, notebook · MTTR",
       "hot"
      ],
      [
       "✅",
       "Close",
       "auto-update incident"
      ],
      [
       "📚",
       "Learn",
       "postmortem → change as code"
      ]
     ]
    },
    "w": "Your Tools links mention Resolving Incidents. Trace how a Dynatrace problem reaches that tool."
   }
  ],
  "quiz": [
   {
    "q": "An SLO of 99.9% over 30 days leaves an error budget of…",
    "o": [
     "0.1% of the measured events",
     "9.9%",
     "Nothing"
    ],
    "a": 0,
    "why": "Budget = 100% − target."
   },
   {
    "q": "What helps Davis link a problem to a release?",
    "o": [
     "A deployment event sent from the pipeline",
     "A bigger dashboard",
     "Turning off baselines"
    ],
    "a": 0,
    "why": "Change events are evidence Davis attaches to problems on the same entities."
   },
   {
    "q": "You need a fixed contractual limit of 2 s response time. Which model?",
    "o": [
     "Static threshold",
     "Seasonal baseline only",
     "No alert"
    ],
    "a": 0,
    "why": "Contracts and hard limits suit static thresholds; baselines suit unknown normal behaviour."
   }
  ],
  "interview": [
   {
    "q": "How do you design alerting for a client with 200 services and 30 teams?",
    "a": "Start from **ownership**: tags for team, app, env from k8s labels or cloud tags. Define **severity levels** and which ones page. Use **workflows** or **alerting profiles** per team with filters and delays; send low severity to chat, high to on-call. Add **SLOs** with **burn-rate alerts** for critical user journeys. Integrate **ITSM**. Deploy everything as code. Review monthly: noisy problems, unrouted problems, MTTA."
   },
   {
    "q": "What is the difference between an event and a problem in Dynatrace?",
    "a": "An **event** is a single detected occurrence on an entity (slowdown, error rate increase, process crash, custom event, deployment). A **problem** is Davis's correlated story: it groups related events across the topology over time, determines **root cause** and **impact**, and has a lifecycle (open, closed). Notifications are normally driven by problems, which is why one incident gives one alert instead of fifty."
   }
  ]
 },
 {
  "id": 9,
  "phase": "Phase IV · Advanced capabilities",
  "minutes": 7,
  "title": "AppEngine, Workflows and automation",
  "blurb": "Custom apps with the App Toolkit, app functions, the SDK, and AutomationEngine workflows.",
  "scenes": [
   {
    "t": "AppEngine: apps inside Dynatrace",
    "e": "🧩",
    "k": "You can build your own LEGO pieces and click them into the big Dynatrace castle.",
    "n": "**AppEngine** runs custom apps inside Dynatrace with secure access to **Grail**, settings and automation. Apps use **TypeScript**, **React** and the **Strato** design system. Server logic runs in **app functions**.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🖼️",
       "UI",
       "React + Strato design system",
       "hot"
      ],
      [
       "⚙️",
       "App functions",
       "Serverless TypeScript in the platform"
      ],
      [
       "📦",
       "SDK clients",
       "query, documents, settings, automation"
      ],
      [
       "🗄️",
       "Grail + platform services",
       "with the user's IAM permissions"
      ]
     ]
    },
    "w": "SaaS only."
   },
   {
    "t": "Your first app in five commands",
    "e": "🛠️",
    "k": "Like a cake mix: open the box, mix, bake, taste, and share.",
    "n": "Create an app with **npx dt-app create**, run it locally with npm run start, query Grail with the SDK, then **npm run deploy**. Because it is TypeScript, it fits the same CI/CD pipeline as other code.",
    "v": {
     "type": "code",
     "lang": "bash + tsx · App Toolkit",
     "code": "npx dt-app@latest create --environment-url https://abc12345.apps.dynatrace.com\ncd my-ops-cockpit && npm run start      # local dev against your tenant\nnpm run deploy                          # publish to the environment\n\n// ui/app/pages/Errors.tsx (simplified)\nimport { useDqlQuery } from \"@dynatrace-sdk/react-hooks\";\nconst { data, isLoading } = useDqlQuery({ body: { query:\n  'fetch logs | filter loglevel == \"ERROR\" | summarize c = count(), by: { k8s.namespace.name }' } });",
     "note": "Package names and helpers change across SDK versions. Generate a fresh app and follow its README."
    },
    "w": "SaaS only. Try it in the trial tenant."
   },
   {
    "t": "Workflows: the automatic helper",
    "e": "🤖",
    "k": "When the alarm rings, a robot automatically calls the plumber, opens the window and writes in the diary.",
    "n": "**Workflows** pair a **trigger**, such as a problem, an event or a schedule, with **tasks**: DQL, JavaScript, HTTP, or integrations like **Slack**, **Jira**, **ServiceNow** and **Ansible**. Dynatrace goes from seeing problems to fixing them.",
    "v": {
     "type": "flow",
     "nodes": [
      [
       "⏰",
       "Trigger",
       "problem · event · schedule"
      ],
      [
       "🔎",
       "DQL task",
       "gather context"
      ],
      [
       "🧠",
       "JS task",
       "decide"
      ],
      [
       "📨",
       "Integration",
       "Slack · Jira · ServiceNow"
      ],
      [
       "🔧",
       "Remediation",
       "Ansible · HTTP"
      ]
     ]
    },
    "w": "Managed has no Workflows. The classic equivalent is problem notifications plus webhooks, for example to Ansible.",
    "img": [
     "workflow-action.webp",
     "A workflow action that annotates problems and links tickets (SaaS).",
     "https://docs.dynatrace.com/docs/dynatrace-intelligence/problems-app"
    ]
   },
   {
    "t": "Example: auto-remediation with guardrails",
    "e": "🛡️",
    "k": "The robot may restart the music box, but only twice, and only if a grown-up said yes.",
    "n": "Auto-remediation needs guardrails: a narrow trigger, a DQL check, **approval** in production, **idempotent** actions, and a record of every action. A remediation that fails silently is worse than none.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🎯",
       "Narrow trigger",
       "problem category + root cause type + env:nonprod"
      ],
      [
       "🔎",
       "Confirm with DQL",
       "is it really the disk?"
      ],
      [
       "✋",
       "Approval for prod",
       "human in the loop",
       "warn"
      ],
      [
       "🔧",
       "Idempotent action",
       "Ansible job / HTTP call",
       "hot"
      ],
      [
       "📝",
       "Record + notify",
       "event on entity, message to team"
      ]
     ]
    },
    "w": "Ask whether any Ansible job is ever triggered by a monitoring alert, and what guardrails exist."
   },
   {
    "t": "Business use cases",
    "e": "🛒",
    "k": "The doctor can also count how many cookies the bakery sold, and notice when sales suddenly drop.",
    "n": "**Business events** follow orders, payments and their value. Combined with traces, you can say: this slowdown cost twelve thousand euros. Technical signals plus business impact gets budget approved.",
    "v": {
     "type": "code",
     "lang": "DQL · business events",
     "code": "fetch bizevents, from: now() - 24h\n| filter event.type == \"com.shop.checkout.completed\"\n| makeTimeseries revenue = sum(amount), orders = count(), interval: 15m",
     "note": "Event type names and fields are defined by the client. Agree a **business event schema** early."
    },
    "w": "Business events are built on Grail, so this is SaaS. At work, think which WebSphere transactions would make good business events."
   }
  ],
  "quiz": [
   {
    "q": "Where does AppEngine server-side logic run?",
    "o": [
     "In app functions hosted by the platform",
     "On the user's laptop only",
     "Inside OneAgent"
    ],
    "a": 0,
    "why": "App functions are serverless functions running in the Dynatrace platform."
   },
   {
    "q": "Which is NOT a workflow trigger type?",
    "o": [
     "Davis problem",
     "Schedule",
     "A DQL fetch command inside a dashboard tile"
    ],
    "a": 2,
    "why": "Triggers are events, problems, schedules or manual/API; DQL is used inside tasks."
   },
   {
    "q": "What is the most important guardrail for auto-remediation in production?",
    "o": [
     "Run as often as possible",
     "Approval step, narrow trigger and idempotent actions",
     "Hide the logs"
    ],
    "a": 1,
    "why": "Automation must be safe, scoped and auditable."
   }
  ],
  "interview": [
   {
    "q": "Give me one automation you would build in the first month for a client.",
    "a": "A **problem → ITSM** workflow: when Davis opens a production problem, look up the owner from **tags**, create a **ServiceNow incident** with title, root cause, impact and link, post to the team channel, and update or resolve the incident when the problem closes. Low risk, high value, measurable (MTTA). Second candidate: **deployment events** from every pipeline."
   },
   {
    "q": "When would you build a custom AppEngine app instead of a dashboard?",
    "a": "When users need **interaction or logic** a dashboard cannot provide: forms, write-back to settings, multi-step flows, combining Dynatrace data with an **external API** via app functions, or a tailored experience for a non-technical audience. If it is read-only charts, a **Dashboard** or **Notebook** is cheaper to build and maintain."
   }
  ]
 },
 {
  "id": 10,
  "phase": "Phase IV · Advanced capabilities",
  "minutes": 8,
  "title": "Licensing, cost and platform optimisation",
  "blurb": "DPS rate card vs classic DDU and host units, cost drivers, volume control and a health check.",
  "scenes": [
   {
    "t": "How Dynatrace is paid for",
    "e": "🧾",
    "k": "A phone plan: you pay for minutes, messages and internet. Use more, pay more. Knowing the plan saves money.",
    "n": "**DPS**, the platform subscription, is an annual commitment consumed through a **rate card**. **Classic licensing** uses **host units** and **Davis Data Units**. Know both, and never invent prices; they come from the contract.",
    "v": {
     "type": "compare",
     "cols": [
      [
       "DPS (current)",
       [
        "Annual commitment, consumption-based",
        "Rate card per capability",
        "e.g. Full-Stack by memory GiB-hours",
        "Logs: ingest, retain, query separately"
       ]
      ],
      [
       "Classic",
       [
        "Host units (by host memory)",
        "DEM units for user experience",
        "DDUs for custom metrics, logs, events",
        "Still on many existing contracts"
       ]
      ]
     ]
    },
    "w": "Managed usually means classic licensing. Ask whether your contract counts host units and DDUs."
   },
   {
    "t": "The main cost drivers",
    "e": "🎯",
    "k": "Most of the phone bill comes from two or three things. Find them first.",
    "n": "The usual cost drivers: **Full-Stack** by host memory over time, **log** ingest, retention and queries, **real user** and **synthetic**, **custom metrics** with high cardinality, and trace volume.",
    "v": {
     "type": "chips",
     "items": [
      [
       "Full-Stack (GiB-hour)",
       "Monitored host memory over time"
      ],
      [
       "Infrastructure",
       "Lighter rate per host"
      ],
      [
       "Logs",
       "Ingest + retain (GiB-day) + query (GiB scanned)"
      ],
      [
       "RUM / synthetic",
       "Sessions and test executions"
      ],
      [
       "Custom metrics",
       "Number of series; watch cardinality"
      ],
      [
       "Traces",
       "Volume beyond included amounts"
      ]
     ]
    },
    "w": "Your global health tile counts thousands of hosts. At that scale, consumption is a real topic.",
    "img": [
     "usage-overview.webp",
     "The ready-made Usage Overview dashboard (SaaS, DPS).",
     "https://docs.dynatrace.com/docs/manage-your-costs/view/usage-dashboards"
    ]
   },
   {
    "t": "Ten levers to control volume",
    "e": "🎚️",
    "k": "Turn off the lights in rooms nobody uses. Keep the lights on where people work.",
    "n": "Levers: **Infrastructure** mode where code-level detail is not needed, drop and route logs in **OpenPipeline**, extract metrics from logs, control **cardinality**, tune RUM and synthetic, and avoid double ingestion.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🎚️",
       "Monitoring mode per host group",
       "Full-Stack only where it pays"
      ],
      [
       "🧹",
       "OpenPipeline drop + route",
       "noise out, right bucket",
       "hot"
      ],
      [
       "📈",
       "Metrics from logs",
       "dashboards stop scanning logs"
      ],
      [
       "🔢",
       "Cardinality control",
       "no IDs as metric dimensions",
       "warn"
      ],
      [
       "🌐",
       "RUM / synthetic tuning",
       "sampling, frequency, locations"
      ],
      [
       "🔁",
       "No double ingestion",
       "one owner per signal"
      ]
     ]
    },
    "w": "Which of your AIX, Solaris or Windows host groups really need Full-Stack?"
   },
   {
    "t": "Platform performance and hygiene",
    "e": "🧽",
    "k": "A tidy room is faster to play in. A messy room hides the toy you need.",
    "n": "Hygiene: current agent versions, removed stale hosts and tokens, fixed **service detection** sprawl, scaled ActiveGates, consistent **tags**. A quarterly **health check** is a great consulting deliverable.",
    "v": {
     "type": "chips",
     "items": [
      [
       "Versions",
       "OneAgent / ActiveGate update windows"
      ],
      [
       "Tokens",
       "Expire, rotate, remove unused"
      ],
      [
       "Service sprawl",
       "Fix URL-based explosion with detection rules"
      ],
      [
       "ActiveGate load",
       "CPU, memory, queue, scale out"
      ],
      [
       "Tag coverage",
       "% of entities with owner + env tags"
      ],
      [
       "Unused content",
       "Old dashboards, duplicate alerts"
      ]
     ]
    },
    "w": "Deployment status → OneAgents: sort by version. How many agents are behind?"
   },
   {
    "t": "Migration: Classic to latest Dynatrace",
    "e": "🚚",
    "k": "Moving house: you pack carefully, label boxes, and make sure the new house works before giving back the keys.",
    "n": "Migration to the latest platform: classic dashboards become **Dashboards**, **management zones** are complemented by **segments** and **IAM policies**, notifications move to **Workflows**, and logs move to **Grail** and **OpenPipeline**. Inventory, map, migrate in waves, run in parallel.",
    "v": {
     "type": "compare",
     "cols": [
      [
       "Classic",
       [
        "Classic dashboards",
        "Management zones",
        "Problem notifications + alerting profiles",
        "Log Monitoring classic, DDUs"
       ]
      ],
      [
       "Latest platform",
       [
        "Dashboards + Notebooks (DQL)",
        "Segments + IAM policies",
        "Workflows (AutomationEngine)",
        "Grail + OpenPipeline, DPS"
       ]
      ]
     ],
     "note": "Check the current Dynatrace upgrade guides: concept mapping keeps evolving release to release."
    },
    "w": "Your team dashboard is a classic dashboard. Think how you would rebuild it with DQL tiles on SaaS."
   }
  ],
  "quiz": [
   {
    "q": "Which dimension choice is dangerous for metric cost and performance?",
    "o": [
     "Using k8s namespace",
     "Using a unique request ID or user ID",
     "Using environment"
    ],
    "a": 1,
    "why": "Unbounded values explode cardinality: each value is a new series."
   },
   {
    "q": "In DPS, log costs are typically split into…",
    "o": [
     "Ingest, retain and query",
     "Only the number of hosts",
     "Number of dashboards"
    ],
    "a": 0,
    "why": "Log Management & Analytics consumption covers ingest/process, retention and query scanning."
   },
   {
    "q": "In the latest platform, what complements management zones for filtering data?",
    "o": [
     "Segments",
     "Host units",
     "Synthetic monitors"
    ],
    "a": 0,
    "why": "Segments filter data across apps; IAM policies control access."
   }
  ],
  "interview": [
   {
    "q": "The client says Dynatrace is too expensive. How do you respond?",
    "a": "Do not argue; **measure**. Break consumption down by capability and by team. Find the top drivers (Full-Stack on large hosts that need only Infrastructure, unfiltered logs, long retention, high-cardinality metrics, duplicate data). Propose levers with **estimated savings** and **visibility impact** for each, agree priorities, implement as code, and report the result. Also show **value**: incidents avoided, MTTR reduced, tools consolidated."
   },
   {
    "q": "How would you plan a Managed to SaaS migration?",
    "a": "Phases: **assess** (inventory of config, dashboards, integrations, tokens, data residency, network), **design** (SaaS region, environments, ActiveGates, IAM, OpenPipeline), **migrate configuration as code** (Monaco download/convert/deploy), **re-point agents** in waves (oneagentctl or redeploy) with **parallel run**, validate data and alerting parity, migrate users and integrations, then **decommission**. Communicate history limits: historical data generally does not move, so plan overlap for reporting."
   }
  ]
 },
 {
  "id": 11,
  "phase": "Phase V · Specialisation and interview",
  "minutes": 7,
  "title": "AI and LLM observability",
  "blurb": "GenAI traces, prompts, tokens, cost, latency, RAG pipelines, guardrails and LLMOps.",
  "scenes": [
   {
    "t": "Why AI apps need special watching",
    "e": "🦜",
    "k": "A talking parrot may answer slowly, cost a lot of seeds, or say something wrong. You must watch all three.",
    "n": "LLM apps fail in new ways: slow generation, cost per **token**, silent **hallucinations**, **rate limits**, and many steps per question. **AI observability** covers performance, cost, quality and safety with traces, metrics, logs and events.",
    "v": {
     "type": "chips",
     "items": [
      [
       "Latency",
       "Time to first token, total generation time"
      ],
      [
       "Tokens",
       "Input + output tokens drive cost"
      ],
      [
       "Errors",
       "Rate limits (429), timeouts, content filters"
      ],
      [
       "Quality",
       "Hallucinations, relevance, user feedback"
      ],
      [
       "Safety",
       "Prompt injection, PII leakage, guardrails"
      ],
      [
       "Chains",
       "Retrieval, tools, agents: many steps per question"
      ]
     ]
    },
    "w": "Ask whether any internal chatbot or AI assistant is in production, and who monitors it."
   },
   {
    "t": "An LLM trace, step by step",
    "e": "🧵",
    "k": "The trail of stickers again, but now some rooms are \"ask the library\" and \"ask the parrot\".",
    "n": "An AI request is a trace: a root span, an **embedding** span, a **vector search** span, and a **chat completion** span with model and token attributes from the **OpenTelemetry GenAI conventions**. **OpenLLMetry** adds this automatically.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "💬",
       "span: POST /ask",
       "root · 3.2 s",
       "hot"
      ],
      [
       "🔢",
       "span: embeddings",
       "text-embedding model · 80 ms"
      ],
      [
       "📚",
       "span: vector search",
       "top-k = 5 · 120 ms"
      ],
      [
       "🧠",
       "span: chat completion",
       "gen_ai.request.model · input 1 850 / output 420 tokens · 2.8 s",
       "warn"
      ],
      [
       "🛡️",
       "span: guardrail check",
       "policy pass · 60 ms"
      ]
     ]
    },
    "w": "This is SaaS-focused. Explore the AI Observability app in the trial tenant.",
    "img": [
     "ai-obs-overview.webp",
     "The AI Observability app overview (SaaS).",
     "https://docs.dynatrace.com/docs/observe/dynatrace-for-ai-observability/ai-observability-app"
    ]
   },
   {
    "t": "The key attributes",
    "e": "🏷️",
    "k": "Each parrot answer gets a label: which parrot, how many words in, how many words out.",
    "n": "Key attributes: **gen_ai.request.model**, **gen_ai.usage.input_tokens**, **gen_ai.usage.output_tokens**. They give cost per team and latency per model. Capture prompt text only by choice, mask it, and restrict access.",
    "v": {
     "type": "code",
     "lang": "DQL · token usage",
     "code": "fetch spans, from: now() - 24h\n| filter isNotNull(gen_ai.usage.input_tokens)\n| summarize calls = count(),\n            in_tokens = sum(gen_ai.usage.input_tokens),\n            out_tokens = sum(gen_ai.usage.output_tokens),\n            p95_ms = percentile(duration, 95) / 1ms,\n            by: { gen_ai.request.model, service.name }\n| sort in_tokens desc",
     "note": "Semantic conventions for GenAI are still evolving. Check the attribute names your instrumentation emits."
    },
    "w": "Privacy point for a bank: prompts can contain client data. Masking is mandatory."
   },
   {
    "t": "Observing RAG pipelines",
    "e": "📚",
    "k": "Before answering, the parrot reads books from the library. If it picks the wrong book, the answer is wrong even if the parrot is clever.",
    "n": "**RAG** retrieves documents from a **vector store** before the model answers. Observe each stage, track chunk counts and similarity scores, and link user feedback as **business events**. Then you know whether retrieval or the model is at fault.",
    "v": {
     "type": "flow",
     "nodes": [
      [
       "❓",
       "Question",
       "user"
      ],
      [
       "🔢",
       "Embed",
       "latency"
      ],
      [
       "📚",
       "Retrieve",
       "top-k, scores"
      ],
      [
       "🧩",
       "Build prompt",
       "tokens"
      ],
      [
       "🧠",
       "Generate",
       "latency, cost"
      ],
      [
       "👍",
       "Feedback",
       "bizevent"
      ]
     ]
    },
    "w": "Interview angle: retrieval quality is a data problem, not a model problem."
   },
   {
    "t": "LLMOps and MLOps in one picture",
    "e": "🔄",
    "k": "Training the parrot, testing it, letting it talk, and watching it every day are all part of the job.",
    "n": "**MLOps** covers data, training, evaluation, deployment and **drift**. **LLMOps** adds prompt and model versions, evaluations and guardrails. Dynatrace sits in the operate stage, comparing versions through deployment events.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "📦",
       "Data + prompts",
       "versioned in Git"
      ],
      [
       "🧪",
       "Evaluate",
       "offline test sets, quality metrics"
      ],
      [
       "🚀",
       "Deploy",
       "model / prompt version as deployment event"
      ],
      [
       "🔭",
       "Observe (Dynatrace)",
       "traces, tokens, latency, errors, feedback",
       "hot"
      ],
      [
       "🔁",
       "Improve",
       "drift and cost signals feed the next version"
      ]
     ]
    },
    "w": "No work check here. Practise explaining where Dynatrace fits in this lifecycle."
   }
  ],
  "quiz": [
   {
    "q": "What mainly drives the cost of an LLM call?",
    "o": [
     "Number of HTTP headers",
     "Input and output tokens",
     "Number of dashboards"
    ],
    "a": 1,
    "why": "Providers charge per token, so track gen_ai.usage.* attributes."
   },
   {
    "q": "Where should prompt text containing personal data be handled?",
    "o": [
     "Stored everywhere for debugging",
     "Opt-in capture, masked in OpenPipeline, restricted bucket",
     "Printed on dashboards"
    ],
    "a": 1,
    "why": "Privacy by design: minimise, mask at ingest, restrict access."
   },
   {
    "q": "Answers are bad but the model is fine. Which RAG stage do you check first?",
    "o": [
     "Retrieval: relevance and scores of chunks",
     "The CSS of the chat page",
     "The OneAgent version"
    ],
    "a": 0,
    "why": "Wrong context in, wrong answer out."
   }
  ],
  "interview": [
   {
    "q": "How would you monitor a client's new GenAI chatbot with Dynatrace?",
    "a": "Instrument with **OpenTelemetry** (e.g. **OpenLLMetry**) following **GenAI semantic conventions**, export **OTLP** to Dynatrace; OneAgent on the hosting services for the rest. Trace every stage: retrieval, model calls, tools, guardrails. Dashboards and alerts for **latency (incl. time to first token)**, **error/429 rates**, **tokens and cost per team/model**, and **user feedback** via business events. Privacy: no prompt content by default, masking in **OpenPipeline**, restricted bucket. Deployment events for prompt/model versions."
   },
   {
    "q": "Cost of the chatbot doubled this week. How do you find why?",
    "a": "DQL over spans: tokens by **model**, **service**, **operation** and day. Check for a new **model version** (deployment events), **longer prompts** (more retrieved chunks, bigger system prompt), more **retries** after 429s, a loop in an **agent**, or traffic growth. Compare input vs output tokens per request before and after. Then fix the cause and add an alert on tokens per request."
   }
  ]
 },
 {
  "id": 12,
  "phase": "Phase V · Specialisation and interview",
  "minutes": 10,
  "title": "Architecture, incidents and the interview",
  "blurb": "An enterprise reference design, high-volume patterns, an incident drill and how to tell your story.",
  "scenes": [
   {
    "t": "The enterprise reference architecture",
    "e": "🏛️",
    "k": "Now you draw the whole city: neighbourhoods, post offices, roads, the library, the doctor, and the rules for who can enter where.",
    "n": "The reference design: **SSO** and **IAM**, prod and non-prod SaaS environments in an **EU region**, **network zones** with two ActiveGates or more, OneAgent, **Operator**, **cloud integrations**, an **OTel Collector** tier, **OpenPipeline** with masking and buckets, config as code, and workflows to ITSM.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🔐",
       "Identity + governance",
       "SSO · groups · IAM policies · conventions · CoE",
       "hot"
      ],
      [
       "🏢",
       "Environments",
       "prod + non-prod · EU region"
      ],
      [
       "🌐",
       "Network zones",
       "2+ ActiveGates per DC / region"
      ],
      [
       "📥",
       "Collection",
       "OneAgent · Operator · cloud integrations · OTel Collector"
      ],
      [
       "🧹",
       "OpenPipeline + Grail",
       "masking · routing · buckets by retention"
      ],
      [
       "🤖",
       "Automation",
       "Monaco/Terraform CI/CD · Workflows → ITSM"
      ]
     ]
    },
    "w": "Draw your current Managed setup the same way: zones, ActiveGates, agents, notifications. Then draw its SaaS target."
   },
   {
    "t": "High-volume telemetry patterns",
    "e": "🌊",
    "k": "When a river is huge, you build channels, dams and filters, or the village floods.",
    "n": "At high volume, scale and separate **ActiveGates**, add a load-balanced **Collector** tier with **batching** and **tail sampling**, drop early in **OpenPipeline**, control **cardinality**, plan bandwidth, and monitor the monitoring.",
    "v": {
     "type": "flow",
     "nodes": [
      [
       "🏭",
       "Sources",
       "thousands of hosts, pods"
      ],
      [
       "⚖️",
       "LB + Collector tier",
       "batch · limit · sample"
      ],
      [
       "🏤",
       "ActiveGates",
       "scaled per zone"
      ],
      [
       "🧹",
       "OpenPipeline",
       "drop · route · extract"
      ],
      [
       "🪣",
       "Buckets",
       "retention tiers"
      ]
     ]
    },
    "w": "Check your ActiveGate CPU and memory in Deployment status. That is monitoring the monitoring."
   },
   {
    "t": "Incident drill: checkout is slow",
    "e": "🚒",
    "k": "The fire alarm rings. You do not run around. You follow your plan, step by step.",
    "n": "Checkout is slow. Open the **Davis problem**, follow the **service flow** and slow **traces**, check the infrastructure, check **deployment events**, read the logs, mitigate, verify recovery, write the **postmortem**.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "1️⃣",
       "Davis problem",
       "impact · root cause · evidence"
      ],
      [
       "2️⃣",
       "Service flow + traces",
       "where is the time spent?",
       "hot"
      ],
      [
       "3️⃣",
       "Infrastructure",
       "pod throttling · GC · DB host"
      ],
      [
       "4️⃣",
       "Changes",
       "deployment and config events"
      ],
      [
       "5️⃣",
       "Logs in a notebook",
       "errors around the start time"
      ],
      [
       "6️⃣",
       "Mitigate + verify",
       "rollback / scale · watch recovery",
       "warn"
      ],
      [
       "7️⃣",
       "Postmortem",
       "actions as code"
      ]
     ]
    },
    "w": "Rehearse this on a real closed problem from your Problems page. Say each step aloud.",
    "img": [
     "problem-feed.webp",
     "The Problems app feed (SaaS): where most incidents start.",
     "https://docs.dynatrace.com/docs/dynatrace-intelligence/problems-app"
    ]
   },
   {
    "t": "Case study you can tell",
    "e": "📖",
    "k": "Tell the story like a good fairy tale: the problem, what you did, and the happy ending with numbers.",
    "n": "Use **STAR**: situation, task, action, result. Build on real experience, like maintenance windows and incident handling, and add the engineering layer. Only quote numbers you can defend.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🧭",
       "Situation",
       "Context, scale, constraint"
      ],
      [
       "🎯",
       "Task",
       "What you owned"
      ],
      [
       "🛠️",
       "Action",
       "Technical steps: tools, design choices, trade-offs",
       "hot"
      ],
      [
       "📊",
       "Result",
       "Measured outcome you can defend"
      ],
      [
       "💡",
       "Learning",
       "What you would do differently"
      ]
     ]
    },
    "w": "Your strongest honest story is probably on this dashboard: health tiles, problems and maintenance windows you handle daily."
   },
   {
    "t": "What the interviewers will test",
    "e": "🎤",
    "k": "The judges look at three things: do you know it, can you do it, and can you explain it to someone else.",
    "n": "Expect three kinds of question: **knowledge**, like architecture, ports, DQL and licensing; **hands-on**, like writing a query or fixing an agent; and **consulting**, like workshops, cost and trade-offs. Look at the Dynatrace **Associate** and **Professional** certifications.",
    "v": {
     "type": "compare",
     "cols": [
      [
       "Technical",
       [
        "Draw the architecture end to end",
        "Write DQL live",
        "Troubleshoot agents and broken traces",
        "Design for Kubernetes and multi-region"
       ]
      ],
      [
       "Consulting",
       [
        "Discovery workshop and scoping",
        "Explain cost and trade-offs to a client",
        "Migration plan with risks",
        "Hand-over, training, governance"
       ]
      ]
     ]
    },
    "w": "Never quote internal hostnames or client data in an interview. Describe the scale and the problem instead."
   },
   {
    "t": "Your 30-day practice plan",
    "e": "🗓️",
    "k": "Little steps every day build a big tower.",
    "n": "Thirty days. Week one: foundations in a trial tenant. Week two: twenty DQL queries and a Monaco pipeline. Week three: Operator, Collector, a workflow. Week four: architecture diagram, three STAR stories, interview corners aloud.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "1️⃣",
       "Week 1 · Foundations",
       "Trial tenant · OneAgent on a VM · demo app · Davis"
      ],
      [
       "2️⃣",
       "Week 2 · Data + automation",
       "20 DQL queries · Monaco + Git pipeline"
      ],
      [
       "3️⃣",
       "Week 3 · Cloud-native",
       "Operator on kind/minikube · OTel Collector · a workflow",
       "hot"
      ],
      [
       "4️⃣",
       "Week 4 · Interview",
       "Architecture diagram · 3 STAR stories · mock interviews"
      ]
     ]
    },
    "w": "Use work for classic concepts, and the trial for everything Grail-based."
   }
  ],
  "quiz": [
   {
    "q": "What is the minimum ActiveGate count per network zone for high availability?",
    "o": [
     "One",
     "Two",
     "Ten"
    ],
    "a": 1,
    "why": "Two gives redundancy; scale beyond that with load."
   },
   {
    "q": "In an incident, what do you check right after the Davis problem summary?",
    "o": [
     "The service flow and slow traces",
     "The licence contract",
     "The colour of the dashboard"
    ],
    "a": 0,
    "why": "Find where time is spent before diving into infrastructure."
   },
   {
    "q": "What does STAR stand for?",
    "o": [
     "Situation, Task, Action, Result",
     "Start, Test, Alert, Repeat",
     "Service, Trace, Agent, Root cause"
    ],
    "a": 0,
    "why": "A structured story with a measurable result."
   }
  ],
  "interview": [
   {
    "q": "Design an observability platform for a European retailer: 2 000 VMs, 15 Kubernetes clusters, AWS and Azure, strict GDPR.",
    "a": "SaaS in an **EU region**; account with **SSO**, groups, **IAM policies** per domain; prod and non-prod environments. **Network zones** per DC and cloud region, 2+ **ActiveGates** each, role-separated at scale. OneAgent via **Ansible** with host groups and tags; **Operator/DynaKube** via GitOps; **AWS/Azure integrations**; OTel **Collector** tier. **OpenPipeline**: PII masking, routing to buckets by retention (audit 1y, app 35d, debug 7d), metric extraction. Config as code (Monaco) with CI/CD. Workflows to ServiceNow and Teams. SLOs for checkout, search, payment. Governance: CoE, conventions, monthly cost and noise review."
   },
   {
    "q": "Tell me about a time you handled a production incident.",
    "a": "Use **STAR** with your real experience. Be precise about what **you** did, the tools, the timeline and the outcome. Then add one sentence on how you would do it now with Dynatrace: Davis problem, traces, deployment events, workflow to ITSM, postmortem actions as code. Honesty about scope beats inflated claims; experienced interviewers probe details."
   },
   {
    "q": "Which question would you ask us at the end?",
    "a": "Examples: Which Dynatrace platform generation are your main clients on, and how many are migrating to the latest platform? How is the Dynatrace practice organised (CoE, certifications, pre-sales)? What does a typical first mission look like for this role? These show you understand the real work."
   }
  ]
 }
]);
