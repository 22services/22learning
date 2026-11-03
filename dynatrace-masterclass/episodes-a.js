/* Dynatrace Chalkboard Masterclass — lessons 1 to 6 (short edition).
   Scene fields: t title · e emoji · k kid picture (on screen) · n narration (spoken + captions)
   v visual {flow|stack|compare|chips|code} · w "check it at work" tip for a Managed tenant
   img [file, caption, official source page] · **text** = official term. */
window.EPISODES = (window.EPISODES || []).concat([
 {
  "id": 1,
  "phase": "Phase I · Foundations",
  "minutes": 7,
  "title": "How Dynatrace sees everything",
  "blurb": "SaaS vs Managed, tenants, entities, the four signal types and the big end-to-end picture.",
  "scenes": [
   {
    "t": "The doctor for computers",
    "e": "🩺",
    "k": "Imagine a doctor who never sleeps. Tiny sensors sit on every part of the patient, and one big brain reads them all and says: \"the tummy hurts because of what you ate at lunch\".",
    "n": "Dynatrace is a doctor that never sleeps. **OneAgent** and **OpenTelemetry** are the sensors. **Grail** is the memory. **Smartscape** is the map. **Davis AI** finds the real cause. An architect must explain how these pieces work together.",
    "v": {
     "type": "flow",
     "nodes": [
      [
       "🖥️",
       "Your systems",
       "hosts · apps · k8s · cloud"
      ],
      [
       "🕵️",
       "OneAgent / OTel",
       "collect"
      ],
      [
       "🚪",
       "ActiveGate",
       "optional relay"
      ],
      [
       "🧠",
       "Dynatrace platform",
       "Grail · Smartscape · Davis"
      ],
      [
       "📣",
       "Action",
       "dashboards · alerts · workflows"
      ]
     ]
    },
    "w": "Your tenant says “dynatrace Managed” top left. That means classic Dynatrace: no Grail, DQL, Notebooks or AppEngine. Everything else in this lesson applies."
   },
   {
    "t": "Observability in one sentence",
    "e": "🔦",
    "k": "Monitoring tells you \"the light is off\". Observability lets you ask \"why is it off?\" even if you never asked that question before.",
    "n": "**Monitoring** answers questions you prepared, like: is CPU above ninety percent? **Observability** lets you ask new questions of existing data. Dynatrace adds automatic discovery and causal analysis, so you get a cause, not just a chart.",
    "v": {
     "type": "compare",
     "cols": [
      [
       "Monitoring",
       [
        "Known questions, set in advance",
        "Static thresholds: CPU > 90%",
        "Tells you that something is wrong"
       ]
      ],
      [
       "Observability",
       [
        "Ask new questions of existing data",
        "Correlated metrics, logs, traces, events",
        "Tells you why, and what it impacts"
       ]
      ]
     ]
    },
    "w": "Your team dashboard is monitoring: fixed tiles like Top CPU. Opening a problem and following its root cause is observability."
   },
   {
    "t": "The four signal types",
    "e": "🧺",
    "k": "Four kinds of notes the doctor keeps: a heartbeat chart, a diary, a footprint trail, and a list of big moments.",
    "n": "Four signal types. **Metrics**: numbers over time. **Logs**: text lines. **Traces**: one request across services. **Events**: important moments like deployments. Plus **business events** and **user sessions**. The power is linking them all to the same entity.",
    "v": {
     "type": "chips",
     "items": [
      [
       "Metrics",
       "Numeric time series. Example key: **dt.host.cpu.usage**"
      ],
      [
       "Logs",
       "Text records with attributes. Ingested by OneAgent, API, OTel or log forwarders"
      ],
      [
       "Traces / spans",
       "One request across services. Dynatrace calls its traces **PurePath**"
      ],
      [
       "Events",
       "Deployments, config changes, Davis problems, custom events"
      ],
      [
       "Business events",
       "**bizevents**: business data like orders or payments"
      ],
      [
       "Entities",
       "Monitored things: HOST, SERVICE, PROCESS_GROUP…"
      ]
     ]
    },
    "w": "Left menu: Metrics, Logs, Distributed Traces, Problems. One menu entry per signal type."
   },
   {
    "t": "Where Dynatrace lives: SaaS or Managed",
    "e": "🏠",
    "k": "You can rent a flat where the landlord fixes everything (SaaS), or own a house and fix the roof yourself (Managed).",
    "n": "**SaaS** runs on AWS, Azure or Google Cloud, operated by Dynatrace, with **Grail**, **AppEngine** and new **Dashboards**. **Managed** is a cluster in your own data centre, run with **Mission Control**, chosen for data residency. A **Managed to SaaS migration** is a very common consulting mission.",
    "v": {
     "type": "compare",
     "cols": [
      [
       "Dynatrace SaaS",
       [
        "Hosted on AWS, Azure or GCP regions",
        "Grail, AppEngine, Workflows, new Dashboards",
        "Dynatrace runs upgrades and scaling",
        "URL like **abc12345.apps.dynatrace.com**"
       ]
      ],
      [
       "Dynatrace Managed",
       [
        "Your servers, your network, your ops team",
        "Cluster nodes, usually 3+ for high availability",
        "You plan capacity, backup, upgrades",
        "Classic feature set, no Grail-based apps"
       ]
      ]
     ],
     "note": "**Gotcha:** never promise a Managed customer a Grail or AppEngine feature. Check what the target platform supports first."
    },
    "w": "Your URL is a company domain, not live.dynatrace.com: a Managed cluster. Ask your team how many cluster nodes it has and who runs upgrades."
   },
   {
    "t": "Tenants and environments",
    "e": "🏢",
    "k": "A big building (cluster) has many flats (environments). Each flat has its own key and its own furniture.",
    "n": "An **environment**, or **tenant**, is an isolated instance with its own data and settings, identified by an **environment ID**. Several environments sit under one **account**, where users, groups and **IAM policies** are managed.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🏦",
       "Account",
       "Subscription (DPS), users, groups, IAM policies, audit",
       "hot"
      ],
      [
       "🏢",
       "Environment / tenant: prod",
       "ID abc12345 · own data, settings, tokens"
      ],
      [
       "🏢",
       "Environment / tenant: non-prod",
       "separate data and settings, same account"
      ],
      [
       "🔑",
       "Access",
       "SSO / SAML, groups → policies → permissions on environments"
      ]
     ]
    },
    "w": "In your URL, the long ID after /e/ is your environment ID. In Managed, the Cluster Management Console holds the cluster-level settings."
   },
   {
    "t": "Entities: giving every thing a name tag",
    "e": "🏷️",
    "k": "Every toy in the room gets a sticker with a unique number, so nobody mixes up two red cars.",
    "n": "Everything discovered becomes an **entity** with a unique ID: **HOST**, **PROCESS_GROUP**, **PROCESS_GROUP_INSTANCE**, **SERVICE**, **APPLICATION**. Every signal carries these IDs. That shared tag is the glue Davis uses to connect cause and effect.",
    "v": {
     "type": "chips",
     "items": [
      [
       "HOST-0123ABCD…",
       "A physical or virtual machine"
      ],
      [
       "PROCESS_GROUP-…",
       "Logical group of similar processes, e.g. all Tomcat nodes of an app"
      ],
      [
       "PROCESS_GROUP_INSTANCE-…",
       "One running process on one host"
      ],
      [
       "SERVICE-…",
       "Detected web, database or messaging service"
      ],
      [
       "APPLICATION-…",
       "A web or mobile front end (RUM)"
      ],
      [
       "KUBERNETES_CLUSTER-…",
       "A monitored Kubernetes cluster"
      ]
     ]
    },
    "w": "Open any host from a honeycomb tile and look at the URL: you will see the entity ID, like HOST-1A2B….",
    "img": [
     "smartscape-datacenters.webp",
     "Smartscape classic: data centres, hosts, processes, services and applications as linked entities.",
     "https://docs.dynatrace.com/docs/analyze-explore-automate/smartscape-classic"
    ]
   },
   {
    "t": "The end-to-end path of one data point",
    "e": "🚂",
    "k": "A letter is written, put in an envelope, carried by the postman, sorted at the post office, and then read.",
    "n": "One data point: a **code module** records a span. It travels over HTTPS four four three, directly or through an **ActiveGate**. **OpenPipeline** processes it, **Grail** stores it, **Smartscape** links it, **Davis** opens a **problem**, and a **workflow** notifies the team.",
    "v": {
     "type": "flow",
     "nodes": [
      [
       "☕",
       "Code module",
       "span + metrics"
      ],
      [
       "🔒",
       "HTTPS 443",
       "direct or via AG"
      ],
      [
       "🧹",
       "OpenPipeline",
       "parse · enrich · route"
      ],
      [
       "🗄️",
       "Grail bucket",
       "stored"
      ],
      [
       "🧠",
       "Davis",
       "baseline → problem"
      ],
      [
       "⚙️",
       "Workflow",
       "Slack · Jira · ServiceNow"
      ]
     ]
    },
    "w": "In Managed, the same path ends in classic storage instead of Grail, and alerts go through problem notifications instead of workflows."
   },
   {
    "t": "What a consultant does with this",
    "e": "💼",
    "k": "You are the builder who listens to the family, draws the house, builds it, and teaches them how to live in it.",
    "n": "As a consultant you run **discovery workshops**, design the **target architecture**, roll out agents, define **naming**, **host groups**, **tags** and **access**, automate configuration as code, build dashboards, and hand over with training. You also explain cost.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🗣️",
       "Discovery",
       "Inventory apps, teams, SLAs, network zones, compliance"
      ],
      [
       "📐",
       "Design",
       "SaaS region, environments, ActiveGates, tagging, IAM",
       "hot"
      ],
      [
       "🚀",
       "Deploy",
       "OneAgent rollout, K8s Operator, cloud integrations, OTel"
      ],
      [
       "🤖",
       "Automate",
       "Monaco / Terraform in CI/CD"
      ],
      [
       "📊",
       "Operate",
       "Dashboards, SLOs, alerting, workflows, cost reviews"
      ],
      [
       "🎓",
       "Hand over",
       "Runbooks, training, health checks"
      ]
     ]
    },
    "w": "Look at the filter in your top bar: it is a management zone. Someone designed that access model. Find out who, and why."
   }
  ],
  "quiz": [
   {
    "q": "Which statement about Dynatrace Managed is correct?",
    "o": [
     "It is the only option that supports Grail",
     "It is a cluster you run in your own data centre",
     "It is a free version of SaaS"
    ],
    "a": 1,
    "why": "Managed runs on infrastructure the customer operates. Grail and AppEngine are SaaS platform capabilities."
   },
   {
    "q": "What glues a log line, a metric and a span to the same server?",
    "o": [
     "The entity ID, for example dt.entity.host",
     "The timestamp alone",
     "The dashboard name"
    ],
    "a": 0,
    "why": "Signals carry entity attributes. That shared identity is what Smartscape and Davis use to correlate them."
   },
   {
    "q": "Where do you manage users, groups and IAM policies across environments?",
    "o": [
     "Inside each OneAgent",
     "In Account Management",
     "In a DQL notebook"
    ],
    "a": 1,
    "why": "Identity, licensing and policies live at account level; data and settings live at environment level."
   }
  ],
  "interview": [
   {
    "q": "Draw the Dynatrace architecture for me from the application to the alert.",
    "a": "Start at the left: **OneAgent** (code modules injected into processes, plus OS module) and **OpenTelemetry** sources. Traffic goes over **HTTPS 443** directly or via an **Environment ActiveGate** for routing, compression and network isolation. In SaaS, **OpenPipeline** processes ingest, **Grail** stores it in **buckets** with retention, **Smartscape** builds topology, **Davis** detects anomalies against baselines and opens **problems** with a root cause, and **Workflows** or problem notifications route to Slack, ServiceNow or PagerDuty. Finish with how users consume it: **DQL**, **Notebooks**, **Dashboards**, apps."
   },
   {
    "q": "A bank asks: SaaS or Managed? How do you decide?",
    "a": "Ask about **data residency** and regulation, **air-gapped** networks, internal ops capacity, and which features they need. SaaS gives Grail, AppEngine, Workflows, automatic upgrades, and regional hosting (EU regions exist). Managed gives full control but the bank runs capacity planning, backups, upgrades and HA. Today most new projects choose SaaS unless a regulator or network constraint blocks it; then explain the trade-off in features and operating cost honestly."
   }
  ]
 },
 {
  "id": 2,
  "phase": "Phase I · Foundations",
  "minutes": 8,
  "title": "OneAgent and ActiveGate",
  "blurb": "Install, monitoring modes, code modules, ActiveGate roles, network zones, proxies and troubleshooting.",
  "scenes": [
   {
    "t": "OneAgent: one helper per house",
    "e": "🕵️",
    "k": "You put one friendly spy in each house. It watches the rooms (CPU, disk) and also climbs inside the toys (apps) to see how they work.",
    "n": "**OneAgent** runs once per host. The **OS module** collects host metrics and discovers processes. **Code modules** go inside Java, dot NET, Node and others to capture **PurePath** traces. A **watchdog** supervises it. Deep monitoring needs a **process restart**.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🐶",
       "oneagentwatchdog",
       "Supervises the agent processes"
      ],
      [
       "🧩",
       "OS module (oneagentos)",
       "Host metrics, process discovery, network, logs"
      ],
      [
       "💉",
       "Code modules",
       "Injected into Java, .NET, Node.js, PHP, Go, Apache, NGINX, IIS…",
       "hot"
      ],
      [
       "📦",
       "Log module",
       "Discovers and ships log files"
      ],
      [
       "🧰",
       "oneagentctl",
       "CLI to read and change agent configuration"
      ]
     ],
     "note": "**Gotcha:** processes started before install are not deep-monitored until restart. Plan restarts in the change window."
    },
    "w": "Technologies & Processes → open a WebSphere process. Look for “deep monitoring” and whether a restart is needed."
   },
   {
    "t": "Three monitoring modes",
    "e": "🎚️",
    "k": "A volume knob: low (only see the house), medium (see the house and rooms), high (see inside every toy).",
    "n": "Three modes. **Full-Stack**: everything, including code-level traces. **Infrastructure**: host, processes and logs, cheaper. **Discovery**: the lightest inventory. Choose per host group, on value and cost.",
    "v": {
     "type": "compare",
     "cols": [
      [
       "Full-Stack",
       [
        "Host + process + **code-level traces**",
        "Services, PurePath, method hotspots",
        "Highest consumption"
       ]
      ],
      [
       "Infrastructure / Discovery",
       [
        "Host metrics, processes, logs",
        "No code-level tracing",
        "Lower consumption; Discovery is lightest"
       ]
      ]
     ],
     "note": "Interview line: “I pick the mode per host group, based on value and cost.”"
    },
    "w": "Hosts → open a host → monitoring mode. Your AIX, Solaris and Windows tiles may use different modes. Compare them."
   },
   {
    "t": "Installing OneAgent on Linux",
    "e": "🧑‍🔧",
    "k": "You download the helper with a secret key, then tell it which team it belongs to before it starts.",
    "n": "Download the installer with an **InstallerDownload** token, then install as root with the **monitoring mode**, **host group**, **network zone** and **tags**. Set the host group at install time; changing it later breaks process history.",
    "v": {
     "type": "code",
     "lang": "bash · Linux install",
     "code": "# 1. Download (token scope: InstallerDownload)\nwget -O Dynatrace-OneAgent-Linux.sh \\\n  \"https://abc12345.live.dynatrace.com/api/v1/deployment/installer/agent/unix/default/latest?arch=x86\" \\\n  --header=\"Authorization: Api-Token $DT_TOKEN\"\n\n# 2. Install with the decisions made up front\nsudo /bin/sh Dynatrace-OneAgent-Linux.sh \\\n  --set-monitoring-mode=fullstack \\\n  --set-app-log-content-access=true \\\n  --set-host-group=prod_payments_web \\\n  --set-network-zone=eu-west.dc1 \\\n  --set-host-tag=env=prod --set-host-tag=team=payments",
     "note": "**Host group** naming is a design decision: e.g. environment_application_tier. Agree it with the client before rollout."
    },
    "w": "Deploy Dynatrace (in your Favorites) shows the real installer command for your cluster. Read it; do not run it on a work server without a change request."
   },
   {
    "t": "oneagentctl: the agent remote control",
    "e": "🎮",
    "k": "A small remote control to ask the helper \"who is your boss?\" and \"which team are you in?\".",
    "n": "**oneagentctl** reads and changes agent settings without a reinstall: get server, get tenant, set proxy, set host group, set network zone. Linux logs are in slash var slash log slash dynatrace slash oneagent. These are your first troubleshooting stops.",
    "v": {
     "type": "code",
     "lang": "bash · oneagentctl",
     "code": "cd /opt/dynatrace/oneagent/agent/tools\nsudo ./oneagentctl --get-server          # which endpoints am I using?\nsudo ./oneagentctl --get-tenant          # which environment ID?\nsudo ./oneagentctl --get-host-group\nsudo ./oneagentctl --set-proxy=proxy.corp.local:3128 --restart-service\nsudo ./oneagentctl --set-network-zone=eu-west.dc1 --restart-service\n\n# Logs\nls /var/log/dynatrace/oneagent/"
    },
    "w": "If you have shell access to a Linux test host, run oneagentctl --get-server and --get-host-group. Reading is safe; setting is not."
   },
   {
    "t": "ActiveGate: the post office",
    "e": "🏤",
    "k": "Instead of every house sending letters far away, they give them to the local post office, which bundles them and sends one truck.",
    "n": "**ActiveGate** is a secure relay. OneAgents send to it on port **nine nine nine nine**; it compresses, buffers and forwards on four four three. It also runs **Extensions**, **Kubernetes** and **cloud** monitoring, **private synthetic** locations and **zRemote**. Managed adds **Cluster ActiveGates**.",
    "v": {
     "type": "flow",
     "nodes": [
      [
       "🖥️",
       "OneAgents",
       "private network"
      ],
      [
       "🏤",
       "Environment ActiveGate",
       "port 9999 in"
      ],
      [
       "🌐",
       "Firewall / proxy",
       "only AG allowed out"
      ],
      [
       "☁️",
       "Dynatrace SaaS",
       "HTTPS 443"
      ]
     ],
     "note": "ActiveGate is **optional**. Small cloud estates often let OneAgents talk directly to SaaS."
    },
    "w": "Deployment status → ActiveGates. Count them and note which modules each one runs.",
    "img": [
     "routing-without-zones.webp",
     "Routing without network zones: agents may reach any ActiveGate.",
     "https://docs.dynatrace.com/docs/manage/network-zones-classic/network-zones-basic-info"
    ]
   },
   {
    "t": "Network zones: the shortest road",
    "e": "🗺️",
    "k": "Each neighbourhood has its own post office. A house always tries its own neighbourhood first.",
    "n": "**Network zones** tell each agent which ActiveGates are close. The agent prefers its own zone, then falls back. This keeps traffic local and gives **high availability**. Rule: at least **two ActiveGates per zone**.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🏭",
       "Zone eu-west.dc1",
       "OneAgents + 2 ActiveGates (HA)",
       "hot"
      ],
      [
       "🏭",
       "Zone us-east.dc2",
       "OneAgents + 2 ActiveGates"
      ],
      [
       "☁️",
       "Zone aws.eu-central-1",
       "OneAgents → AGs in the VPC"
      ],
      [
       "🔁",
       "Fallback rule",
       "Use any AG, or only AGs in own zone (configurable)"
      ]
     ]
    },
    "w": "Deployment status → Network zones. Does every zone have two ActiveGates or more?",
    "img": [
     "routing-with-zones.webp",
     "Routing with network zones: agents stay with ActiveGates in their own zone.",
     "https://docs.dynatrace.com/docs/manage/network-zones-classic/network-zones-basic-info"
    ]
   },
   {
    "t": "Proxies and certificates",
    "e": "🔐",
    "k": "Sometimes a guard at the gate opens every letter to check it. Then you must show him your special stamp.",
    "n": "Corporate **proxies** and **TLS inspection** often break agent traffic. Set the proxy with oneagentctl or in ActiveGate custom properties, and trust the company **root certificate**. Agents installed but no data? Check proxy and TLS first.",
    "v": {
     "type": "chips",
     "items": [
      [
       "Proxy",
       "Set with --set-proxy or in custom.properties on ActiveGate"
      ],
      [
       "TLS inspection",
       "Breaks trust unless the corporate root CA is trusted"
      ],
      [
       "Port 9999",
       "ActiveGate inbound from OneAgents (default)"
      ],
      [
       "Port 443",
       "Outbound to Dynatrace SaaS"
      ],
      [
       "Allowlist",
       "Firewall must allow the tenant and cluster endpoints"
      ],
      [
       "Custom cert",
       "Install your own certificate on ActiveGate"
      ]
     ]
    },
    "w": "Ask your network team whether traffic to the cluster or ActiveGates goes through TLS inspection. It is a classic interview story."
   },
   {
    "t": "Troubleshooting: no data from a host",
    "e": "🧯",
    "k": "The doctor gets no heartbeat. Is the sensor broken, is the wire cut, or is the sensor plugged into the wrong patient?",
    "n": "No data from a host? Follow a method. Agent running? Right server and tenant? Network path open? TLS and auth errors in the logs? Host visible but no services? Then restart the process or check supported technologies.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "1️⃣",
       "Agent alive?",
       "systemctl status oneagent · watchdog running"
      ],
      [
       "2️⃣",
       "Right target?",
       "oneagentctl --get-server / --get-tenant"
      ],
      [
       "3️⃣",
       "Network path?",
       "curl -v https://ag.corp:9999 · proxy · firewall",
       "hot"
      ],
      [
       "4️⃣",
       "TLS and auth?",
       "agent logs: certificate, 401, proxy errors",
       "warn"
      ],
      [
       "5️⃣",
       "Host OK but no services?",
       "Restart process · check supported tech · deep monitoring rules"
      ]
     ]
    },
    "w": "Deployment status → OneAgents: filter for disconnected agents. Pick one and walk the five steps with your team."
   }
  ],
  "quiz": [
   {
    "q": "Why do some processes show no code-level data right after installing OneAgent?",
    "o": [
     "The licence is wrong",
     "The process must be restarted to load the code module",
     "ActiveGate is missing"
    ],
    "a": 1,
    "why": "Code modules are injected when the process starts. Existing processes need a restart."
   },
   {
    "q": "What is the default port OneAgents use to reach an Environment ActiveGate?",
    "o": [
     "9999",
     "8080",
     "22"
    ],
    "a": 0,
    "why": "ActiveGate listens on 9999 by default and forwards to the cluster over 443."
   },
   {
    "q": "You have two data centres. How do you keep agent traffic local and highly available?",
    "o": [
     "One ActiveGate for the whole company",
     "Network zones with at least two ActiveGates per zone",
     "Disable ActiveGates"
    ],
    "a": 1,
    "why": "Network zones route agents to nearby ActiveGates; two per zone gives redundancy."
   }
  ],
  "interview": [
   {
    "q": "Agents are installed on 300 servers but 40 show nothing. Walk me through it.",
    "a": "Look for a **pattern** first: same subnet, same OS, same proxy? Then the method: agent running, **oneagentctl --get-server/--get-tenant**, network test to **ActiveGate 9999** or **SaaS 443**, **proxy** and **TLS inspection** (corporate CA), agent logs for 401 or certificate errors, token or tenant mismatch from a wrong installer. If hosts appear but no services: **process restart**, unsupported technology, or monitoring rules. Fix the root cause in the deployment automation, not by hand on 40 servers."
   },
   {
    "q": "When do you need an ActiveGate, and how many?",
    "a": "Need it when agents cannot reach the internet, to **concentrate egress**, to monitor via APIs (**Kubernetes API**, **cloud**, **VMware**), to run **Extensions 2.0**, or **private synthetic locations**. Size per zone: minimum **two for HA**, then scale on number of agents and extension load following Dynatrace sizing guidance. Separate ActiveGates by purpose (routing vs extensions vs synthetic) in large estates, so one heavy workload does not starve the others."
   }
  ]
 },
 {
  "id": 3,
  "phase": "Phase II · Advanced observability",
  "minutes": 8,
  "title": "Distributed tracing and OpenTelemetry",
  "blurb": "Traces, spans, context propagation, OTel SDK and Collector, OTLP to Dynatrace, sampling, eBPF.",
  "scenes": [
   {
    "t": "A trace is a treasure-hunt trail",
    "e": "🧭",
    "k": "A child runs from the kitchen to the garden to the garage. Each room leaves a sticker with the time. Together the stickers show the whole trip.",
    "n": "A **trace** is the journey of one request. Each step is a **span**, with a name, timing, status, **attributes** and a **parent span ID**. All spans share one **trace ID**. Dynatrace calls its traces **PurePath**.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🌐",
       "span: POST /checkout",
       "frontend · 820 ms · root span",
       "hot"
      ],
      [
       "🔗",
       "span: OrderService.create",
       "child of checkout · 640 ms"
      ],
      [
       "💳",
       "span: PaymentClient.charge",
       "child · 520 ms"
      ],
      [
       "🗄️",
       "span: SELECT payments",
       "child · 480 ms ← most of the time is here",
       "warn"
      ]
     ],
     "note": "Every span carries the same **trace_id** and its own **span_id** + **parent_span_id**."
    },
    "w": "Distributed Traces → open one WebSphere request. Each row in the waterfall is a span.",
    "img": [
     "traces-explorer.webp",
     "The Distributed Tracing app on SaaS: a checkout request broken into spans.",
     "https://docs.dynatrace.com/docs/observe/application-observability/distributed-tracing/detect-performance-issues"
    ]
   },
   {
    "t": "Context propagation: passing the baton",
    "e": "🏃",
    "k": "In a relay race, each runner passes the same baton. If one runner drops it, the race looks like two different races.",
    "n": "The caller adds a header, **traceparent**, from the **W3C Trace Context** standard. It carries the trace ID and parent span ID. That is **context propagation**. If a proxy or queue drops it, the trace breaks in two.",
    "v": {
     "type": "code",
     "lang": "HTTP header · W3C Trace Context",
     "code": "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\n#            ver  trace-id (32 hex)               parent span-id    flags (01 = sampled)\ntracestate:  dt=...,vendor2=...   # vendor-specific extra data",
     "note": "**Gotcha:** API gateways, older proxies and async messaging must forward the header, or traces split."
    },
    "w": "In a PurePath, a call that ends at an external or “unmonitored” node often marks where propagation stops."
   },
   {
    "t": "What OpenTelemetry is",
    "e": "🧰",
    "k": "A universal plug. Every country has different sockets, but this plug fits all of them.",
    "n": "**OpenTelemetry** is the CNCF standard for traces, metrics and logs. It has an **SDK**, **instrumentation libraries**, and the **Collector**, which receives, processes and exports data using **OTLP**. Dynatrace ingests OTLP natively.",
    "v": {
     "type": "flow",
     "nodes": [
      [
       "📚",
       "API + SDK",
       "in your code"
      ],
      [
       "🔌",
       "Auto-instrumentation",
       "frameworks, libraries"
      ],
      [
       "🏭",
       "OTel Collector",
       "receive · process · export"
      ],
      [
       "📮",
       "OTLP/HTTP",
       "protobuf"
      ],
      [
       "☁️",
       "Dynatrace",
       "/api/v2/otlp"
      ]
     ]
    },
    "w": "Settings → Server-side service monitoring → Span settings exist in Managed too; check whether your teams use OpenTelemetry."
   },
   {
    "t": "Sending OTLP to Dynatrace",
    "e": "📮",
    "k": "You write the address on the envelope and add a stamp. No stamp, the post office refuses the letter.",
    "n": "Send OTLP over **HTTP with protobuf** to slash a p i slash v two slash o t l p, with an API token holding **openTelemetryTrace.ingest**, **metrics.ingest** and **logs.ingest**. Dynatrace expects **delta** metrics. Send directly, via ActiveGate, or via a Collector.",
    "v": {
     "type": "code",
     "lang": "yaml · OpenTelemetry Collector",
     "code": "receivers:\n  otlp:\n    protocols:\n      grpc: { endpoint: 0.0.0.0:4317 }   # apps can still use gRPC to the collector\n      http: { endpoint: 0.0.0.0:4318 }\nprocessors:\n  memory_limiter: { check_interval: 1s, limit_percentage: 80 }\n  batch: {}\n  cumulativetodelta: {}                 # Dynatrace wants delta metrics\nexporters:\n  otlphttp/dynatrace:\n    endpoint: \"https://abc12345.live.dynatrace.com/api/v2/otlp\"\n    headers: { Authorization: \"Api-Token ${env:DT_API_TOKEN}\" }\nservice:\n  pipelines:\n    traces:  { receivers: [otlp], processors: [memory_limiter, batch], exporters: [otlphttp/dynatrace] }\n    metrics: { receivers: [otlp], processors: [memory_limiter, cumulativetodelta, batch], exporters: [otlphttp/dynatrace] }\n    logs:    { receivers: [otlp], processors: [memory_limiter, batch], exporters: [otlphttp/dynatrace] }",
     "note": "Dynatrace also publishes its own **Dynatrace OTel Collector** distribution with tested components."
    },
    "w": "In Managed the OTLP endpoint lives on your cluster or ActiveGate URL. Check the Managed docs for your version before trying.",
    "img": [
     "otel-ingest.webp",
     "Official diagram: OTLP ingest straight to the API or through an OpenTelemetry Collector.",
     "https://docs.dynatrace.com/docs/ingest-from/opentelemetry"
    ]
   },
   {
    "t": "OneAgent or OpenTelemetry?",
    "e": "⚖️",
    "k": "An automatic robot vacuum cleans everything alone. A broom lets you clean exactly the corner you want. Smart families use both.",
    "n": "**OneAgent**: no code change, code-level depth, automatic topology. **OpenTelemetry**: vendor neutral, works where agents cannot, custom spans. Most enterprises use both, with one owner per service to avoid duplicate spans.",
    "v": {
     "type": "compare",
     "cols": [
      [
       "OneAgent",
       [
        "No code change, auto-discovery",
        "Code-level detail, method hotspots",
        "Automatic Smartscape topology",
        "Needs install rights on the host or node"
       ]
      ],
      [
       "OpenTelemetry",
       [
        "Vendor-neutral standard (CNCF)",
        "Works where agents cannot run",
        "Developers control custom spans",
        "You manage SDKs, Collectors, sampling"
       ]
      ]
     ],
     "note": "**Gotcha:** OneAgent + OTel SDK exporting the same process = duplicate traces. Decide one owner per service."
    },
    "w": "Ask: which of our apps cannot run OneAgent? Those are your OpenTelemetry candidates."
   },
   {
    "t": "Sampling: you cannot keep every grain of sand",
    "e": "🏖️",
    "k": "You cannot photograph every grain of sand on the beach. You take smart pictures: all the strange shells, and a few normal ones.",
    "n": "**Sampling** decides which spans to keep. **Head-based** decides at the start: cheap, but can miss rare errors. **Tail-based** decides at the end and keeps errors, but the Collector must buffer. OneAgent uses **adaptive traffic management**.",
    "v": {
     "type": "compare",
     "cols": [
      [
       "Head-based",
       [
        "Decision at trace start",
        "Cheap, simple, predictable",
        "May drop the rare error you need"
       ]
      ],
      [
       "Tail-based",
       [
        "Decision after the trace ends",
        "Keep errors + slow traces",
        "Collector must buffer → memory, sticky routing"
       ]
      ]
     ],
     "note": "OneAgent uses **adaptive traffic management** to cap volume while staying representative."
    },
    "w": "Settings → Server-side service monitoring → Deep monitoring: look for capture and traffic settings."
   },
   {
    "t": "eBPF and automatic instrumentation",
    "e": "🔬",
    "k": "A magic magnifying glass that watches through the walls of the house, without entering any room.",
    "n": "**eBPF** runs safe programs in the Linux kernel to see network calls and latency without touching code. Great coverage, but in-process instrumentation still sees deeper: methods, statements, exceptions.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🧠",
       "In-process (OneAgent code module, OTel SDK)",
       "Method level, DB statements, exceptions, business attributes",
       "hot"
      ],
      [
       "🔬",
       "eBPF (kernel level)",
       "Network calls, latency, process activity, no code change"
      ],
      [
       "🐧",
       "Linux kernel",
       "Runs the verified eBPF program safely"
      ]
     ]
    },
    "w": "Your AIX and Solaris hosts cannot use eBPF, which only exists on Linux. A good reason to know your platform mix."
   },
   {
    "t": "Lab: find a broken trace",
    "e": "🧪",
    "k": "Two puzzle halves. Your job is to find which piece of tape is missing between them.",
    "n": "Lab: two services, one with OneAgent and one with the OTel SDK. Check one trace covers both. Strip the traceparent header with a proxy and watch it split. That gives you a real story for the interview.",
    "v": {
     "type": "code",
     "lang": "DQL · spans",
     "code": "fetch spans, from: now() - 30m\n| filter service.name == \"payment-service\"\n| filter isNull(span.parent_id)           // root spans here = broken propagation?\n| summarize roots = count(), by: { span.name }\n| sort roots desc",
     "note": "Field names can differ between OneAgent and OTel spans. Inspect one record first with **| limit 1**."
    },
    "w": "Do this lab in a free SaaS trial, not at work. The DQL shown needs Grail."
   }
  ],
  "quiz": [
   {
    "q": "Which header carries the trace ID between services in the W3C standard?",
    "o": [
     "x-request-id",
     "traceparent",
     "authorization"
    ],
    "a": 1,
    "why": "W3C Trace Context defines traceparent (and tracestate)."
   },
   {
    "q": "Which protocol variant does the Dynatrace OTLP API endpoint accept?",
    "o": [
     "OTLP over HTTP with protobuf",
     "Only Zipkin JSON",
     "SNMP traps"
    ],
    "a": 0,
    "why": "Send OTLP/HTTP protobuf to /api/v2/otlp. Apps can still use gRPC to a local Collector, which then exports over HTTP."
   },
   {
    "q": "You must keep every error trace but only 5% of normal ones. Which sampling?",
    "o": [
     "Head-based 5%",
     "Tail-based sampling in the Collector",
     "No sampling ever"
    ],
    "a": 1,
    "why": "Only tail-based sampling sees the outcome of the trace before deciding."
   }
  ],
  "interview": [
   {
    "q": "Traces are broken between two services. How do you investigate?",
    "a": "Confirm both services are instrumented (OneAgent or OTel), then check **context propagation**: is **traceparent** present on the outgoing call and on arrival? Look at intermediaries: **API gateway**, **service mesh**, **load balancer**, **message queue** (needs propagation in message headers), and **async thread pools**. Check for two instrumentations conflicting. Use DQL to find root spans where you expect children. Fix by enabling header forwarding or adding propagation in messaging code."
   },
   {
    "q": "A client wants to go \"100% OpenTelemetry\" and remove OneAgent. Your advice?",
    "a": "Respect the goal (vendor neutrality) but explain trade-offs: they lose **zero-touch code-level depth**, automatic **process and host topology**, and must own **SDK upgrades**, **Collector operations**, **sampling** and **semantic conventions**. Propose a hybrid: OTel for custom spans and where agents cannot run, OneAgent for hosts and Kubernetes, with one owner per service to avoid duplicates, and a Collector layer for routing and enrichment."
   }
  ]
 },
 {
  "id": 4,
  "phase": "Phase II · Advanced observability",
  "minutes": 7,
  "title": "Smartscape and Davis AI",
  "blurb": "Topology, vertical and horizontal dependencies, baselines, events, problems and root cause.",
  "scenes": [
   {
    "t": "Smartscape: the living map",
    "e": "🗺️",
    "k": "A map of the city that draws itself. It shows which houses are on which street, and who visits whom.",
    "n": "**Smartscape** is the live **topology**. **Vertical**: what runs on what, from application to service, process, host and data centre. **Horizontal**: who calls whom. Davis uses this graph for causation.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "📱",
       "Applications",
       "Web / mobile front ends (RUM)"
      ],
      [
       "🔗",
       "Services",
       "calls ↔ calls (horizontal)",
       "hot"
      ],
      [
       "⚙️",
       "Processes",
       "process groups and instances"
      ],
      [
       "🖥️",
       "Hosts",
       "VMs, bare metal, k8s nodes"
      ],
      [
       "☁️",
       "Data centres / cloud",
       "AZs, regions, clusters"
      ]
     ],
     "note": "Vertical = **runs on**. Horizontal = **calls / connects to**."
    },
    "w": "Your menu has Smartscape Topology. Open it and click one host: you will see vertical and horizontal links.",
    "img": [
     "smartscape-applications.webp",
     "Smartscape classic: the vertical stack from applications down to data centres.",
     "https://docs.dynatrace.com/docs/analyze-explore-automate/smartscape-classic"
    ]
   },
   {
    "t": "Discovery without configuration",
    "e": "🔭",
    "k": "You do not tell the helper which toys exist. It finds every toy alone, even new ones that arrive tomorrow.",
    "n": "OneAgent groups processes into **process groups** and detects **services** automatically. You can customise this with **process group detection** and **service detection rules**. Get it right early, since history and alerting depend on it.",
    "v": {
     "type": "chips",
     "items": [
      [
       "Process group detection",
       "How processes are grouped. Customise with rules or DT_CLUSTER_ID"
      ],
      [
       "Service detection",
       "How endpoints become services. Rules can merge or split"
      ],
      [
       "Host groups",
       "Set at install; influences process grouping"
      ],
      [
       "Tags",
       "Auto-tags from rules, k8s labels, cloud tags"
      ],
      [
       "Naming rules",
       "Readable names for processes and services"
      ],
      [
       "Management zones / segments",
       "Slice the topology for teams"
      ]
     ]
    },
    "w": "Settings → Processes and containers → Process group detection. See whether your team added custom rules."
   },
   {
    "t": "Baselines: knowing what normal looks like",
    "e": "📏",
    "k": "You know your friend is usually happy at school. If one day he is sad, you notice. That is a baseline.",
    "n": "Davis learns **automatic baselines**, including seasonality. Leaving the band is an **anomaly**. Use **static thresholds** for contracts and hard limits, like a full disk, and baselines when you cannot predict normal.",
    "v": {
     "type": "compare",
     "cols": [
      [
       "Automatic baseline / auto-adaptive",
       [
        "Learns normal, including seasonality",
        "Great for response time and failure rate",
        "Fewer false alarms on noisy signals"
       ]
      ],
      [
       "Static threshold",
       [
        "Fixed number from a contract or limit",
        "Disk 95% full, SLA 2 s",
        "Predictable, easy to explain to auditors"
       ]
      ]
     ]
    },
    "w": "Settings → Anomaly detection → Services. Note which services use automatic and which use fixed thresholds."
   },
   {
    "t": "Events and problems",
    "e": "🚨",
    "k": "Many small bells ring: \"I am slow\", \"I am out of memory\", \"I am failing\". The teacher groups them into one story: one problem.",
    "n": "Abnormal behaviour raises **events**: slowdown, error, availability, resource contention. Davis correlates related events into one **problem**, with affected entities, impact and root cause. One problem instead of fifty alerts.",
    "v": {
     "type": "flow",
     "nodes": [
      [
       "🔔",
       "Events",
       "slowdown · error · availability · resource"
      ],
      [
       "🧲",
       "Correlation",
       "topology + time"
      ],
      [
       "📦",
       "Problem P-24103",
       "one story"
      ],
      [
       "🎯",
       "Root cause",
       "+ impact + evidence"
      ]
     ]
    },
    "w": "Your dashboard problem tiles (all problems, prod problems) link to the Problems page. Open one problem and find its root cause section.",
    "img": [
     "problem-details.webp",
     "Problem details on SaaS: impact, root cause and evidence on one page.",
     "https://docs.dynatrace.com/docs/dynatrace-intelligence/problems-app"
    ]
   },
   {
    "t": "How Davis finds the root cause",
    "e": "🌳",
    "k": "The last domino fell. Davis walks back along the line of dominoes until it finds the first one that was pushed.",
    "n": "Davis is **causal AI**. From the affected entity it walks the Smartscape graph, checking each dependency for anomalies. The deepest abnormal one that explains the rest is the **root cause**. This is a kind of **fault tree analysis**.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "📱",
       "Checkout app: users affected",
       "impact",
       "warn"
      ],
      [
       "🔗",
       "Payment service: slowdown",
       "symptom"
      ],
      [
       "⚙️",
       "PostgreSQL process: high latency",
       "symptom"
      ],
      [
       "🖥️",
       "DB host: disk 100% full",
       "root cause",
       "hot"
      ]
     ],
     "note": "Davis walks the graph from symptoms to the **deepest abnormal dependency**."
    },
    "w": "In a classic problem, open “Visual resolution path”. It replays how Davis walked the graph.",
    "img": [
     "problem-graph.webp",
     "Smartscape problem graph: from symptoms to the root-cause entity.",
     "https://docs.dynatrace.com/docs/analyze-explore-automate/smartscape/smartscape-views/problem-graph"
    ]
   },
   {
    "t": "Maintenance windows: your old friend",
    "e": "🛠️",
    "k": "When the plumber comes to fix the pipes, you tell the doctor: \"do not panic if water stops for one hour\".",
    "n": "A **maintenance window** has a scope, a schedule and a behaviour: detect and alert, detect without alerting, or disable detection. Suppressing alerts keeps evidence. Disabling detection loses it. Automate windows through the **Settings API**.",
    "v": {
     "type": "chips",
     "items": [
      [
       "Detect + alert",
       "Business as usual, just labelled"
      ],
      [
       "Detect, no alert",
       "Problems still recorded, notifications suppressed"
      ],
      [
       "Disable detection",
       "No problems at all; you lose evidence"
      ],
      [
       "Scope",
       "Entities, tags, management zone"
      ],
      [
       "Schedule",
       "Once, daily, weekly, monthly"
      ],
      [
       "Automation",
       "Create via Settings 2.0 API from ServiceNow change"
      ]
     ]
    },
    "w": "This is your home ground. Settings → Maintenance windows: check which behaviour your team uses, and why."
   },
   {
    "t": "Davis in DQL",
    "e": "🔎",
    "k": "The teacher writes every story in a notebook. You can open the notebook and search it.",
    "n": "On Grail, problems are data. **dt.davis.problems** holds problems and **dt.davis.events** holds events, so you can report mean time to resolve or top root causes. A favourite interview exercise.",
    "v": {
     "type": "code",
     "lang": "DQL · problems",
     "code": "fetch dt.davis.problems, from: now() - 7d\n| filter not(dt.davis.is_duplicate)\n| fieldsAdd duration_min = toLong((event.end - event.start) / 1m)\n| summarize problems = count(), avg_minutes = avg(duration_min),\n            by: { event.category }\n| sort problems desc",
     "note": "Always inspect the real schema first: **fetch dt.davis.problems | limit 1**. Field names evolve."
    },
    "w": "No Grail on Managed. Use the Problems API v2 or the Problems page filters instead."
   }
  ],
  "quiz": [
   {
    "q": "Service A calls service B. Which Smartscape direction is that?",
    "o": [
     "Vertical",
     "Horizontal",
     "Diagonal"
    ],
    "a": 1,
    "why": "Calls between peers are horizontal. Vertical is “runs on”."
   },
   {
    "q": "You want alerts silenced during a patch but still want to see problems later. Which behaviour?",
    "o": [
     "Disable problem detection",
     "Detect problems but do not alert",
     "Delete the host"
    ],
    "a": 1,
    "why": "You keep evidence and history, without waking anyone."
   },
   {
    "q": "Why can Davis name a root cause and not just show correlated charts?",
    "o": [
     "It walks the real dependency graph (Smartscape)",
     "It reads Jira tickets",
     "It always blames the network"
    ],
    "a": 0,
    "why": "Topology gives causal direction, so Davis follows dependencies from symptom to cause."
   }
  ],
  "interview": [
   {
    "q": "How is Davis different from a classic threshold-based alerting tool?",
    "a": "**Automatic baselining** with seasonality, **topology-aware correlation** (Smartscape), and **causal root-cause analysis** that groups many events into one **problem** with impact and evidence. Classic tools fire one alert per threshold breach and leave humans to correlate. Mention you still use **static thresholds** for SLAs and hard limits, and **custom events / metric events** for business signals."
   },
   {
    "q": "Operations complain of too many Dynatrace notifications. What do you change?",
    "a": "Map who needs what. Use **alerting profiles** (severity, delay, scope by tag/zone) or **workflows** with filters on problem category and affected entities; route by team. Review **anomaly detection settings** for noisy services, add **maintenance windows** linked to changes, fix bad **service detection** that merges unrelated traffic, and delete duplicate custom alerts. Measure: notifications per week and MTTA before and after."
   }
  ]
 },
 {
  "id": 5,
  "phase": "Phase II · Advanced observability",
  "minutes": 9,
  "title": "Grail, OpenPipeline and DQL",
  "blurb": "Lakehouse design, buckets and retention, ingest processing, and DQL from basic to advanced.",
  "scenes": [
   {
    "t": "Grail: one giant library",
    "e": "📚",
    "k": "Before, comics were in one box, letters in another, photos in a third. Grail is one huge library where everything sits together and you can search all of it at once.",
    "n": "**Grail** is the Dynatrace **data lakehouse**: logs, metrics, spans, events and topology together. It is **schema-on-read**, uses **massively parallel processing**, and shares entity context, so one **DQL** query can join everything.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "🔎",
       "DQL",
       "one language for all data types",
       "hot"
      ],
      [
       "⚡",
       "Massively parallel query engine",
       "scans in parallel, no index to maintain"
      ],
      [
       "🗂️",
       "Buckets",
       "logs · spans · events · bizevents · metrics, each with retention"
      ],
      [
       "🧹",
       "OpenPipeline",
       "processing at ingest"
      ],
      [
       "📥",
       "Ingest",
       "OneAgent · OTLP · APIs · extensions · cloud"
      ]
     ]
    },
    "w": "SaaS only. On Managed you use the classic Logs viewer, Data Explorer and USQL. Learn DQL in the free trial."
   },
   {
    "t": "Buckets and retention",
    "e": "🪣",
    "k": "Different buckets for different toys. Some toys you keep for a week, some for years.",
    "n": "Grail data lives in **buckets**, each with one data type and a **retention period**, such as **default_logs**. Create custom buckets, like audit logs for one year or debug logs for ten days. Buckets mean retention, cost and permissions.",
    "v": {
     "type": "chips",
     "items": [
      [
       "default_logs",
       "Default log bucket (35 days by default)"
      ],
      [
       "custom: audit_logs_1y",
       "Compliance logs, long retention"
      ],
      [
       "custom: debug_logs_10d",
       "Noisy logs, short retention, cheaper"
      ],
      [
       "bizevents",
       "Business events bucket"
      ],
      [
       "Retention",
       "Per bucket, drives storage cost"
      ],
      [
       "IAM",
       "Policies can restrict which buckets a group can query"
      ]
     ]
    },
    "w": "Managed equivalent: log retention is set at cluster and environment level. Ask how long your logs are kept."
   },
   {
    "t": "OpenPipeline: the sorting factory",
    "e": "🏭",
    "k": "Before toys go to the shelves, a factory cleans them, adds name tags, hides private stickers and sends each to the right shelf.",
    "n": "**OpenPipeline** processes data on arrival: **routing**, **parsing**, **masking** for GDPR, **extraction** of metrics and business events, then **storage** to a bucket, or a **drop**. It is the main cost and compliance lever.",
    "v": {
     "type": "flow",
     "nodes": [
      [
       "📥",
       "Ingest source",
       "logs · spans · events"
      ],
      [
       "🛣️",
       "Routing",
       "match condition"
      ],
      [
       "🧹",
       "Processing",
       "parse · mask · enrich"
      ],
      [
       "📈",
       "Extraction",
       "metrics · bizevents"
      ],
      [
       "🪣",
       "Storage",
       "bucket or drop"
      ]
     ],
     "note": "**Gotcha:** mask personal data at ingest. Once stored, it is in the bucket for its whole retention."
    },
    "w": "Closest Managed feature: log processing rules and sensitive data masking in Settings → Log Monitoring."
   },
   {
    "t": "DQL basics: a pipe of instructions",
    "e": "🚰",
    "k": "Water flows through pipes. Each pipe does one job: filter the dirt, count the drops, sort them.",
    "n": "DQL starts with a **source**, like **fetch logs**, then each **pipe** passes records on: **filter**, **fields**, **fieldsAdd**, **summarize**, **sort**, **limit**. Always set a timeframe. Read a query aloud, as you would for a client.",
    "v": {
     "type": "code",
     "lang": "DQL · basics",
     "code": "fetch logs, from: now() - 1h\n| filter loglevel == \"ERROR\"\n| summarize errors = count(), by: { dt.entity.host, k8s.namespace.name }\n| sort errors desc\n| limit 10"
    },
    "w": "Practise in a SaaS trial Notebook. At work, the closest thing is the Data Explorer “Code” tab, which uses the metric selector syntax.",
    "img": [
     "notebook-dql.webp",
     "A DQL section in a Notebook (SaaS).",
     "https://docs.dynatrace.com/docs/analyze-explore-automate/dashboards-and-notebooks/notebooks"
    ]
   },
   {
    "t": "DQL for metrics: timeseries",
    "e": "📈",
    "k": "Instead of counting each raindrop, you look at the rain gauge every minute.",
    "n": "Query metrics with **timeseries**: an aggregation, a metric key and a split with **by**. Use **arrayAvg** to filter on the result. **makeTimeseries** turns records like logs into a time series.",
    "v": {
     "type": "code",
     "lang": "DQL · metrics",
     "code": "timeseries cpu = avg(dt.host.cpu.usage), by: { dt.entity.host }, from: now() - 2h\n| fieldsAdd avg_cpu = arrayAvg(cpu)\n| filter avg_cpu > 80\n| sort avg_cpu desc\n\n// Records → time series\nfetch logs, from: now() - 6h\n| filter loglevel == \"ERROR\"\n| makeTimeseries errors = count(), interval: 5m"
    },
    "w": "Data Explorer: build “CPU usage %” split by host. That is the classic version of the same timeseries query."
   },
   {
    "t": "DQL advanced: parse, lookup, join",
    "e": "🧩",
    "k": "You read a secret code in a letter, then look up the name in your address book.",
    "n": "Three advanced skills. **parse** extracts fields with **DPL**. **lookup** enriches records from another query. **join** combines datasets on a key. Practise until you can write them without help.",
    "v": {
     "type": "code",
     "lang": "DQL · advanced",
     "code": "fetch logs, from: now() - 1h\n| filter contains(content, \"payment failed\")\n| parse content, \"LD 'user=' WORD:user_id LD 'amount=' DOUBLE:amount\"\n| lookup [ fetch dt.entity.host | fields id, host_name = entity.name ],\n         sourceField: dt.entity.host, lookupField: id\n| summarize failures = count(), lost = sum(amount), by: { lookup.host_name }\n| sort lost desc",
     "note": "**lookup** prefixes the joined fields with **lookup.** by default. Use **prefix:** to change it."
    },
    "w": "Nothing comparable on Managed. This is pure SaaS interview preparation."
   },
   {
    "t": "Writing queries that are fast and cheap",
    "e": "💸",
    "k": "Looking for your sock in one drawer is faster than emptying the whole house.",
    "n": "Query cost can depend on **data scanned**. Use short timeframes, filter early, prefer metrics for dashboards that refresh often, and use **scanLimitGBytes** when exploring. Treat scan cost like database indexes.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "⏱️",
       "Short timeframe",
       "from: now() - 1h, not 30 days"
      ],
      [
       "🎯",
       "Filter early",
       "bucket, namespace, host, log level first",
       "hot"
      ],
      [
       "📈",
       "Metrics for dashboards",
       "extract metrics in OpenPipeline"
      ],
      [
       "🧪",
       "Explore safely",
       "scanLimitGBytes · samplingRatio · limit"
      ],
      [
       "🪣",
       "Right bucket",
       "short-retention bucket for noisy data",
       "warn"
      ]
     ]
    },
    "w": "Managed has no scan billing, but the same habits keep your team dashboards fast."
   },
   {
    "t": "Lab: your first investigation notebook",
    "e": "📓",
    "k": "You become the detective. Your notebook keeps every clue in order, so others can follow your thinking.",
    "n": "Lab: build a four-step notebook. Errors per service, CPU of the hosts behind it, slowest spans, open problems. Add notes between steps. Clients receive exactly this kind of document.",
    "v": {
     "type": "stack",
     "layers": [
      [
       "1️⃣",
       "Errors per service",
       "fetch logs | filter loglevel==\"ERROR\" | summarize by service"
      ],
      [
       "2️⃣",
       "Host CPU behind it",
       "timeseries avg(dt.host.cpu.usage)"
      ],
      [
       "3️⃣",
       "Slowest spans",
       "fetch spans | sort duration desc | limit 20"
      ],
      [
       "4️⃣",
       "Open problems",
       "fetch dt.davis.problems | filter event.status==\"ACTIVE\"",
       "hot"
      ],
      [
       "📝",
       "Markdown notes",
       "Explain each step for the client team"
      ]
     ]
    },
    "w": "Do it in the trial tenant, then compare with how you would investigate the same thing at work.",
    "img": [
     "notebook-sections.webp",
     "A long notebook organised with the Sections panel.",
     "https://docs.dynatrace.com/docs/analyze-explore-automate/dashboards-and-notebooks/notebooks"
    ]
   }
  ],
  "quiz": [
   {
    "q": "Which command do you use to query a metric like dt.host.cpu.usage?",
    "o": [
     "fetch metrics",
     "timeseries",
     "select"
    ],
    "a": 1,
    "why": "Metrics are queried with timeseries; fetch is for records like logs, spans and events."
   },
   {
    "q": "Where should you mask credit card numbers in logs?",
    "o": [
     "In a dashboard tile",
     "In OpenPipeline at ingest",
     "After 35 days"
    ],
    "a": 1,
    "why": "Masking at ingest prevents personal data from ever being stored."
   },
   {
    "q": "What controls how long logs are kept in Grail?",
    "o": [
     "The retention of the bucket they are stored in",
     "The OneAgent version",
     "The browser cache"
    ],
    "a": 0,
    "why": "Retention is a bucket property; route data to buckets that fit its value."
   }
  ],
  "interview": [
   {
    "q": "A client ingests 2 TB of logs a day and costs explode. What do you do?",
    "a": "Measure first: volume by **source, namespace, log level**, and query cost (scanned GB). Then act in **OpenPipeline**: **drop** debug and health-check noise, **route** low-value logs to **short-retention buckets**, keep audit logs in long-retention buckets, **extract metrics** for dashboards instead of scanning logs, and **mask** PII. Fix sources too: log levels in apps, duplicate shippers. Review queries and dashboards for wide timeframes. Report before/after volume and cost."
   },
   {
    "q": "Write me a DQL query: top 5 services by error rate in the last 2 hours.",
    "a": "**fetch spans, from: now() - 2h** | **filter** span kind server (or request root) | **summarize total = count(), failed = countIf(request.is_failed == true), by: { dt.entity.service }** | **fieldsAdd error_rate = 100.0 * failed / total** | **sort error_rate desc** | **limit 5**. Then say you would check the exact field names on that tenant first, and that for a dashboard you would use the built-in service metrics instead of scanning spans every minute."
   }
  ]
 },
 {
  "id": 6,
  "phase": "Phase III · Engineering and automation",
  "minutes": 9,
  "title": "Configuration as code",
  "blurb": "Settings 2.0, tokens and OAuth, Monaco, Terraform, and a CI/CD pipeline for Dynatrace config.",
  "scenes": [
   {
    "t": "Why click-ops does not scale",
    "e": "🧱",
    "k": "Building one sandcastle by hand is fun. Building one hundred identical ones by hand is impossible. You need a mould.",
    "n": "Hand-clicked configuration drifts, has no review and cannot be rolled back. **Configuration as code** keeps config in **Git**, reviews it in **pull requests** and deploys it with a pipeline. That is platform engineering.",
    "v": {
     "type": "compare",
     "cols": [
      [
       "Click-ops",
       [
        "Manual, slow, error-prone",
        "Environments drift apart",
        "No review, no rollback",
        "Knowledge stays in heads"
       ]
      ],
      [
       "Configuration as code",
       [
        "Git = single source of truth",
        "Pull request review + history",
        "Same config promoted dev → prod",
        "Reproducible, auditable"
       ]
      ]
     ]
    },
    "w": "Ask your team: is any of our Dynatrace config in Git today, or is it all clicked by hand?"
   },
   {
    "t": "Settings 2.0: one model for config",
    "e": "🧾",
    "k": "Every setting is a form with a known shape. Because the shape is known, a robot can fill it in.",
    "n": "Modern configuration is **Settings 2.0** objects. Each follows a **schema**, like **builtin:alerting.profile**, and has a **scope**. Because every setting is schema-validated JSON, tools can generate and deploy it.",
    "v": {
     "type": "code",
     "lang": "bash · Settings 2.0 API",
     "code": "# List available schemas\ncurl -s -H \"Authorization: Api-Token $DT_TOKEN\" \\\n  \"$DT_URL/api/v2/settings/schemas\" | jq '.items[].schemaId' | head\n\n# Read objects of one schema\ncurl -s -H \"Authorization: Api-Token $DT_TOKEN\" \\\n  \"$DT_URL/api/v2/settings/objects?schemaIds=builtin:alerting.profile&scopes=environment\""
    },
    "w": "Managed supports Settings 2.0 too. With a read-only token, list schemas from your cluster API."
   },
   {
    "t": "Tokens, scopes and OAuth clients",
    "e": "🔑",
    "k": "Each key opens only the doors it needs. The cleaner gets the kitchen key, not the safe key.",
    "n": "Classic **API tokens** have **scopes** like settings dot read. Platform APIs use **OAuth clients** and **IAM**. Follow **least privilege**: one token per purpose, minimal scopes, an expiry date, and a vault. Never store tokens in Git.",
    "v": {
     "type": "chips",
     "items": [
      [
       "settings.read / settings.write",
       "Settings 2.0 objects"
      ],
      [
       "ReadConfig / WriteConfig",
       "Classic configuration APIs"
      ],
      [
       "InstallerDownload",
       "Download OneAgent installers"
      ],
      [
       "metrics.ingest · logs.ingest",
       "Data ingest APIs"
      ],
      [
       "OAuth client",
       "Platform APIs: documents, automation, storage"
      ],
      [
       "Least privilege",
       "One token per purpose, expiry, vault, rotation"
      ]
     ]
    },
    "w": "Access tokens page: look at token names and scopes. Never create or copy tokens without approval."
   },
   {
    "t": "Monaco: the Dynatrace mould",
    "e": "🐵",
    "k": "Monaco is the mould. You describe the castle once, and it builds the same castle in every sandbox.",
    "n": "**Monaco** is the official configuration-as-code CLI. A **manifest** lists **projects** and **environments**. Each config is YAML plus a JSON **template**. You can **download** existing config, then **deploy** anywhere, with references between configs.",
    "v": {
     "type": "code",
     "lang": "yaml · manifest.yaml",
     "code": "manifestVersion: 1.0\nprojects:\n  - name: platform-baseline\nenvironmentGroups:\n  - name: nonprod\n    environments:\n      - name: dev\n        url: { type: environment, value: DT_DEV_URL }\n        auth:\n          token: { name: DT_DEV_TOKEN }\n          oAuth:\n            clientId:     { name: DT_CLIENT_ID }\n            clientSecret: { name: DT_CLIENT_SECRET }\n  - name: prod\n    environments:\n      - name: prod\n        url: { type: environment, value: DT_PROD_URL }\n        auth:\n          token: { name: DT_PROD_TOKEN }"
    },
    "w": "Monaco works with Managed environments too, which makes it a strong tool for Managed to SaaS migrations."
   },
   {
    "t": "A Monaco config and the commands",
    "e": "⌨️",
    "k": "The mould has holes where you pour different colours: blue sand for test, red sand for production.",
    "n": "A config has an ID, a name, a template and a schema. Parameters change per environment. **monaco download** pulls config, a **dry run** validates it, and **deploy** applies it. Dry run on every pull request, deploy after merge.",
    "v": {
     "type": "code",
     "lang": "yaml + bash · Monaco",
     "code": "# platform-baseline/alerting/config.yaml\nconfigs:\n  - id: payments-critical\n    config:\n      name: \"Payments - critical\"\n      template: alerting-profile.json\n      parameters:\n        team: \"payments\"\n    type:\n      settings:\n        schema: builtin:alerting.profile\n        scope: environment\n\n# Commands\nmonaco download --manifest manifest.yaml --environment dev\nmonaco deploy manifest.yaml --environment dev --dry-run\nmonaco deploy manifest.yaml --environment dev"
    },
    "w": "If allowed, a monaco download from a non-production environment is a safe way to see your real config as code."
   },
   {
    "t": "Terraform provider",
    "e": "🏗️",
    "k": "Some families already use one big toolbox for everything in the house. Dynatrace can live in that same toolbox.",
    "n": "The **Terraform provider**, dynatrace-oss slash dynatrace, manages config with **state**, **plan** and **apply**, and can **export** an environment. Pick Terraform if the platform team already uses it, Monaco if a Dynatrace team owns the config.",
    "v": {
     "type": "code",
     "lang": "hcl · Terraform",
     "code": "terraform {\n  required_providers {\n    dynatrace = { source = \"dynatrace-oss/dynatrace\" }\n  }\n}\n# Credentials from env: DYNATRACE_ENV_URL, DYNATRACE_API_TOKEN\n\nresource \"dynatrace_maintenance\" \"payments_patch\" {\n  enabled = true\n  general_properties {\n    name        = \"Payments monthly patch\"\n    type        = \"PLANNED\"\n    suppression = \"DETECT_PROBLEMS_DONT_ALERT\"\n  }\n  schedule {\n    type = \"MONTHLY\"\n    # ... start, end, day of month, time zone\n  }\n  filters { filter { entity_tags = [\"team:payments\"] } }\n}",
     "note": "Resource names and fields evolve with provider versions. Pin the version and check the provider docs."
    },
    "w": "Ask whether your infrastructure team already uses Terraform. That usually decides the tool."
   },
   {
    "t": "A CI/CD pipeline for Dynatrace",
    "e": "🔄",
    "k": "A conveyor belt: check the toy, test it in the small room, then put it in the big room.",
    "n": "The flow: change YAML in a branch, open a pull request, CI runs a dry run, a reviewer approves, deploy to dev, pass a gate, deploy to prod. Also send **deployment events** and use **Site Reliability Guardian** for release checks.",
    "v": {
     "type": "flow",
     "nodes": [
      [
       "🌿",
       "Branch + PR",
       "YAML change"
      ],
      [
       "🧪",
       "CI checks",
       "lint · monaco --dry-run"
      ],
      [
       "👀",
       "Review",
       "approval"
      ],
      [
       "🟢",
       "Deploy dev",
       "monaco deploy -e dev"
      ],
      [
       "🚦",
       "Gate",
       "manual / SRG check"
      ],
      [
       "🔴",
       "Deploy prod",
       "monaco deploy -e prod"
      ]
     ]
    },
    "w": "Compare with your change process. Where would an approval gate sit?"
   },
   {
    "t": "Example: GitLab CI job",
    "e": "🦊",
    "k": "The recipe the conveyor belt follows, written down so it is the same every time.",
    "n": "A minimal GitLab pipeline: validate on merge requests, deploy dev on main, deploy prod manually. Explain the principles: one artefact promoted, secrets in a vault, dry run first, approvals, and scheduled drift checks.",
    "v": {
     "type": "code",
     "lang": "yaml · .gitlab-ci.yml",
     "code": "image: dynatrace/dynatrace-configuration-as-code:latest   # pin a version in real life\nstages: [validate, deploy]\n\nvalidate:\n  stage: validate\n  script: [ \"monaco deploy manifest.yaml --environment dev --dry-run\" ]\n  rules: [ { if: '$CI_PIPELINE_SOURCE == \"merge_request_event\"' } ]\n\ndeploy_dev:\n  stage: deploy\n  script: [ \"monaco deploy manifest.yaml --environment dev\" ]\n  rules: [ { if: '$CI_COMMIT_BRANCH == \"main\"' } ]\n\ndeploy_prod:\n  stage: deploy\n  script: [ \"monaco deploy manifest.yaml --environment prod\" ]\n  rules: [ { if: '$CI_COMMIT_BRANCH == \"main\"', when: manual } ]"
    },
    "w": "Your Apps links list Ansible Automation, so your company already automates. Connect the two in your interview story."
   }
  ],
  "quiz": [
   {
    "q": "What do Settings 2.0 objects always have?",
    "o": [
     "A schema ID and a scope",
     "A Java class",
     "A Grafana panel"
    ],
    "a": 0,
    "why": "Schema defines the shape, scope defines where it applies (environment, host, service…)."
   },
   {
    "q": "What should run on every pull request in a Monaco pipeline?",
    "o": [
     "monaco deploy to prod",
     "monaco deploy --dry-run",
     "Nothing"
    ],
    "a": 1,
    "why": "Dry run validates templates, references and API acceptance without changing the tenant."
   },
   {
    "q": "Where do you store the API tokens used by the pipeline?",
    "o": [
     "In the Git repo for convenience",
     "In a vault or CI secret store, with least privilege and expiry",
     "In a dashboard description"
    ],
    "a": 1,
    "why": "Secrets never go into Git. Least privilege and rotation limit damage."
   }
  ],
  "interview": [
   {
    "q": "Monaco or Terraform for a new client?",
    "a": "It depends on **who owns the config** and **existing tooling**. Terraform if the platform team already uses it for cloud and wants one state-based workflow and plan output. Monaco if a Dynatrace CoE owns it, needs **multi-environment promotion**, templating, **download** of existing config, and Dynatrace-specific coverage (including documents and workflows). They can coexist if each object has one owner. Always pin versions, keep secrets in a vault, dry-run/plan in CI."
   },
   {
    "q": "How would you onboard 50 application teams onto Dynatrace consistently?",
    "a": "Build a **golden baseline** as code: naming rules, **auto-tagging** from k8s labels/cloud tags (team, app, env), **host groups**, **segments or management zones**, IAM groups and policies per team, default **alerting profiles / workflows**, SLO templates, dashboard templates. Each team gets a small parameter file (team name, owners, channels) in a repo; the pipeline renders and deploys. Add docs and a short training. This scales, is auditable, and avoids snowflake configs."
   }
  ]
 }
]);
