/* Dynatrace Interview Masterclass — one 15-minute video.
   Scene fields: t title · e emoji · k one-line answer (on screen) · n narration · v visual · img [file, caption, source]
   Drill scenes: v.type = 'drill' with q (question) and pts (model-answer checklist, revealed after the think pause).
   In narration, [[think:N]] = N seconds of silence with a countdown, for you to answer aloud. */
window.EPISODES = [{
  id: 1, phase: 'Interview', minutes: 15,
  title: 'Dynatrace interview masterclass',
  blurb: 'Answer-shaped knowledge for an engineer or architect interview, then a spoken mock interview.',
  scenes: [

  /* ---------------- Part 1 · Method ---------------- */
  { t: 'How to answer any Dynatrace question', e: '🧭',
    k: 'Definition → how it works → example or trade-off → what I would do for a client.',
    n: 'Welcome. This video trains you to answer the questions a Dynatrace engineer or architect gets in an interview. Use one structure every time, in four layers. First, a one-sentence **definition**. Second, **how it works** inside, with the official terms. Third, a concrete **example or trade-off**. Fourth, **what you would do for a client**. Layer four is what separates a consultant from an operator. Keep each answer under ninety seconds. If you do not know a detail, say how you would verify it. Interviewers trust that more than a confident guess.',
    v: { type: 'stack', layers: [['1️⃣','Definition','One sentence, official term'],['2️⃣','How it works','Components, data flow, ports, names','hot'],['3️⃣','Example / trade-off','A real case, a choice and its cost'],['4️⃣','Client angle','What you would recommend, measure, automate'],['⏱️','Under 90 seconds','“I would verify X on the tenant” beats guessing','warn']] } },

  /* ---------------- Part 2 · Answer-shaped knowledge ---------------- */
  { t: 'The architecture answer', e: '🏗️',
    k: 'Agents and OTel collect, ActiveGate routes, the platform stores, maps and analyses, automation acts.',
    n: 'The most common opening question is: explain the Dynatrace architecture. Answer from left to right. **OneAgent**, with an OS module and **code modules** injected into processes, plus **OpenTelemetry** sources, collect the data. Traffic goes over **HTTPS four four three**, directly or through an **ActiveGate** on port **nine nine nine nine**. On SaaS, **OpenPipeline** processes it and **Grail** stores it in **buckets**. **Smartscape** builds the topology. **Davis** detects anomalies and opens **problems** with a root cause. **Workflows** or notifications act on them. Finish with how people use it: **DQL**, dashboards, notebooks and apps.',
    v: { type: 'flow', nodes: [['🕵️','OneAgent · OTel','collect'],['🏤','ActiveGate','9999 → 443'],['🧹','OpenPipeline','process'],['🗄️','Grail','buckets'],['🧠','Smartscape · Davis','topology · problems'],['⚙️','Workflows','act']] } },

  { t: 'SaaS, Managed, and the migration question', e: '🏠',
    k: 'SaaS: operated by Dynatrace, full platform. Managed: your cluster, your operations, classic features.',
    n: '**SaaS** runs on AWS, Azure or Google Cloud in a region you choose, operated by Dynatrace, with **Grail**, **AppEngine**, **Workflows** and the new **Dashboards**. **Managed** is a cluster in the customer data centre, with **Mission Control**, chosen for strict residency or air-gapped networks, and the customer runs capacity, backups and upgrades. Expect a follow-up: how do you migrate? Say: assess, design the target, move configuration as code with **Monaco**, re-point agents in waves with a parallel run, validate alerting parity, then decommission. Add that historical data usually does not move, so plan the overlap.',
    v: { type: 'compare', cols: [['SaaS',['Hosted in a cloud region','Grail · AppEngine · Workflows','Dynatrace runs upgrades']],['Managed',['Customer data centre','Classic features, Mission Control','Customer runs operations']]], note: 'Migration: **assess → design → Monaco → agent waves + parallel run → parity → decommission**.' } },

  { t: 'The OneAgent answer', e: '🕵️',
    k: 'One agent per host; code modules give code-level traces; restart the process to inject.',
    n: '**OneAgent** is installed once per host. The **OS module** collects host metrics and discovers processes. For Java, dot NET, Node, PHP, Go and web servers, **code modules** are injected into the process to capture **PurePath** traces without code changes. The key gotcha: a process must be **restarted** to load the code module. Mention the modes: **Full-Stack**, **Infrastructure**, and **Discovery**, chosen per **host group** on value and cost. Mention **oneagentctl** to read the server, tenant and host group. Saying this in under a minute shows real hands-on experience.',
    v: { type: 'stack', layers: [['🧩','OS module','host metrics, process discovery, logs'],['💉','Code modules','in-process traces · restart required','hot'],['🎚️','Modes','Full-Stack · Infrastructure · Discovery'],['🧰','oneagentctl','--get-server · --get-tenant · --set-host-group']] } },

  { t: 'ActiveGate and network zones', e: '🏤',
    k: 'ActiveGate concentrates and secures traffic; network zones keep it local; at least two per zone.',
    n: '**ActiveGate** receives OneAgent traffic on port nine nine nine nine, compresses and buffers it, and forwards it on four four three, so only ActiveGates need egress. It also runs **Extensions**, **Kubernetes API** and **cloud** monitoring, **private synthetic** locations and **zRemote**. For a multi-site design, use **network zones**: agents prefer ActiveGates in their own zone and fall back if allowed. The design rule to state clearly: **at least two ActiveGates per zone** for high availability, and separate ActiveGates by role in large estates.',
    v: { type: 'chips', items: [['Port 9999','OneAgent → ActiveGate'],['Port 443','ActiveGate → cluster'],['Network zones','Local routing + fallback'],['2+ per zone','High availability'],['Roles','Routing · extensions · synthetic · k8s'],['Proxy / TLS','Trust the corporate root CA']] },
    img: ['routing-with-zones.webp','Official diagram: agents routed to ActiveGates in their own network zone.','https://docs.dynatrace.com/docs/manage/network-zones-classic/network-zones-basic-info'] },

  { t: 'Smartscape and Davis', e: '🧠',
    k: 'Events on entities → Davis correlates through Smartscape → one problem with root cause and impact.',
    n: 'For Davis questions, connect three ideas. **Smartscape** is the live topology: **vertical** for what runs on what, **horizontal** for who calls whom. Davis learns **baselines** and raises **events**, such as slowdown, error, availability and resource contention. Then it correlates events through the topology into one **problem**, and walks the dependency graph to the deepest abnormal entity: the **root cause**. That is **causal AI**, not just correlation. The business value in one sentence: one problem with a cause instead of fifty alerts.',
    v: { type: 'flow', nodes: [['🔔','Events','on entities'],['🗺️','Smartscape','vertical + horizontal'],['📦','Problem','correlated'],['🎯','Root cause','+ impact']] },
    img: ['problem-graph.webp','Smartscape problem graph from the official docs.','https://docs.dynatrace.com/docs/analyze-explore-automate/smartscape/smartscape-views/problem-graph'] },

  { t: 'Alerting and maintenance windows', e: '📬',
    k: 'Detect with baselines or static thresholds, route by ownership tags, suppress alerts during change, keep evidence.',
    n: 'Alerting questions test judgement. Use **static thresholds** for contracts and hard limits, and **baselines** when you cannot predict normal. Route by ownership **tags**, with **alerting profiles** and problem notifications on classic, or **Workflows** on the new platform, into ITSM and chat. For **maintenance windows**, explain the three behaviours: detect and alert, detect without alerting, or disable detection. Recommend detecting without alerting during changes, because you keep the evidence, and automate windows from the change calendar through the **Settings API**. This is your operational strength. Use it.',
    v: { type: 'chips', items: [['Static threshold','SLA, disk full'],['Baseline','Unknown normal'],['Ownership tags','team · app · env'],['Detect, no alert','Keep evidence during change'],['Settings API','Automate windows from ITSM'],['Measure','Noise per week · MTTA']] } },

  { t: 'Grail, OpenPipeline and buckets', e: '🗄️',
    k: 'Schema-on-read lakehouse; OpenPipeline parses, masks, routes; bucket retention drives cost and access.',
    n: '**Grail** is a **schema-on-read** data lakehouse for logs, metrics, spans, events and business events, with **massively parallel** queries in **DQL**. Data is stored in **buckets**, each with a **retention** period and access control through **IAM policies**. **OpenPipeline** processes data on arrival: parse, **mask** personal data for GDPR, extract metrics or business events, route to the right bucket, or drop. If asked about a log cost explosion, answer with OpenPipeline: drop noise, short-retention buckets for debug logs, metrics instead of log scans for dashboards.',
    v: { type: 'stack', layers: [['📥','Ingest','OneAgent · OTLP · APIs'],['🧹','OpenPipeline','parse · mask · extract · route · drop','hot'],['🪣','Buckets','retention + IAM per bucket'],['🔎','DQL','one language for everything']] } },

  { t: 'DQL you must write live', e: '⌨️',
    k: 'fetch for records, timeseries for metrics; filter early, short timeframe, summarize by an entity.',
    n: 'Expect to write a query live. Use **fetch** for records like logs and spans, and **timeseries** for metrics. Read the first query aloud: fetch logs from the last hour, keep errors, count them per host, sort, top ten. The second gets average CPU per host and keeps hosts above eighty percent. Good habits to mention: a short timeframe, filter early, and check field names on the tenant with limit one. On some contracts query cost depends on data scanned, so query hygiene is also cost control.',
    v: { type: 'code', lang: 'DQL', code:
`fetch logs, from: now() - 1h
| filter loglevel == "ERROR"
| summarize errors = count(), by: { dt.entity.host }
| sort errors desc
| limit 10

timeseries cpu = avg(dt.host.cpu.usage), by: { dt.entity.host }
| fieldsAdd avg_cpu = arrayAvg(cpu)
| filter avg_cpu > 80` } },

  { t: 'Traces and OpenTelemetry', e: '🧵',
    k: 'traceparent carries context; OTLP over HTTP to /api/v2/otlp; OneAgent plus OTel, one owner per service.',
    n: 'A **trace** is one request across services, made of **spans** that share a **trace ID**. Context travels in the **W3C traceparent** header; if a gateway or queue drops it, the trace breaks. **OpenTelemetry** gives an SDK, auto-instrumentation and the **Collector**, and Dynatrace ingests **OTLP over HTTP** at slash a p i slash v two slash o t l p, with **delta** metrics. The architect answer: OneAgent where it can run, OpenTelemetry for custom spans and places agents cannot reach, one owner per service to avoid duplicate spans, and **tail sampling** when you must keep every error.',
    v: { type: 'code', lang: 'header · W3C Trace Context', code:
`traceparent: 00-<trace-id 32 hex>-<parent-span-id 16 hex>-01

# Collector exporter
exporters:
  otlphttp/dynatrace:
    endpoint: "https://<env-id>.live.dynatrace.com/api/v2/otlp"
    headers: { Authorization: "Api-Token \${env:DT_API_TOKEN}" }` },
    img: ['otel-ingest.webp','Official diagram: OTLP directly to the API or through a Collector.','https://docs.dynatrace.com/docs/ingest-from/opentelemetry'] },

  { t: 'Kubernetes in one minute', e: '☸️',
    k: 'Helm installs the Operator; a DynaKube declares the mode; cloudNativeFullStack is the usual default.',
    n: 'On Kubernetes, install the **Dynatrace Operator** with **Helm** or GitOps, then declare a **DynaKube** custom resource. It sets the mode and an **ActiveGate** for **Kubernetes API monitoring** and routing. **cloudNativeFullStack** is the usual default: node monitoring plus pod injection through a **mutating webhook** and the **CSI driver**. **applicationMonitoring** injects pods only, for platforms that refuse privileged DaemonSets. Mention that existing pods need a restart, and on **OpenShift**, **Security Context Constraints** and image mirroring.',
    v: { type: 'chips', items: [['Operator','Helm or Argo CD'],['DynaKube','Desired state (custom resource)'],['cloudNativeFullStack','Nodes + webhook injection'],['applicationMonitoring','Pods only, less privilege'],['ActiveGate','kubernetes-monitoring + routing'],['OpenShift','OperatorHub · SCC · mirroring']] },
    img: ['cloud-native-fullstack.webp','Official diagram of cloud-native full-stack injection.','https://docs.dynatrace.com/docs/ingest-from/setup-on-k8s/how-it-works/cloud-native-fullstack'] },

  { t: 'Configuration as code', e: '🤖',
    k: 'Settings 2.0 schemas in Git, Monaco or Terraform, dry run on every PR, secrets in a vault.',
    n: 'Most configuration is **Settings 2.0** objects, each with a **schema** and a **scope**, so it can live in **Git**. **Monaco** uses a **manifest** with projects and environments, YAML plus JSON templates, **download** and **deploy**. The **Terraform provider** suits teams already on Terraform. The pipeline: pull request, **dry run** or plan, review, deploy to dev, approval gate, deploy to prod. Tokens follow **least privilege**, with expiry and a vault. Add **deployment events** from every application pipeline, so Davis sees changes.',
    v: { type: 'flow', nodes: [['🌿','Pull request','YAML change'],['🧪','Dry run','monaco --dry-run'],['👀','Review',''],['🟢','Dev','deploy'],['🚦','Gate','approval'],['🔴','Prod','deploy']] } },

  { t: 'Cost and licensing', e: '💸',
    k: 'DPS is consumption on a rate card; classic is host units and DDUs; measure drivers before cutting.',
    n: 'Cost questions are common for consultants. The **Dynatrace Platform Subscription** is an annual commitment consumed through a **rate card**. **Classic licensing** uses **host units** and **Davis Data Units**. Never quote prices; say they come from the contract. If a client says it is too expensive, measure first, then use the levers: **Infrastructure** mode where code-level detail is not needed, OpenPipeline drop and routing, short retention for noisy logs, controlled metric **cardinality**, no duplicate ingestion. Present each saving with its visibility impact.',
    v: { type: 'stack', layers: [['📊','Measure','consumption by capability and team'],['🎚️','Monitoring mode','Full-Stack only where it pays','hot'],['🧹','Logs','drop · route · retention'],['🔢','Cardinality','no IDs as dimensions','warn'],['⚖️','Trade-off','saving vs visibility, agreed with the client']] },
    img: ['usage-overview.webp','The Usage Overview dashboard from the official docs (DPS).','https://docs.dynatrace.com/docs/manage-your-costs/view/usage-dashboards'] },

  { t: 'The troubleshooting answer', e: '🧯',
    k: 'Find the pattern, then: agent alive, right target, network path, TLS and auth, process restart.',
    n: 'For any “no data” scenario, show a method. First look for a **pattern**: same subnet, operating system or proxy. Then check five things in order. Is the agent running? Is it pointing at the right server and tenant, with **oneagentctl**? Is the network path open, to the ActiveGate on nine nine nine nine or the cluster on four four three? Are there **proxy**, **TLS inspection** or token errors in the logs? And if the host is visible but services are missing, was the process restarted? End by fixing the cause in the deployment automation, not by hand.',
    v: { type: 'stack', layers: [['🔍','Pattern','subnet · OS · proxy'],['1️⃣','Agent alive','service + watchdog'],['2️⃣','Right target','--get-server · --get-tenant'],['3️⃣','Network','9999 / 443 · firewall','hot'],['4️⃣','TLS + auth','corporate CA · 401 in logs','warn'],['5️⃣','No services','restart process · supported tech']] } },

  { t: 'Telling your own story', e: '🎙️',
    k: 'STAR, real scope, real numbers, then one sentence on how you would do it as an engineer today.',
    n: 'You will be asked about your experience. Use **STAR**: situation, task, action, result. Be honest about your scope. Your strength is operations on a large Managed estate: health views, problems, incidents and maintenance windows. Present it, then add the engineering layer: “Today I would automate this with the Settings API and Monaco, route by tags with workflows, and measure noise and acknowledgement time.” Never share internal hostnames or client data. Describe scale and problems instead. End with a question for them, such as how their clients are moving to the latest platform.',
    v: { type: 'stack', layers: [['🧭','Situation','scale, constraint'],['🎯','Task','what you owned'],['🛠️','Action','tools, choices, trade-offs','hot'],['📊','Result','a number you can defend'],['➕','Engineer layer','how you would automate it today']] } },

  /* ---------------- Part 3 · Mock interview ---------------- */
  { t: 'Mock interview: the rules', e: '🎤',
    k: 'Question → countdown → you answer out loud → model answer. Use the four layers each time.',
    n: 'Now the mock interview. Eight questions, each followed by a ten-second countdown. Answer out loud, and press Space if you need more time. Then compare with the model answer: definition, how it works, trade-off, client angle. Here is question one.',
    v: { type: 'chips', items: [['Question','read aloud'],['Countdown','10 s, answer aloud'],['Model answer','compare your four layers'],['Pause','Space bar for more time']] } },

  { t: 'Question 1 of 8', e: '1️⃣', k: 'Architecture, end to end.',
    n: 'Question one. Draw the Dynatrace architecture for me, from the application to the alert. [[think:10]] Model answer. OneAgent with code modules, and OpenTelemetry sources, collect metrics, logs and traces. Data goes over HTTPS, directly or through ActiveGates in network zones. On SaaS, OpenPipeline processes it and Grail stores it in buckets with retention. Smartscape links everything to entities, Davis turns events into problems with a root cause, and workflows send them to ServiceNow or Teams. People consume it through DQL, notebooks and dashboards.',
    v: { type: 'drill', q: 'Draw the Dynatrace architecture from the application to the alert.', pts: ['OneAgent (code modules) + OpenTelemetry collect','HTTPS 443, direct or via ActiveGate (9999) and network zones','OpenPipeline → Grail buckets with retention','Smartscape topology → Davis events → problem + root cause','Workflows / notifications → ITSM, chat','DQL, notebooks, dashboards for users'] } },

  { t: 'Question 2 of 8', e: '2️⃣', k: 'Forty hosts send no data.',
    n: 'Question two. Agents are installed on three hundred servers, but forty show no data. What do you do? [[think:10]] Model answer. First I look for a pattern among the forty: same subnet, operating system or proxy. Then I check the agent is running, use oneagentctl to confirm the server and tenant, test the network path to the ActiveGate or cluster, and read the logs for proxy, TLS inspection or token errors. If hosts appear without services, the processes need a restart. Finally, I fix the root cause in the deployment automation for all forty at once.',
    v: { type: 'drill', q: 'OneAgent is on 300 servers, 40 show no data. Walk me through it.', pts: ['Look for a pattern: subnet, OS, proxy','Agent and watchdog running','oneagentctl --get-server / --get-tenant','Network path: 9999 to ActiveGate, 443 to cluster','Logs: proxy, TLS inspection, 401','Host visible, no services → restart process','Fix it in automation, not by hand'] } },

  { t: 'Question 3 of 8', e: '3️⃣', k: 'Too many notifications.',
    n: 'Question three. The operations team says Dynatrace sends too many notifications. How do you fix it? [[think:10]] Model answer. I measure first: notifications per week, per team and per category, and which ones led to action. Then I route by ownership tags, with alerting profiles or workflows per team, so only high severity production problems page someone. I tune anomaly detection only for proven noisy services, fix bad service detection, add maintenance windows linked to changes, and remove duplicate custom alerts. I keep all of it as code, and report the drop in noise and the faster acknowledgement time.',
    v: { type: 'drill', q: 'Operations complains of too many Dynatrace notifications.', pts: ['Measure: volume per team, category, actionability','Route by ownership tags (profiles / workflows)','Page only high-severity prod problems','Tune noisy services with evidence','Maintenance windows from change calendar','Remove duplicates; config as code','Report noise and MTTA before/after'] } },

  { t: 'Question 4 of 8', e: '4️⃣', k: 'Log costs exploded.',
    n: 'Question four. A client ingests two terabytes of logs a day, and the cost has exploded. What do you do? [[think:10]] Model answer. I break the volume down by source, namespace and log level, and look at which queries scan the most data. Then I act in OpenPipeline: drop debug and health-check noise, route low-value logs to short-retention buckets, keep audit logs in long-retention buckets, mask personal data, and extract metrics so dashboards stop scanning logs. I also fix log levels at the source. I present every saving with its visibility impact and report the result.',
    v: { type: 'drill', q: '2 TB of logs per day and the cost exploded. Your plan?', pts: ['Measure: source, namespace, level, scanned GB','OpenPipeline: drop noise','Route to buckets by retention (audit long, debug short)','Mask PII at ingest','Extract metrics for dashboards','Fix log levels at the source','Saving vs visibility, then report'] } },

  { t: 'Question 5 of 8', e: '5️⃣', k: 'Twelve Kubernetes clusters.',
    n: 'Question five. Design Dynatrace monitoring for twelve EKS clusters across three regions. [[think:10]] Model answer. I deploy the Operator through Helm or Argo CD, with one DynaKube per cluster generated from a template, in cloudNativeFullStack mode. Each cluster gets an ActiveGate for Kubernetes API monitoring and routing, with a network zone per region. Tags come from Kubernetes labels for team, app and environment. The AWS integration covers managed services. Tokens come from a secrets manager, alerting and segments are deployed as code, and Operator upgrades are tested in a non-production cluster first.',
    v: { type: 'drill', q: 'Design monitoring for 12 EKS clusters in 3 regions.', pts: ['Operator via Helm / GitOps','One DynaKube per cluster from a template','cloudNativeFullStack','ActiveGate: kubernetes-monitoring + routing','Network zone per region','Tags from k8s labels','AWS integration, secrets manager, config as code','Upgrade in non-prod first'] } },

  { t: 'Question 6 of 8', e: '6️⃣', k: 'Monaco or Terraform?',
    n: 'Question six. Monaco or Terraform for a new client? [[think:10]] Model answer. It depends on who owns the configuration and what tooling they already use. Terraform fits a platform team that already manages cloud with Terraform and wants state and plan in one workflow. Monaco fits a Dynatrace team that needs multi-environment promotion, templating and downloading existing configuration, for example during a Managed to SaaS migration. They can coexist if each object has a single owner. Either way: pinned versions, secrets in a vault, and a dry run or plan on every pull request.',
    v: { type: 'drill', q: 'Monaco or Terraform for a new client?', pts: ['Depends on ownership and existing tooling','Terraform: platform team, state + plan','Monaco: Dynatrace team, multi-env promotion, download','Can coexist: one owner per object','Pin versions, vault secrets','Dry run / plan on every PR'] } },

  { t: 'Question 7 of 8', e: '7️⃣', k: 'Checkout is slow, right now.',
    n: 'Question seven. Checkout response time just doubled in production. Talk me through your investigation. [[think:10]] Model answer. I open the Davis problem to see the impact, the root-cause candidate and recent changes. I follow the service flow and a few slow traces to find where the time goes. I check the infrastructure underneath: process, host or pod, CPU throttling, memory and garbage collection. I check deployment and configuration events, then the logs around the start time. I mitigate, for example with a rollback or by scaling, confirm the recovery in the metrics, and write a postmortem whose actions go into code.',
    v: { type: 'drill', q: 'Checkout response time doubled in production. Investigate.', pts: ['Davis problem: impact, root cause, changes','Service flow + slow traces','Infrastructure: pod / host, throttling, GC','Deployment and config events','Logs around the start','Mitigate (rollback / scale) and verify','Postmortem, actions as code'] } },

  { t: 'Question 8 of 8', e: '8️⃣', k: 'Why should we hire you?',
    n: 'Question eight. Tell me about your Dynatrace experience, and why you are ready for this role. [[think:10]] Model answer. Give a short, honest story. I run Dynatrace every day on a large Managed estate with thousands of hosts and mixed platforms. I handle problems, incidents and maintenance windows, so I understand what operations teams need. I have been building the engineering layer: Grail and DQL, OpenTelemetry, the Kubernetes Operator, and configuration as code with Monaco, practised in my own lab. With a consultancy, I want to design and deploy these platforms for clients and explain the trade-offs clearly.',
    v: { type: 'drill', q: 'Tell me about your Dynatrace experience. Why are you ready?', pts: ['Honest scope: daily ops on a large Managed estate','Problems, incidents, maintenance windows','Engineering layer you built: DQL, OTel, Operator, Monaco','Proof: your own lab, notebooks, pipeline','Motivation: design and deploy for clients','No internal names or client data'] } },

  { t: 'Wrap-up', e: '🏁',
    k: 'Four layers, ninety seconds, a method for every scenario, honesty about scope.',
    n: 'Well done. Four layers, under ninety seconds, a method for every scenario, and honesty about what you would verify. Replay the mock interview until it feels natural, then try the written check below. Good luck.',
    v: { type: 'stack', layers: [['🧭','Four layers','definition · how · trade-off · client','hot'],['⏱️','90 seconds','short, structured'],['🧯','Method','every scenario has steps'],['🤝','Honesty','verify, do not invent']] } }
  ],

  quiz: [
    { q: 'Which port do OneAgents use by default to reach an Environment ActiveGate?', o: ['9999','443 only','8443'], a: 0, why: 'OneAgent → ActiveGate on 9999; ActiveGate → cluster on 443.' },
    { q: 'During a planned patch, which maintenance behaviour keeps evidence but wakes nobody?', o: ['Disable problem detection','Detect problems, do not alert','Delete the hosts'], a: 1, why: 'Problems are still recorded for later analysis; notifications are suppressed.' },
    { q: 'Which DQL command queries a metric such as dt.host.cpu.usage?', o: ['fetch','timeseries','makeTimeseries'], a: 1, why: 'timeseries reads metrics; makeTimeseries builds a series from records.' },
    { q: 'Which DynaKube mode injects pods only, without a host agent?', o: ['cloudNativeFullStack','hostMonitoring','applicationMonitoring'], a: 2, why: 'applicationMonitoring is for platforms that refuse privileged DaemonSets.' },
    { q: 'Where should you mask personal data in logs on SaaS?', o: ['In OpenPipeline at ingest','On the dashboard','After retention ends'], a: 0, why: 'Masking at ingest prevents storing it at all.' }
  ],
  interview: [
    { q: 'What is the difference between an event and a problem?', a: 'An **event** is one detected occurrence on an entity (slowdown, error, crash, deployment, custom). A **problem** is Davis\'s correlated story across the topology over time, with **root cause**, **impact** and a lifecycle. Notifications normally follow problems, which is why one incident gives one alert.' },
    { q: 'When do you need an ActiveGate?', a: 'When agents cannot reach the internet or egress must be concentrated, for **API-based monitoring** (Kubernetes, cloud, VMware), **Extensions 2.0**, **private synthetic** locations, or **zRemote**. Minimum **two per network zone**; separate roles at scale.' },
    { q: 'How do you secure API tokens in automation?', a: '**Least privilege** scopes, one token per purpose, **expiry** and **rotation**, stored in a **vault** or CI secret store, never in Git. For platform APIs use **OAuth clients** with IAM permissions. Audit token usage.' },
    { q: 'What is an SLO and how do you alert on it?', a: 'An **SLI** measures good events (e.g. requests under 500 ms), the **SLO** sets the target over a window (99.5% over 28 days), the **error budget** is the remainder. Alert on **burn rate**, for example fast burn over 1 hour and slow burn over 6 hours, rather than on every dip.' },
    { q: 'How would you monitor a GenAI chatbot?', a: 'Instrument with **OpenTelemetry / OpenLLMetry** using **GenAI semantic conventions**, export **OTLP**. Trace retrieval, model calls, tools and guardrails. Track **latency**, **errors / 429s**, **tokens and cost** per model and team, and **user feedback**. No prompt content by default; **mask** in OpenPipeline, restricted bucket.' },
    { q: 'What question would you ask the interviewer?', a: 'Which platform generation are your main clients on, and how many are migrating to the latest Dynatrace? How is the Dynatrace practice organised (CoE, certifications, pre-sales)? What does a first mission usually look like for this role?' }
  ]
}];
