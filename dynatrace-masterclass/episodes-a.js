/* Dynatrace Chalkboard Masterclass — lessons 1 to 6.
   Scene fields: t = title, e = emoji, k = kid picture (on screen), n = narration (spoken + captions),
   v = visual {type: flow|stack|compare|chips|code}. **text** = official term (yellow). */
window.EPISODES = (window.EPISODES || []).concat([

/* ================================================================ 01 */
{
  id: 1, phase: 'Phase I · Foundations', minutes: 14,
  title: 'How Dynatrace sees everything',
  blurb: 'SaaS vs Managed, tenants, entities, the four signal types and the big end-to-end picture.',
  scenes: [
    { t: 'The doctor for computers', e: '🩺',
      k: 'Imagine a doctor who never sleeps. Tiny sensors sit on every part of the patient, and one big brain reads them all and says: "the tummy hurts because of what you ate at lunch".',
      n: 'Imagine a doctor who never sleeps. Tiny sensors sit on every part of a patient, and one big brain reads all of them at once. That is Dynatrace. The sensors are **OneAgent** and **OpenTelemetry**. The memory where everything is written down is **Grail**. The map of how body parts connect is **Smartscape**. And the brain that finds the real cause of a problem is **Davis AI**. In this course you will learn each piece, and then how they work together, because that is what an architect is asked about.',
      v: { type: 'flow', nodes: [['🖥️','Your systems','hosts · apps · k8s · cloud'],['🕵️','OneAgent / OTel','collect'],['🚪','ActiveGate','optional relay'],['🧠','Dynatrace platform','Grail · Smartscape · Davis'],['📣','Action','dashboards · alerts · workflows']] } },
    { t: 'Observability in one sentence', e: '🔦',
      k: 'Monitoring tells you "the light is off". Observability lets you ask "why is it off?" even if you never asked that question before.',
      n: '**Monitoring** answers questions you prepared in advance, such as: is the CPU above ninety percent. **Observability** lets you ask new questions about a system from the data it already produces. Dynatrace adds two things on top of plain observability: automatic discovery of everything, and causal analysis. So an interviewer may ask you: what is the difference between monitoring and observability? Answer with that idea, then add that Dynatrace connects signals through topology, so the answer is not just a chart but a cause.',
      v: { type: 'compare', cols: [['Monitoring',['Known questions, set in advance','Static thresholds: CPU > 90%','Tells you that something is wrong']],['Observability',['Ask new questions of existing data','Correlated metrics, logs, traces, events','Tells you why, and what it impacts']]] } },
    { t: 'The four signal types', e: '🧺',
      k: 'Four kinds of notes the doctor keeps: a heartbeat chart, a diary, a footprint trail, and a list of big moments.',
      n: 'Dynatrace stores four main signal types. **Metrics** are numbers over time, like a heartbeat chart. **Logs** are text lines written by programs, like a diary. **Traces** follow one request across many services, like footprints in the snow. **Events** are important moments, like a deployment, a restart, or a problem opening. On top of that you will meet **business events**, **user sessions** from real user monitoring, and **entities**, which describe the things that are monitored. The power comes from linking all of them to the same entity.',
      v: { type: 'chips', items: [['Metrics','Numeric time series. Example key: **dt.host.cpu.usage**'],['Logs','Text records with attributes. Ingested by OneAgent, API, OTel or log forwarders'],['Traces / spans','One request across services. Dynatrace calls its traces **PurePath**'],['Events','Deployments, config changes, Davis problems, custom events'],['Business events','**bizevents**: business data like orders or payments'],['Entities','Monitored things: HOST, SERVICE, PROCESS_GROUP…']] } },
    { t: 'Where Dynatrace lives: SaaS or Managed', e: '🏠',
      k: 'You can rent a flat where the landlord fixes everything (SaaS), or own a house and fix the roof yourself (Managed).',
      n: '**Dynatrace SaaS** runs in clusters operated by Dynatrace on AWS, Azure or Google Cloud, in a region you choose. Updates, scaling and storage are handled for you, and the newest platform features, such as **Grail**, **AppEngine**, **Notebooks** and the new **Dashboards**, are built for SaaS. **Dynatrace Managed** is a cluster you install in your own data centre, usually three or more nodes, managed with help from **Mission Control**. It is chosen for strict data residency or air-gapped networks. In consulting, a very common mission is a **Managed to SaaS migration**.',
      v: { type: 'compare', cols: [['Dynatrace SaaS',['Hosted on AWS, Azure or GCP regions','Grail, AppEngine, Workflows, new Dashboards','Dynatrace runs upgrades and scaling','URL like **abc12345.apps.dynatrace.com**']],['Dynatrace Managed',['Your servers, your network, your ops team','Cluster nodes, usually 3+ for high availability','You plan capacity, backup, upgrades','Classic feature set, no Grail-based apps']]], note: '**Gotcha:** never promise a Managed customer a Grail or AppEngine feature. Check what the target platform supports first.' } },
    { t: 'Tenants and environments', e: '🏢',
      k: 'A big building (cluster) has many flats (environments). Each flat has its own key and its own furniture.',
      n: 'An **environment**, often called a **tenant**, is an isolated Dynatrace instance with its own data, settings and users. It has an **environment ID**, for example a b c one two three four five, and that ID appears in every URL and API call. Companies often run several environments, such as production and non-production, under one **account**. The account is where you manage licensing, users, groups and **IAM policies**, through **Account Management**. Knowing the difference between account level and environment level is a classic interview check.',
      v: { type: 'stack', layers: [['🏦','Account','Subscription (DPS), users, groups, IAM policies, audit','hot'],['🏢','Environment / tenant: prod','ID abc12345 · own data, settings, tokens'],['🏢','Environment / tenant: non-prod','separate data and settings, same account'],['🔑','Access','SSO / SAML, groups → policies → permissions on environments']] } },
    { t: 'Entities: giving every thing a name tag', e: '🏷️',
      k: 'Every toy in the room gets a sticker with a unique number, so nobody mixes up two red cars.',
      n: 'Everything Dynatrace discovers becomes an **entity** with a unique **entity ID**. A server is a **HOST**. A running program is a **PROCESS_GROUP_INSTANCE**, and similar processes are grouped into a **PROCESS_GROUP**. An endpoint that handles requests is a **SERVICE**. A web front end is an **APPLICATION**. Every metric, log and span is tagged with entity IDs, such as **dt.entity.host**. That tag is the glue. It is what lets Davis say: this slow service runs on this process, on this host, which is out of memory.',
      v: { type: 'chips', items: [['HOST-0123ABCD…','A physical or virtual machine'],['PROCESS_GROUP-…','Logical group of similar processes, e.g. all Tomcat nodes of an app'],['PROCESS_GROUP_INSTANCE-…','One running process on one host'],['SERVICE-…','Detected web, database or messaging service'],['APPLICATION-…','A web or mobile front end (RUM)'],['KUBERNETES_CLUSTER-…','A monitored Kubernetes cluster']] } },
    { t: 'The end-to-end path of one data point', e: '🚂',
      k: 'A letter is written, put in an envelope, carried by the postman, sorted at the post office, and then read.',
      n: 'Follow one data point. A Java process slows down. The **OneAgent code module** inside it records a span and metrics. The agent sends them over HTTPS, port four four three, either straight to the cluster or through an **ActiveGate**. On the platform, **OpenPipeline** processes the data, and **Grail** stores it in a **bucket**. **Smartscape** links it to the service and host. **Davis** compares it with a learned baseline, opens a **problem**, and a **workflow** sends a Slack message or creates a ticket. If you can draw this path on a whiteboard, you already sound like an architect.',
      v: { type: 'flow', nodes: [['☕','Code module','span + metrics'],['🔒','HTTPS 443','direct or via AG'],['🧹','OpenPipeline','parse · enrich · route'],['🗄️','Grail bucket','stored'],['🧠','Davis','baseline → problem'],['⚙️','Workflow','Slack · Jira · ServiceNow']] } },
    { t: 'What a consultant does with this', e: '💼',
      k: 'You are the builder who listens to the family, draws the house, builds it, and teaches them how to live in it.',
      n: 'In a consulting role, like the Devoteam position, you rarely just click in the interface. You run **discovery workshops**, design the **target architecture**, deploy agents at scale, define **naming conventions**, **host groups**, **tags** and **access control**, automate configuration as code, build dashboards for each team, and hand over with documentation and training. Clients also expect you to explain cost, so the **Dynatrace Platform Subscription** matters. Keep this picture in mind for every lesson: technical depth, plus the ability to explain it simply to a client.',
      v: { type: 'stack', layers: [['🗣️','Discovery','Inventory apps, teams, SLAs, network zones, compliance'],['📐','Design','SaaS region, environments, ActiveGates, tagging, IAM','hot'],['🚀','Deploy','OneAgent rollout, K8s Operator, cloud integrations, OTel'],['🤖','Automate','Monaco / Terraform in CI/CD'],['📊','Operate','Dashboards, SLOs, alerting, workflows, cost reviews'],['🎓','Hand over','Runbooks, training, health checks']] } }
  ],
  quiz: [
    { q: 'Which statement about Dynatrace Managed is correct?', o: ['It is the only option that supports Grail','It is a cluster you run in your own data centre','It is a free version of SaaS'], a: 1, why: 'Managed runs on infrastructure the customer operates. Grail and AppEngine are SaaS platform capabilities.' },
    { q: 'What glues a log line, a metric and a span to the same server?', o: ['The entity ID, for example dt.entity.host','The timestamp alone','The dashboard name'], a: 0, why: 'Signals carry entity attributes. That shared identity is what Smartscape and Davis use to correlate them.' },
    { q: 'Where do you manage users, groups and IAM policies across environments?', o: ['Inside each OneAgent','In Account Management','In a DQL notebook'], a: 1, why: 'Identity, licensing and policies live at account level; data and settings live at environment level.' }
  ],
  interview: [
    { q: 'Draw the Dynatrace architecture for me from the application to the alert.', a: 'Start at the left: **OneAgent** (code modules injected into processes, plus OS module) and **OpenTelemetry** sources. Traffic goes over **HTTPS 443** directly or via an **Environment ActiveGate** for routing, compression and network isolation. In SaaS, **OpenPipeline** processes ingest, **Grail** stores it in **buckets** with retention, **Smartscape** builds topology, **Davis** detects anomalies against baselines and opens **problems** with a root cause, and **Workflows** or problem notifications route to Slack, ServiceNow or PagerDuty. Finish with how users consume it: **DQL**, **Notebooks**, **Dashboards**, apps.' },
    { q: 'A bank asks: SaaS or Managed? How do you decide?', a: 'Ask about **data residency** and regulation, **air-gapped** networks, internal ops capacity, and which features they need. SaaS gives Grail, AppEngine, Workflows, automatic upgrades, and regional hosting (EU regions exist). Managed gives full control but the bank runs capacity planning, backups, upgrades and HA. Today most new projects choose SaaS unless a regulator or network constraint blocks it; then explain the trade-off in features and operating cost honestly.' }
  ]
},

/* ================================================================ 02 */
{
  id: 2, phase: 'Phase I · Foundations', minutes: 16,
  title: 'OneAgent and ActiveGate',
  blurb: 'Install, monitoring modes, code modules, ActiveGate roles, network zones, proxies and troubleshooting.',
  scenes: [
    { t: 'OneAgent: one helper per house', e: '🕵️',
      k: 'You put one friendly spy in each house. It watches the rooms (CPU, disk) and also climbs inside the toys (apps) to see how they work.',
      n: '**OneAgent** is installed once per host. It has an **OS module** that collects host metrics like CPU, memory, disk and network, and it discovers every process. For supported technologies, such as Java, dot NET, Node J S, PHP, Go, and web servers, it injects a **code module** inside the process. That code module captures **PurePath** distributed traces, method hotspots and errors, without code changes. A **watchdog** process keeps everything running. Key fact: deep monitoring usually needs the process to be **restarted** after install, because the code module is loaded when the process starts.',
      v: { type: 'stack', layers: [['🐶','oneagentwatchdog','Supervises the agent processes'],['🧩','OS module (oneagentos)','Host metrics, process discovery, network, logs'],['💉','Code modules','Injected into Java, .NET, Node.js, PHP, Go, Apache, NGINX, IIS…','hot'],['📦','Log module','Discovers and ships log files'],['🧰','oneagentctl','CLI to read and change agent configuration']], note: '**Gotcha:** processes started before install are not deep-monitored until restart. Plan restarts in the change window.' } },
    { t: 'Three monitoring modes', e: '🎚️',
      k: 'A volume knob: low (only see the house), medium (see the house and rooms), high (see inside every toy).',
      n: 'OneAgent has monitoring modes. **Full-Stack** gives everything: infrastructure, processes, code-level traces and services. **Infrastructure** monitors host, processes and logs, but no code-level tracing, which is cheaper. **Discovery** is the lightest mode, giving inventory and basic host health, useful to map a large estate cheaply before deciding. Architects choose per host group: Full-Stack for business-critical application servers, Infrastructure for databases, file servers, or middleware you do not need to trace. You can switch modes later with **oneagentctl** or from the interface.',
      v: { type: 'compare', cols: [['Full-Stack',['Host + process + **code-level traces**','Services, PurePath, method hotspots','Highest consumption']],['Infrastructure / Discovery',['Host metrics, processes, logs','No code-level tracing','Lower consumption; Discovery is lightest']]], note: 'Interview line: “I pick the mode per host group, based on value and cost.”' } },
    { t: 'Installing OneAgent on Linux', e: '🧑‍🔧',
      k: 'You download the helper with a secret key, then tell it which team it belongs to before it starts.',
      n: 'You download the installer from the **deployment API** with a token that has the **InstallerDownload** scope. Then you run it as root with parameters. The most important ones are: the **monitoring mode**, the **host group**, which groups hosts that share configuration, the **network zone**, and **host tags**. Always set the host group at install time. Changing it later moves the processes to new process groups, which breaks history. On Windows you use the MSI or EXE with the same parameters, and at scale you use **Ansible**, **Puppet**, SCCM, or cloud-init.',
      v: { type: 'code', lang: 'bash · Linux install', code:
`# 1. Download (token scope: InstallerDownload)
wget -O Dynatrace-OneAgent-Linux.sh \\
  "https://abc12345.live.dynatrace.com/api/v1/deployment/installer/agent/unix/default/latest?arch=x86" \\
  --header="Authorization: Api-Token $DT_TOKEN"

# 2. Install with the decisions made up front
sudo /bin/sh Dynatrace-OneAgent-Linux.sh \\
  --set-monitoring-mode=fullstack \\
  --set-app-log-content-access=true \\
  --set-host-group=prod_payments_web \\
  --set-network-zone=eu-west.dc1 \\
  --set-host-tag=env=prod --set-host-tag=team=payments`, note: '**Host group** naming is a design decision: e.g. environment_application_tier. Agree it with the client before rollout.' } },
    { t: 'oneagentctl: the agent remote control', e: '🎮',
      k: 'A small remote control to ask the helper "who is your boss?" and "which team are you in?".',
      n: '**oneagentctl** lives in the agent tools folder. Use it to read and change settings without reinstalling. With get server you see which endpoints the agent talks to. With get tenant you confirm the environment ID. You can set a proxy, set a host group, set a network zone, and restart the agent service. Logs are in slash var slash log slash dynatrace slash oneagent on Linux. When you troubleshoot, these two places, oneagentctl and the logs, are your first stop, before you open a support ticket.',
      v: { type: 'code', lang: 'bash · oneagentctl', code:
`cd /opt/dynatrace/oneagent/agent/tools
sudo ./oneagentctl --get-server          # which endpoints am I using?
sudo ./oneagentctl --get-tenant          # which environment ID?
sudo ./oneagentctl --get-host-group
sudo ./oneagentctl --set-proxy=proxy.corp.local:3128 --restart-service
sudo ./oneagentctl --set-network-zone=eu-west.dc1 --restart-service

# Logs
ls /var/log/dynatrace/oneagent/` } },
    { t: 'ActiveGate: the post office', e: '🏤',
      k: 'Instead of every house sending letters far away, they give them to the local post office, which bundles them and sends one truck.',
      n: '**ActiveGate** is a secure proxy and an extension host. As a **routing** gateway, it receives OneAgent traffic on port **nine nine nine nine**, compresses and buffers it, and forwards it to the cluster on four four three. That means only the ActiveGates need internet access, not every server. ActiveGate also runs other modules: **Extensions 2.0** for databases, SNMP and network devices, **Kubernetes API monitoring**, cloud and **VMware** monitoring, **private synthetic locations**, and **zRemote** for mainframe. There are **Environment ActiveGates** for SaaS and Managed, and **Cluster ActiveGates** for Managed only.',
      v: { type: 'flow', nodes: [['🖥️','OneAgents','private network'],['🏤','Environment ActiveGate','port 9999 in'],['🌐','Firewall / proxy','only AG allowed out'],['☁️','Dynatrace SaaS','HTTPS 443']], note: 'ActiveGate is **optional**. Small cloud estates often let OneAgents talk directly to SaaS.' } },
    { t: 'Network zones: the shortest road', e: '🗺️',
      k: 'Each neighbourhood has its own post office. A house always tries its own neighbourhood first.',
      n: 'In big companies, you have several data centres and clouds. **Network zones** tell each OneAgent which ActiveGates are close to it. You assign a zone to agents and to ActiveGates, using the same name, for example e u west dot d c one. The agent prefers ActiveGates in its own zone, then falls back to others if allowed. This keeps traffic local, avoids crossing expensive links, and gives **high availability**: deploy at least **two ActiveGates per zone**. This is one of the most common design questions in architecture interviews.',
      v: { type: 'stack', layers: [['🏭','Zone eu-west.dc1','OneAgents + 2 ActiveGates (HA)','hot'],['🏭','Zone us-east.dc2','OneAgents + 2 ActiveGates'],['☁️','Zone aws.eu-central-1','OneAgents → AGs in the VPC'],['🔁','Fallback rule','Use any AG, or only AGs in own zone (configurable)']] } },
    { t: 'Proxies and certificates', e: '🔐',
      k: 'Sometimes a guard at the gate opens every letter to check it. Then you must show him your special stamp.',
      n: 'Corporate networks often force traffic through a **proxy**. You can configure the proxy for OneAgent at install or with oneagentctl, and for ActiveGate in its custom properties file. Some proxies do **TLS inspection**, which replaces the certificate. Then the agent or ActiveGate must trust the company **root certificate**, or the connection fails with certificate errors. For ActiveGate you can also install your own certificate for its port nine nine nine nine. When a client says agents are installed but no data appears, proxy and TLS inspection are the first suspects.',
      v: { type: 'chips', items: [['Proxy','Set with --set-proxy or in custom.properties on ActiveGate'],['TLS inspection','Breaks trust unless the corporate root CA is trusted'],['Port 9999','ActiveGate inbound from OneAgents (default)'],['Port 443','Outbound to Dynatrace SaaS'],['Allowlist','Firewall must allow the tenant and cluster endpoints'],['Custom cert','Install your own certificate on ActiveGate']] } },
    { t: 'Troubleshooting: no data from a host', e: '🧯',
      k: 'The doctor gets no heartbeat. Is the sensor broken, is the wire cut, or is the sensor plugged into the wrong patient?',
      n: 'Use a fixed sequence. One: is the agent running? Check the service and the watchdog. Two: which endpoint and tenant is it using? Run oneagentctl get server and get tenant. Three: can it reach that endpoint? Test with curl to the ActiveGate on nine nine nine nine, or to the tenant on four four three, through the proxy. Four: read the agent logs for certificate, proxy or authentication errors. Five: if the host appears but services do not, the process was probably not restarted, or the technology is not supported, or deep monitoring is disabled. Tell interviewers you follow a method, not luck.',
      v: { type: 'stack', layers: [['1️⃣','Agent alive?','systemctl status oneagent · watchdog running'],['2️⃣','Right target?','oneagentctl --get-server / --get-tenant'],['3️⃣','Network path?','curl -v https://ag.corp:9999 · proxy · firewall','hot'],['4️⃣','TLS and auth?','agent logs: certificate, 401, proxy errors','warn'],['5️⃣','Host OK but no services?','Restart process · check supported tech · deep monitoring rules']] } }
  ],
  quiz: [
    { q: 'Why do some processes show no code-level data right after installing OneAgent?', o: ['The licence is wrong','The process must be restarted to load the code module','ActiveGate is missing'], a: 1, why: 'Code modules are injected when the process starts. Existing processes need a restart.' },
    { q: 'What is the default port OneAgents use to reach an Environment ActiveGate?', o: ['9999','8080','22'], a: 0, why: 'ActiveGate listens on 9999 by default and forwards to the cluster over 443.' },
    { q: 'You have two data centres. How do you keep agent traffic local and highly available?', o: ['One ActiveGate for the whole company','Network zones with at least two ActiveGates per zone','Disable ActiveGates'], a: 1, why: 'Network zones route agents to nearby ActiveGates; two per zone gives redundancy.' }
  ],
  interview: [
    { q: 'Agents are installed on 300 servers but 40 show nothing. Walk me through it.', a: 'Look for a **pattern** first: same subnet, same OS, same proxy? Then the method: agent running, **oneagentctl --get-server/--get-tenant**, network test to **ActiveGate 9999** or **SaaS 443**, **proxy** and **TLS inspection** (corporate CA), agent logs for 401 or certificate errors, token or tenant mismatch from a wrong installer. If hosts appear but no services: **process restart**, unsupported technology, or monitoring rules. Fix the root cause in the deployment automation, not by hand on 40 servers.' },
    { q: 'When do you need an ActiveGate, and how many?', a: 'Need it when agents cannot reach the internet, to **concentrate egress**, to monitor via APIs (**Kubernetes API**, **cloud**, **VMware**), to run **Extensions 2.0**, or **private synthetic locations**. Size per zone: minimum **two for HA**, then scale on number of agents and extension load following Dynatrace sizing guidance. Separate ActiveGates by purpose (routing vs extensions vs synthetic) in large estates, so one heavy workload does not starve the others.' }
  ]
},

/* ================================================================ 03 */
{
  id: 3, phase: 'Phase II · Advanced observability', minutes: 16,
  title: 'Distributed tracing and OpenTelemetry',
  blurb: 'Traces, spans, context propagation, OTel SDK and Collector, OTLP to Dynatrace, sampling, eBPF.',
  scenes: [
    { t: 'A trace is a treasure-hunt trail', e: '🧭',
      k: 'A child runs from the kitchen to the garden to the garage. Each room leaves a sticker with the time. Together the stickers show the whole trip.',
      n: 'A user clicks Pay. The request goes to a front end, then an API, then a payment service, then a database. A **trace** is the full journey of that one request. Each step is a **span**. A span has a name, a start and end time, a **status**, **attributes** such as the HTTP route, and a **parent span ID** that links it to the step before. All spans in the same journey share one **trace ID**. Dynatrace calls its traces **PurePath**, and OneAgent creates them automatically for supported technologies.',
      v: { type: 'stack', layers: [['🌐','span: POST /checkout','frontend · 820 ms · root span','hot'],['🔗','span: OrderService.create','child of checkout · 640 ms'],['💳','span: PaymentClient.charge','child · 520 ms'],['🗄️','span: SELECT payments','child · 480 ms ← most of the time is here','warn']], note: 'Every span carries the same **trace_id** and its own **span_id** + **parent_span_id**.' } },
    { t: 'Context propagation: passing the baton', e: '🏃',
      k: 'In a relay race, each runner passes the same baton. If one runner drops it, the race looks like two different races.',
      n: 'How does the payment service know it is part of the same trace? The caller adds a header to the request. The standard header is **W3C Trace Context**, named **traceparent**. It contains the version, the trace ID, the parent span ID, and flags such as sampled. This is called **context propagation**. Dynatrace OneAgent reads and writes traceparent, so it can join traces with OpenTelemetry services. If a proxy, a message queue or custom code drops the header, the trace breaks into pieces. That is the number one cause of broken traces.',
      v: { type: 'code', lang: 'HTTP header · W3C Trace Context', code:
`traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
#            ver  trace-id (32 hex)               parent span-id    flags (01 = sampled)
tracestate:  dt=...,vendor2=...   # vendor-specific extra data`, note: '**Gotcha:** API gateways, older proxies and async messaging must forward the header, or traces split.' } },
    { t: 'What OpenTelemetry is', e: '🧰',
      k: 'A universal plug. Every country has different sockets, but this plug fits all of them.',
      n: '**OpenTelemetry**, or **OTel**, is an open source standard from the **CNCF** for producing telemetry: traces, metrics and logs. It has three main parts. The **API and SDK**, a library you put in your application. **Instrumentation libraries**, which automatically create spans for frameworks like Spring or Express. And the **OpenTelemetry Collector**, a separate program that receives, processes and exports data. It sends data with the **OTLP** protocol. Dynatrace natively ingests OTLP, so OTel and OneAgent are complementary, not rivals.',
      v: { type: 'flow', nodes: [['📚','API + SDK','in your code'],['🔌','Auto-instrumentation','frameworks, libraries'],['🏭','OTel Collector','receive · process · export'],['📮','OTLP/HTTP','protobuf'],['☁️','Dynatrace','/api/v2/otlp']] } },
    { t: 'Sending OTLP to Dynatrace', e: '📮',
      k: 'You write the address on the envelope and add a stamp. No stamp, the post office refuses the letter.',
      n: 'Dynatrace exposes an **OTLP endpoint** at your environment URL, slash a p i, slash v two, slash o t l p. Traces go to slash v one slash traces, metrics to slash v one slash metrics, and logs to slash v one slash logs. Authentication uses an **API token** in the Authorization header, with scopes **openTelemetryTrace.ingest**, **metrics.ingest** and **logs.ingest**. Use **OTLP over HTTP** with **protobuf**. For metrics, Dynatrace expects **delta temporality**, so configure the exporter or Collector accordingly. You can send directly, through an ActiveGate, or through a Collector.',
      v: { type: 'code', lang: 'yaml · OpenTelemetry Collector', code:
`receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }   # apps can still use gRPC to the collector
      http: { endpoint: 0.0.0.0:4318 }
processors:
  memory_limiter: { check_interval: 1s, limit_percentage: 80 }
  batch: {}
  cumulativetodelta: {}                 # Dynatrace wants delta metrics
exporters:
  otlphttp/dynatrace:
    endpoint: "https://abc12345.live.dynatrace.com/api/v2/otlp"
    headers: { Authorization: "Api-Token \${env:DT_API_TOKEN}" }
service:
  pipelines:
    traces:  { receivers: [otlp], processors: [memory_limiter, batch], exporters: [otlphttp/dynatrace] }
    metrics: { receivers: [otlp], processors: [memory_limiter, cumulativetodelta, batch], exporters: [otlphttp/dynatrace] }
    logs:    { receivers: [otlp], processors: [memory_limiter, batch], exporters: [otlphttp/dynatrace] }`, note: 'Dynatrace also publishes its own **Dynatrace OTel Collector** distribution with tested components.' } },
    { t: 'OneAgent or OpenTelemetry?', e: '⚖️',
      k: 'An automatic robot vacuum cleans everything alone. A broom lets you clean exactly the corner you want. Smart families use both.',
      n: 'Choose by context. **OneAgent** is zero code change, gives deep code-level data, automatic topology, and works great on hosts and Kubernetes you control. **OpenTelemetry** is vendor neutral, works where you cannot install an agent, such as some managed services, and lets developers add **custom spans and business attributes**. In many enterprises the answer is both: OneAgent everywhere it can run, OTel for serverless, third-party, and custom instrumentation. OneAgent can also capture spans created by the OTel API inside monitored processes. Avoid double instrumentation of the same process, which creates duplicate spans.',
      v: { type: 'compare', cols: [['OneAgent',['No code change, auto-discovery','Code-level detail, method hotspots','Automatic Smartscape topology','Needs install rights on the host or node']],['OpenTelemetry',['Vendor-neutral standard (CNCF)','Works where agents cannot run','Developers control custom spans','You manage SDKs, Collectors, sampling']]], note: '**Gotcha:** OneAgent + OTel SDK exporting the same process = duplicate traces. Decide one owner per service.' } },
    { t: 'Sampling: you cannot keep every grain of sand', e: '🏖️',
      k: 'You cannot photograph every grain of sand on the beach. You take smart pictures: all the strange shells, and a few normal ones.',
      n: 'High-traffic systems produce millions of spans. **Sampling** decides which to keep. **Head-based sampling** decides at the start of the trace, for example keep ten percent, which is cheap but can miss rare errors. **Tail-based sampling** decides after the trace is complete, for example keep all errors and slow traces, but needs the Collector to buffer whole traces, which costs memory. OneAgent uses **adaptive traffic management**, which keeps a representative share automatically under load. Always explain sampling in terms of cost versus visibility.',
      v: { type: 'compare', cols: [['Head-based',['Decision at trace start','Cheap, simple, predictable','May drop the rare error you need']],['Tail-based',['Decision after the trace ends','Keep errors + slow traces','Collector must buffer → memory, sticky routing']]], note: 'OneAgent uses **adaptive traffic management** to cap volume while staying representative.' } },
    { t: 'eBPF and automatic instrumentation', e: '🔬',
      k: 'A magic magnifying glass that watches through the walls of the house, without entering any room.',
      n: '**eBPF** lets small, safe programs run inside the Linux kernel. Observability tools use it to see network calls, latency and process activity without changing application code. In the OpenTelemetry world, **OpenTelemetry eBPF Instrumentation** can create basic spans and metrics for HTTP and gRPC from the kernel side. The trade-off: eBPF sees the outside of the request, while in-process instrumentation like OneAgent code modules sees inside the code, such as method calls and database statements. In interviews, describe eBPF as a great coverage layer, not a replacement for deep instrumentation.',
      v: { type: 'stack', layers: [['🧠','In-process (OneAgent code module, OTel SDK)','Method level, DB statements, exceptions, business attributes','hot'],['🔬','eBPF (kernel level)','Network calls, latency, process activity, no code change'],['🐧','Linux kernel','Runs the verified eBPF program safely']] } },
    { t: 'Lab: find a broken trace', e: '🧪',
      k: 'Two puzzle halves. Your job is to find which piece of tape is missing between them.',
      n: 'Practise this in your trial tenant. Deploy a small app with two services, one with OneAgent and one with the OTel SDK. Call one from the other. In the **Distributed Tracing** app, check that one trace shows both. Then put a proxy in the middle that strips the traceparent header, and watch the trace split into two. Query spans with DQL to count traces that start at the second service with no parent. This lab gives you a real story to tell: you broke it, found it, and fixed it.',
      v: { type: 'code', lang: 'DQL · spans', code:
`fetch spans, from: now() - 30m
| filter service.name == "payment-service"
| filter isNull(span.parent_id)           // root spans here = broken propagation?
| summarize roots = count(), by: { span.name }
| sort roots desc`, note: 'Field names can differ between OneAgent and OTel spans. Inspect one record first with **| limit 1**.' } }
  ],
  quiz: [
    { q: 'Which header carries the trace ID between services in the W3C standard?', o: ['x-request-id','traceparent','authorization'], a: 1, why: 'W3C Trace Context defines traceparent (and tracestate).' },
    { q: 'Which protocol variant does the Dynatrace OTLP API endpoint accept?', o: ['OTLP over HTTP with protobuf','Only Zipkin JSON','SNMP traps'], a: 0, why: 'Send OTLP/HTTP protobuf to /api/v2/otlp. Apps can still use gRPC to a local Collector, which then exports over HTTP.' },
    { q: 'You must keep every error trace but only 5% of normal ones. Which sampling?', o: ['Head-based 5%','Tail-based sampling in the Collector','No sampling ever'], a: 1, why: 'Only tail-based sampling sees the outcome of the trace before deciding.' }
  ],
  interview: [
    { q: 'Traces are broken between two services. How do you investigate?', a: 'Confirm both services are instrumented (OneAgent or OTel), then check **context propagation**: is **traceparent** present on the outgoing call and on arrival? Look at intermediaries: **API gateway**, **service mesh**, **load balancer**, **message queue** (needs propagation in message headers), and **async thread pools**. Check for two instrumentations conflicting. Use DQL to find root spans where you expect children. Fix by enabling header forwarding or adding propagation in messaging code.' },
    { q: 'A client wants to go "100% OpenTelemetry" and remove OneAgent. Your advice?', a: 'Respect the goal (vendor neutrality) but explain trade-offs: they lose **zero-touch code-level depth**, automatic **process and host topology**, and must own **SDK upgrades**, **Collector operations**, **sampling** and **semantic conventions**. Propose a hybrid: OTel for custom spans and where agents cannot run, OneAgent for hosts and Kubernetes, with one owner per service to avoid duplicates, and a Collector layer for routing and enrichment.' }
  ]
},

/* ================================================================ 04 */
{
  id: 4, phase: 'Phase II · Advanced observability', minutes: 14,
  title: 'Smartscape and Davis AI',
  blurb: 'Topology, vertical and horizontal dependencies, baselines, events, problems and root cause.',
  scenes: [
    { t: 'Smartscape: the living map', e: '🗺️',
      k: 'A map of the city that draws itself. It shows which houses are on which street, and who visits whom.',
      n: '**Smartscape** is the real-time **topology** that Dynatrace builds automatically from OneAgent, OpenTelemetry, cloud and Kubernetes data. It has two directions. **Vertical** relationships answer: what runs on what. An application calls services, services run in processes, processes run on hosts, hosts sit in a data centre or cloud zone. **Horizontal** relationships answer: who talks to whom. Service A calls service B, process X connects to process Y. This map is not a pretty picture. It is the data structure that Davis uses for causation.',
      v: { type: 'stack', layers: [['📱','Applications','Web / mobile front ends (RUM)'],['🔗','Services','calls ↔ calls (horizontal)','hot'],['⚙️','Processes','process groups and instances'],['🖥️','Hosts','VMs, bare metal, k8s nodes'],['☁️','Data centres / cloud','AZs, regions, clusters']], note: 'Vertical = **runs on**. Horizontal = **calls / connects to**.' } },
    { t: 'Discovery without configuration', e: '🔭',
      k: 'You do not tell the helper which toys exist. It finds every toy alone, even new ones that arrive tomorrow.',
      n: 'When OneAgent starts, it discovers all processes and groups them into **process groups** using **process group detection** rules, such as the executable, the deployment directory, the Kubernetes workload, or environment variables like **DT_CLUSTER_ID**. Then it detects **services** from the requests those processes handle. You can customise this with **process group detection rules** and **service detection rules**, for example to split one huge generic service into proper services. Getting detection right early saves pain later, because entities, history and alerting are built on it.',
      v: { type: 'chips', items: [['Process group detection','How processes are grouped. Customise with rules or DT_CLUSTER_ID'],['Service detection','How endpoints become services. Rules can merge or split'],['Host groups','Set at install; influences process grouping'],['Tags','Auto-tags from rules, k8s labels, cloud tags'],['Naming rules','Readable names for processes and services'],['Management zones / segments','Slice the topology for teams']] } },
    { t: 'Baselines: knowing what normal looks like', e: '📏',
      k: 'You know your friend is usually happy at school. If one day he is sad, you notice. That is a baseline.',
      n: 'Davis learns **automatic baselines** for response time, failure rate and load, per service and even per request type, including seasonality, like Monday mornings. When the real value leaves the expected band, that is an **anomaly**. You can also use **auto-adaptive thresholds**, which follow the data, or **static thresholds**, when a contract says: never above two seconds. Senior engineers know when to use which: baselines for behaviour you cannot predict, static thresholds for SLAs and hard limits like disk full.',
      v: { type: 'compare', cols: [['Automatic baseline / auto-adaptive',['Learns normal, including seasonality','Great for response time and failure rate','Fewer false alarms on noisy signals']],['Static threshold',['Fixed number from a contract or limit','Disk 95% full, SLA 2 s','Predictable, easy to explain to auditors']]] } },
    { t: 'Events and problems', e: '🚨',
      k: 'Many small bells ring: "I am slow", "I am out of memory", "I am failing". The teacher groups them into one story: one problem.',
      n: 'When something abnormal happens, Dynatrace raises **events**, such as a **slowdown event**, an **error event**, an **availability event** like process unavailable, or a **resource contention event** like CPU saturation. Davis then correlates related events, using topology and time, into one **problem**. A problem has an ID like P dash two four one zero three, a status, open or closed, the **affected entities**, the **impact**, for example on users or services, and the **root cause**. One problem instead of fifty alerts: that is the main value you sell to an operations team.',
      v: { type: 'flow', nodes: [['🔔','Events','slowdown · error · availability · resource'],['🧲','Correlation','topology + time'],['📦','Problem P-24103','one story'],['🎯','Root cause','+ impact + evidence']] } },
    { t: 'How Davis finds the root cause', e: '🌳',
      k: 'The last domino fell. Davis walks back along the line of dominoes until it finds the first one that was pushed.',
      n: 'Davis is a **causal AI**, not only a correlation engine. Starting from the affected entity, it walks the **Smartscape** graph: down to processes and hosts, and sideways to services that are called. At each node it checks for anomalies in metrics, events, logs and changes such as deployments. This is a form of **fault tree analysis**. The entity that is abnormal and that explains the others is the **root cause**. Because it follows real dependencies, it can explain the cause: the database host disk is full, which slows the payment service, which hurts the checkout application.',
      v: { type: 'stack', layers: [['📱','Checkout app: users affected','impact','warn'],['🔗','Payment service: slowdown','symptom'],['⚙️','PostgreSQL process: high latency','symptom'],['🖥️','DB host: disk 100% full','root cause','hot']], note: 'Davis walks the graph from symptoms to the **deepest abnormal dependency**.' } },
    { t: 'Maintenance windows: your old friend', e: '🛠️',
      k: 'When the plumber comes to fix the pipes, you tell the doctor: "do not panic if water stops for one hour".',
      n: 'You already know maintenance mode from operations. In Dynatrace, a **maintenance window** has a scope, such as tagged entities or a management zone, a schedule, once or recurring, and a behaviour. Three behaviours exist: detect problems and alert, detect problems but do not alert, or disable problem detection entirely. A strong answer explains the trade-off: suppressing alerts keeps history and lets you see impact after the change, while disabling detection loses that evidence. Automate maintenance windows from your change management tool, through the **Settings API**.',
      v: { type: 'chips', items: [['Detect + alert','Business as usual, just labelled'],['Detect, no alert','Problems still recorded, notifications suppressed'],['Disable detection','No problems at all; you lose evidence'],['Scope','Entities, tags, management zone'],['Schedule','Once, daily, weekly, monthly'],['Automation','Create via Settings 2.0 API from ServiceNow change']] } },
    { t: 'Davis in DQL', e: '🔎',
      k: 'The teacher writes every story in a notebook. You can open the notebook and search it.',
      n: 'On Grail, problems and events are data you can query. The table **dt.davis.problems** holds problems, and **dt.davis.events** holds the raw events Davis created. That lets you build reports like mean time to resolve per team, or the top root-cause entities this month. This is a favourite interview exercise: write a query that counts problems by category over the last week.',
      v: { type: 'code', lang: 'DQL · problems', code:
`fetch dt.davis.problems, from: now() - 7d
| filter not(dt.davis.is_duplicate)
| fieldsAdd duration_min = toLong((event.end - event.start) / 1m)
| summarize problems = count(), avg_minutes = avg(duration_min),
            by: { event.category }
| sort problems desc`, note: 'Always inspect the real schema first: **fetch dt.davis.problems | limit 1**. Field names evolve.' } }
  ],
  quiz: [
    { q: 'Service A calls service B. Which Smartscape direction is that?', o: ['Vertical','Horizontal','Diagonal'], a: 1, why: 'Calls between peers are horizontal. Vertical is “runs on”.' },
    { q: 'You want alerts silenced during a patch but still want to see problems later. Which behaviour?', o: ['Disable problem detection','Detect problems but do not alert','Delete the host'], a: 1, why: 'You keep evidence and history, without waking anyone.' },
    { q: 'Why can Davis name a root cause and not just show correlated charts?', o: ['It walks the real dependency graph (Smartscape)','It reads Jira tickets','It always blames the network'], a: 0, why: 'Topology gives causal direction, so Davis follows dependencies from symptom to cause.' }
  ],
  interview: [
    { q: 'How is Davis different from a classic threshold-based alerting tool?', a: '**Automatic baselining** with seasonality, **topology-aware correlation** (Smartscape), and **causal root-cause analysis** that groups many events into one **problem** with impact and evidence. Classic tools fire one alert per threshold breach and leave humans to correlate. Mention you still use **static thresholds** for SLAs and hard limits, and **custom events / metric events** for business signals.' },
    { q: 'Operations complain of too many Dynatrace notifications. What do you change?', a: 'Map who needs what. Use **alerting profiles** (severity, delay, scope by tag/zone) or **workflows** with filters on problem category and affected entities; route by team. Review **anomaly detection settings** for noisy services, add **maintenance windows** linked to changes, fix bad **service detection** that merges unrelated traffic, and delete duplicate custom alerts. Measure: notifications per week and MTTA before and after.' }
  ]
},

/* ================================================================ 05 */
{
  id: 5, phase: 'Phase II · Advanced observability', minutes: 18,
  title: 'Grail, OpenPipeline and DQL',
  blurb: 'Lakehouse design, buckets and retention, ingest processing, and DQL from basic to advanced.',
  scenes: [
    { t: 'Grail: one giant library', e: '📚',
      k: 'Before, comics were in one box, letters in another, photos in a third. Grail is one huge library where everything sits together and you can search all of it at once.',
      n: '**Grail** is the Dynatrace **data lakehouse**. It stores logs, metrics, spans, events, business events and topology together. Three ideas matter. One: it is **schema-on-read**, so you do not have to design indexes or schemas before you ingest data. Two: it uses **massively parallel processing**, so a query is split across many workers. Three: all data shares the same context, such as entity IDs, so you can join a log with a span and a host in one query. The query language for all of it is **DQL**.',
      v: { type: 'stack', layers: [['🔎','DQL','one language for all data types','hot'],['⚡','Massively parallel query engine','scans in parallel, no index to maintain'],['🗂️','Buckets','logs · spans · events · bizevents · metrics, each with retention'],['🧹','OpenPipeline','processing at ingest'],['📥','Ingest','OneAgent · OTLP · APIs · extensions · cloud']] } },
    { t: 'Buckets and retention', e: '🪣',
      k: 'Different buckets for different toys. Some toys you keep for a week, some for years.',
      n: 'Grail data lives in **buckets**. Each bucket holds one data type, such as logs or business events, and has a **retention period**. There are default buckets, for example **default_logs**. You can create **custom buckets**, for example audit logs kept for one year, and debug logs kept for ten days. Retention drives cost, so it is an architecture decision. Buckets also support access control: you can allow a team to read only certain buckets with **IAM policies**. In interviews, connect buckets to three words: retention, cost, and permissions.',
      v: { type: 'chips', items: [['default_logs','Default log bucket (35 days by default)'],['custom: audit_logs_1y','Compliance logs, long retention'],['custom: debug_logs_10d','Noisy logs, short retention, cheaper'],['bizevents','Business events bucket'],['Retention','Per bucket, drives storage cost'],['IAM','Policies can restrict which buckets a group can query']] } },
    { t: 'OpenPipeline: the sorting factory', e: '🏭',
      k: 'Before toys go to the shelves, a factory cleans them, adds name tags, hides private stickers and sends each to the right shelf.',
      n: '**OpenPipeline** processes data when it arrives, before storage. You define **routes** that match incoming records, and **pipelines** with stages. **Processing** parses fields, for example extract a user ID from a log line. **Masking** removes sensitive data like card numbers, which is critical for **GDPR**. **Data extraction** can create **metrics** or **business events** from logs, so dashboards stay cheap. **Storage** sends records to the right bucket, or **drops** them. It is the main cost and compliance control point in the platform.',
      v: { type: 'flow', nodes: [['📥','Ingest source','logs · spans · events'],['🛣️','Routing','match condition'],['🧹','Processing','parse · mask · enrich'],['📈','Extraction','metrics · bizevents'],['🪣','Storage','bucket or drop']], note: '**Gotcha:** mask personal data at ingest. Once stored, it is in the bucket for its whole retention.' } },
    { t: 'DQL basics: a pipe of instructions', e: '🚰',
      k: 'Water flows through pipes. Each pipe does one job: filter the dirt, count the drops, sort them.',
      n: 'A DQL query starts with a **source command**, like **fetch logs**, and each **pipe** passes records to the next command. **filter** keeps matching rows. **fields** chooses columns. **fieldsAdd** creates new ones. **summarize** groups and aggregates. **sort** orders. **limit** cuts. Always set a timeframe, either in the query with from colon, or in the interface. Read this query aloud: fetch logs from the last hour, keep errors, count them per host, show the top ten. That is how you explain DQL to a client.',
      v: { type: 'code', lang: 'DQL · basics', code:
`fetch logs, from: now() - 1h
| filter loglevel == "ERROR"
| summarize errors = count(), by: { dt.entity.host, k8s.namespace.name }
| sort errors desc
| limit 10` } },
    { t: 'DQL for metrics: timeseries', e: '📈',
      k: 'Instead of counting each raindrop, you look at the rain gauge every minute.',
      n: 'Metrics are queried with **timeseries**, not fetch. You choose an aggregation, such as average, maximum, or percentile, a metric key, and a split with by. The result is an array of values per time bucket, perfect for charts. You can then use fieldsAdd with array functions, like arrayAvg, and filter on the result, for example hosts whose average CPU is above eighty percent. **makeTimeseries** does the reverse: it turns records, such as logs or spans, into a time series.',
      v: { type: 'code', lang: 'DQL · metrics', code:
`timeseries cpu = avg(dt.host.cpu.usage), by: { dt.entity.host }, from: now() - 2h
| fieldsAdd avg_cpu = arrayAvg(cpu)
| filter avg_cpu > 80
| sort avg_cpu desc

// Records → time series
fetch logs, from: now() - 6h
| filter loglevel == "ERROR"
| makeTimeseries errors = count(), interval: 5m` } },
    { t: 'DQL advanced: parse, lookup, join', e: '🧩',
      k: 'You read a secret code in a letter, then look up the name in your address book.',
      n: 'Three advanced skills impress interviewers. **parse** uses **DPL**, the Dynatrace Pattern Language, to extract fields from text at query time. **lookup** enriches records with fields from another query, such as adding the host name to an entity ID. And **join** combines two datasets on a key. You can also query entities with fetch dt dot entity dot host, and on newer platform versions Smartscape topology through dedicated **smartscape commands**. Practise these in a **Notebook** until you can write them without the interface helping you.',
      v: { type: 'code', lang: 'DQL · advanced', code:
`fetch logs, from: now() - 1h
| filter contains(content, "payment failed")
| parse content, "LD 'user=' WORD:user_id LD 'amount=' DOUBLE:amount"
| lookup [ fetch dt.entity.host | fields id, host_name = entity.name ],
         sourceField: dt.entity.host, lookupField: id
| summarize failures = count(), lost = sum(amount), by: { lookup.host_name }
| sort lost desc`, note: '**lookup** prefixes the joined fields with **lookup.** by default. Use **prefix:** to change it.' } },
    { t: 'Writing queries that are fast and cheap', e: '💸',
      k: 'Looking for your sock in one drawer is faster than emptying the whole house.',
      n: 'With the Dynatrace Platform Subscription, some query usage is billed by **data scanned**, so a lazy query costs real money. Good habits: always use the smallest timeframe. Filter as early as possible, especially on bucket and indexed context fields like **dt.system.bucket**, host or namespace. Prefer metrics, or metrics extracted in OpenPipeline, for dashboards that refresh every minute, instead of scanning logs each time. Use **scanLimitGBytes** or sampling during exploration. Senior engineers think about scan cost the same way database people think about indexes.',
      v: { type: 'stack', layers: [['⏱️','Short timeframe','from: now() - 1h, not 30 days'],['🎯','Filter early','bucket, namespace, host, log level first','hot'],['📈','Metrics for dashboards','extract metrics in OpenPipeline'],['🧪','Explore safely','scanLimitGBytes · samplingRatio · limit'],['🪣','Right bucket','short-retention bucket for noisy data','warn']] } },
    { t: 'Lab: your first investigation notebook', e: '📓',
      k: 'You become the detective. Your notebook keeps every clue in order, so others can follow your thinking.',
      n: 'Open a **Notebook** in your trial tenant. Section one: error logs per service in the last hour. Section two: the CPU time series of the hosts behind the worst service. Section three: the slowest spans for that service. Section four: open problems from dt dot davis dot problems. Add short markdown notes between sections explaining your reasoning. Share it. This is exactly the kind of artefact a consultant hands to a client team, and it is great proof of skill to show in an interview.',
      v: { type: 'stack', layers: [['1️⃣','Errors per service','fetch logs | filter loglevel=="ERROR" | summarize by service'],['2️⃣','Host CPU behind it','timeseries avg(dt.host.cpu.usage)'],['3️⃣','Slowest spans','fetch spans | sort duration desc | limit 20'],['4️⃣','Open problems','fetch dt.davis.problems | filter event.status=="ACTIVE"','hot'],['📝','Markdown notes','Explain each step for the client team']] } }
  ],
  quiz: [
    { q: 'Which command do you use to query a metric like dt.host.cpu.usage?', o: ['fetch metrics','timeseries','select'], a: 1, why: 'Metrics are queried with timeseries; fetch is for records like logs, spans and events.' },
    { q: 'Where should you mask credit card numbers in logs?', o: ['In a dashboard tile','In OpenPipeline at ingest','After 35 days'], a: 1, why: 'Masking at ingest prevents personal data from ever being stored.' },
    { q: 'What controls how long logs are kept in Grail?', o: ['The retention of the bucket they are stored in','The OneAgent version','The browser cache'], a: 0, why: 'Retention is a bucket property; route data to buckets that fit its value.' }
  ],
  interview: [
    { q: 'A client ingests 2 TB of logs a day and costs explode. What do you do?', a: 'Measure first: volume by **source, namespace, log level**, and query cost (scanned GB). Then act in **OpenPipeline**: **drop** debug and health-check noise, **route** low-value logs to **short-retention buckets**, keep audit logs in long-retention buckets, **extract metrics** for dashboards instead of scanning logs, and **mask** PII. Fix sources too: log levels in apps, duplicate shippers. Review queries and dashboards for wide timeframes. Report before/after volume and cost.' },
    { q: 'Write me a DQL query: top 5 services by error rate in the last 2 hours.', a: '**fetch spans, from: now() - 2h** | **filter** span kind server (or request root) | **summarize total = count(), failed = countIf(request.is_failed == true), by: { dt.entity.service }** | **fieldsAdd error_rate = 100.0 * failed / total** | **sort error_rate desc** | **limit 5**. Then say you would check the exact field names on that tenant first, and that for a dashboard you would use the built-in service metrics instead of scanning spans every minute.' }
  ]
},

/* ================================================================ 06 */
{
  id: 6, phase: 'Phase III · Engineering and automation', minutes: 17,
  title: 'Configuration as code',
  blurb: 'Settings 2.0, tokens and OAuth, Monaco, Terraform, and a CI/CD pipeline for Dynatrace config.',
  scenes: [
    { t: 'Why click-ops does not scale', e: '🧱',
      k: 'Building one sandcastle by hand is fun. Building one hundred identical ones by hand is impossible. You need a mould.',
      n: 'A large client has dozens of teams, several environments and hundreds of rules: alerting profiles, maintenance windows, tagging rules, dashboards, SLOs. If people click them by hand, production and test drift apart, nobody knows who changed what, and nothing can be rolled back. **Configuration as code** stores configuration in **Git**, reviews it with **pull requests**, and deploys it with a pipeline. This is a core expectation for an engineer or architect role. It is how you show you build platforms, not just dashboards.',
      v: { type: 'compare', cols: [['Click-ops',['Manual, slow, error-prone','Environments drift apart','No review, no rollback','Knowledge stays in heads']],['Configuration as code',['Git = single source of truth','Pull request review + history','Same config promoted dev → prod','Reproducible, auditable']]] } },
    { t: 'Settings 2.0: one model for config', e: '🧾',
      k: 'Every setting is a form with a known shape. Because the shape is known, a robot can fill it in.',
      n: 'Most modern Dynatrace configuration is stored as **Settings 2.0** objects. Each object follows a **schema**, for example **builtin:alerting.profile** or **builtin:anomaly-detection.metric-events**, and has a **scope**, such as the whole environment, or a specific host or service. You can read schemas and objects through the **Settings API**, slash a p i slash v two slash settings. Because every setting is JSON that follows a schema, it can be generated, validated and deployed automatically by Monaco or Terraform.',
      v: { type: 'code', lang: 'bash · Settings 2.0 API', code:
`# List available schemas
curl -s -H "Authorization: Api-Token $DT_TOKEN" \\
  "$DT_URL/api/v2/settings/schemas" | jq '.items[].schemaId' | head

# Read objects of one schema
curl -s -H "Authorization: Api-Token $DT_TOKEN" \\
  "$DT_URL/api/v2/settings/objects?schemaIds=builtin:alerting.profile&scopes=environment"` } },
    { t: 'Tokens, scopes and OAuth clients', e: '🔑',
      k: 'Each key opens only the doors it needs. The cleaner gets the kitchen key, not the safe key.',
      n: 'Automation needs credentials. Classic **API tokens** have **scopes**, such as settings dot read, settings dot write, ReadConfig, WriteConfig, or metrics dot ingest. The newest platform APIs, such as Grail, AppEngine, documents and workflows, use **OAuth clients** or **platform tokens** with **IAM permissions**. Follow **least privilege**: one token per purpose, the minimum scopes, an expiry date, and storage in a vault such as HashiCorp Vault or the CI secret store, never in Git. Mention token rotation in interviews. Security-minded answers stand out.',
      v: { type: 'chips', items: [['settings.read / settings.write','Settings 2.0 objects'],['ReadConfig / WriteConfig','Classic configuration APIs'],['InstallerDownload','Download OneAgent installers'],['metrics.ingest · logs.ingest','Data ingest APIs'],['OAuth client','Platform APIs: documents, automation, storage'],['Least privilege','One token per purpose, expiry, vault, rotation']] } },
    { t: 'Monaco: the Dynatrace mould', e: '🐵',
      k: 'Monaco is the mould. You describe the castle once, and it builds the same castle in every sandbox.',
      n: '**Monaco**, short for Monitoring as Code, is the official Dynatrace configuration as code CLI. A **manifest** file lists **projects**, which are folders of configuration, and **environments**, with their URLs and credentials taken from environment variables. Each config has a YAML file with parameters and a JSON **template**. You can **download** existing configuration from a tenant to start, then **deploy** to any environment. Monaco handles **dependencies** between configs, for example an alerting profile referenced by a notification, through references.',
      v: { type: 'code', lang: 'yaml · manifest.yaml', code:
`manifestVersion: 1.0
projects:
  - name: platform-baseline
environmentGroups:
  - name: nonprod
    environments:
      - name: dev
        url: { type: environment, value: DT_DEV_URL }
        auth:
          token: { name: DT_DEV_TOKEN }
          oAuth:
            clientId:     { name: DT_CLIENT_ID }
            clientSecret: { name: DT_CLIENT_SECRET }
  - name: prod
    environments:
      - name: prod
        url: { type: environment, value: DT_PROD_URL }
        auth:
          token: { name: DT_PROD_TOKEN }` } },
    { t: 'A Monaco config and the commands', e: '⌨️',
      k: 'The mould has holes where you pour different colours: blue sand for test, red sand for production.',
      n: 'Here is one config: an alerting profile. The YAML gives it an ID, a name, a template, and the Settings schema it belongs to. Parameters like the team name can change per environment. Then the commands. **monaco download** pulls current configuration from a tenant. **monaco deploy** with the dry run flag validates everything without changing anything. Then deploy for real, environment by environment. In a pipeline, the dry run runs on every pull request, and the real deploy runs after merge.',
      v: { type: 'code', lang: 'yaml + bash · Monaco', code:
`# platform-baseline/alerting/config.yaml
configs:
  - id: payments-critical
    config:
      name: "Payments - critical"
      template: alerting-profile.json
      parameters:
        team: "payments"
    type:
      settings:
        schema: builtin:alerting.profile
        scope: environment

# Commands
monaco download --manifest manifest.yaml --environment dev
monaco deploy manifest.yaml --environment dev --dry-run
monaco deploy manifest.yaml --environment dev` } },
    { t: 'Terraform provider', e: '🏗️',
      k: 'Some families already use one big toolbox for everything in the house. Dynatrace can live in that same toolbox.',
      n: 'Many clients already manage cloud infrastructure with **Terraform**. The official **Dynatrace Terraform provider**, source dynatrace dash o s s slash dynatrace, manages configuration as Terraform resources, with **state**, **plan** and **apply**. It can even **export** an existing environment into Terraform files. Choose Terraform when the client platform team already lives in Terraform and wants one workflow for cloud plus monitoring. Choose Monaco when the Dynatrace team owns it, needs multi-environment promotion and templating focused on Dynatrace. Both are valid; explain the trade-off.',
      v: { type: 'code', lang: 'hcl · Terraform', code:
`terraform {
  required_providers {
    dynatrace = { source = "dynatrace-oss/dynatrace" }
  }
}
# Credentials from env: DYNATRACE_ENV_URL, DYNATRACE_API_TOKEN

resource "dynatrace_maintenance" "payments_patch" {
  enabled = true
  general_properties {
    name        = "Payments monthly patch"
    type        = "PLANNED"
    suppression = "DETECT_PROBLEMS_DONT_ALERT"
  }
  schedule {
    type = "MONTHLY"
    # ... start, end, day of month, time zone
  }
  filters { filter { entity_tags = ["team:payments"] } }
}`, note: 'Resource names and fields evolve with provider versions. Pin the version and check the provider docs.' } },
    { t: 'A CI/CD pipeline for Dynatrace', e: '🔄',
      k: 'A conveyor belt: check the toy, test it in the small room, then put it in the big room.',
      n: 'The target flow: an engineer changes YAML in a branch and opens a **pull request**. The pipeline runs linting and a **Monaco dry run** against dev. A reviewer approves. After merge, the pipeline deploys to **dev**, then, after an approval gate, to **prod**. Secrets come from the CI vault. You can also make Dynatrace part of application pipelines: send a **deployment event** after each release, so Davis knows about changes, and use **Site Reliability Guardian** to check SLOs before promoting a release. That is a strong end-to-end story.',
      v: { type: 'flow', nodes: [['🌿','Branch + PR','YAML change'],['🧪','CI checks','lint · monaco --dry-run'],['👀','Review','approval'],['🟢','Deploy dev','monaco deploy -e dev'],['🚦','Gate','manual / SRG check'],['🔴','Deploy prod','monaco deploy -e prod']] } },
    { t: 'Example: GitLab CI job', e: '🦊',
      k: 'The recipe the conveyor belt follows, written down so it is the same every time.',
      n: 'Here is a minimal GitLab C I pipeline. Validate runs a dry run on merge requests. Deploy dev runs on the main branch. Deploy prod is manual. The same idea works in GitHub Actions, Azure DevOps or Jenkins. In an interview, explain the principles more than the syntax: same artefact promoted through environments, secrets from a vault, dry run before apply, approvals for production, and drift detection by running download or plan on a schedule.',
      v: { type: 'code', lang: 'yaml · .gitlab-ci.yml', code:
`image: dynatrace/dynatrace-configuration-as-code:latest   # pin a version in real life
stages: [validate, deploy]

validate:
  stage: validate
  script: [ "monaco deploy manifest.yaml --environment dev --dry-run" ]
  rules: [ { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' } ]

deploy_dev:
  stage: deploy
  script: [ "monaco deploy manifest.yaml --environment dev" ]
  rules: [ { if: '$CI_COMMIT_BRANCH == "main"' } ]

deploy_prod:
  stage: deploy
  script: [ "monaco deploy manifest.yaml --environment prod" ]
  rules: [ { if: '$CI_COMMIT_BRANCH == "main"', when: manual } ]` } }
  ],
  quiz: [
    { q: 'What do Settings 2.0 objects always have?', o: ['A schema ID and a scope','A Java class','A Grafana panel'], a: 0, why: 'Schema defines the shape, scope defines where it applies (environment, host, service…).' },
    { q: 'What should run on every pull request in a Monaco pipeline?', o: ['monaco deploy to prod','monaco deploy --dry-run','Nothing'], a: 1, why: 'Dry run validates templates, references and API acceptance without changing the tenant.' },
    { q: 'Where do you store the API tokens used by the pipeline?', o: ['In the Git repo for convenience','In a vault or CI secret store, with least privilege and expiry','In a dashboard description'], a: 1, why: 'Secrets never go into Git. Least privilege and rotation limit damage.' }
  ],
  interview: [
    { q: 'Monaco or Terraform for a new client?', a: 'It depends on **who owns the config** and **existing tooling**. Terraform if the platform team already uses it for cloud and wants one state-based workflow and plan output. Monaco if a Dynatrace CoE owns it, needs **multi-environment promotion**, templating, **download** of existing config, and Dynatrace-specific coverage (including documents and workflows). They can coexist if each object has one owner. Always pin versions, keep secrets in a vault, dry-run/plan in CI.' },
    { q: 'How would you onboard 50 application teams onto Dynatrace consistently?', a: 'Build a **golden baseline** as code: naming rules, **auto-tagging** from k8s labels/cloud tags (team, app, env), **host groups**, **segments or management zones**, IAM groups and policies per team, default **alerting profiles / workflows**, SLO templates, dashboard templates. Each team gets a small parameter file (team name, owners, channels) in a repo; the pipeline renders and deploys. Add docs and a short training. This scales, is auditable, and avoids snowflake configs.' }
  ]
}

]);
