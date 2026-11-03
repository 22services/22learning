/* Dynatrace Chalkboard Masterclass — lessons 7 to 12. Same scene format as episodes-a.js. */
window.EPISODES = (window.EPISODES || []).concat([

/* ================================================================ 07 */
{
  id: 7, phase: 'Phase III · Engineering and automation', minutes: 18,
  title: 'Kubernetes and cloud observability',
  blurb: 'Containers, Kubernetes objects, the Dynatrace Operator and DynaKube, OpenShift, AWS, Azure, GCP.',
  scenes: [
    { t: 'Containers: lunch boxes for programs', e: '🍱',
      k: 'A lunch box holds everything for lunch: the sandwich, the fork, the napkin. Open it anywhere, lunch is the same.',
      n: 'A **container** packages an application with its libraries, so it runs the same everywhere. It is built from an **image**, and isolated using Linux **namespaces** for what it can see, and **cgroups** for how much CPU and memory it can use. Containers share the host kernel, so they are lighter than virtual machines. For monitoring this means two things: one host runs many short-lived containers, and the CPU and memory limits set in cgroups matter more than the host totals. A container hitting its memory limit gets **OOMKilled**, even if the host has free memory.',
      v: { type: 'compare', cols: [['Virtual machine',['Own guest OS and kernel','Heavier, slower to start','Long-lived, named servers']],['Container',['Shares host kernel','namespaces (isolation) + cgroups (limits)','Short-lived, many per host, OOMKilled at limit']]] } },
    { t: 'Kubernetes: the school principal', e: '🏫',
      k: 'The principal decides which class each child sits in, replaces a sick teacher, and keeps the right number of children in each room.',
      n: '**Kubernetes** orchestrates containers. The **control plane**, with the **API server**, **scheduler**, **controller manager** and **etcd**, decides what runs where. **Nodes** run the workloads with the **kubelet**. The smallest unit is a **pod**, one or more containers sharing a network. **Deployments**, **StatefulSets** and **DaemonSets** keep the desired number of pods. **Services** give stable addresses. **Namespaces** separate teams or apps. You declare the desired state in YAML, and Kubernetes keeps making reality match it.',
      v: { type: 'stack', layers: [['🧠','Control plane','API server · scheduler · controllers · etcd','hot'],['🖥️','Nodes','kubelet · container runtime'],['📦','Workloads','Deployment · StatefulSet · DaemonSet · Job'],['🫛','Pods','one or more containers, shared network'],['🏷️','Namespaces + labels','team / app separation']] } },
    { t: 'The Dynatrace Operator and DynaKube', e: '🤖',
      k: 'A robot helper lives in the school. You give it one instruction card, and it puts a spy in every classroom by itself.',
      n: 'On Kubernetes, you do not install OneAgent by hand. You install the **Dynatrace Operator**, usually with **Helm**, into a dynatrace namespace. Then you create a custom resource called a **DynaKube**. It tells the Operator what to deploy: which **monitoring mode**, whether to deploy an **ActiveGate** for **Kubernetes API monitoring** and routing, and which namespaces to include. The Operator watches this resource and keeps everything in the desired state, including upgrades. This is the Kubernetes **operator pattern**, and you should be able to explain it.',
      v: { type: 'code', lang: 'bash + yaml · Operator', code:
`helm install dynatrace-operator oci://public.ecr.aws/dynatrace/dynatrace-operator \\
  --create-namespace --namespace dynatrace --atomic

# DynaKube (check the apiVersion supported by your Operator version)
apiVersion: dynatrace.com/v1beta3
kind: DynaKube
metadata: { name: prod-eu, namespace: dynatrace }
spec:
  apiUrl: https://abc12345.live.dynatrace.com/api
  oneAgent:
    cloudNativeFullStack: {}          # per-pod injection + host monitoring
  activeGate:
    capabilities: [kubernetes-monitoring, routing]
    resources: { requests: { cpu: 500m, memory: 1.5Gi } }`, note: 'Tokens go in a Secret named like the DynaKube (apiToken, dataIngestToken). Never commit them.' } },
    { t: 'Deployment modes on Kubernetes', e: '🎛️',
      k: 'You can watch the whole school, only certain classrooms, or only the building walls.',
      n: 'The DynaKube supports several modes. **cloudNativeFullStack** is the usual recommendation: it monitors the nodes, and injects code modules into pods through a **mutating webhook** and the **CSI driver**, so app pods get deep monitoring when they start. **applicationMonitoring** only injects into pods, with no host agent, useful when you cannot run privileged DaemonSets, such as on some managed or serverless platforms. **hostMonitoring** watches only the nodes. **classicFullStack** is the older approach. Choose based on platform rights, security policy, and what the client needs to see.',
      v: { type: 'chips', items: [['cloudNativeFullStack','Nodes + webhook injection into pods. Usual default'],['applicationMonitoring','Pod injection only. No host agent. Restricted platforms'],['hostMonitoring','Nodes only, infrastructure view'],['classicFullStack','Older DaemonSet approach'],['Namespace selector','Choose which namespaces get injected'],['Webhook + CSI driver','How code modules reach pods']], note: '**Gotcha:** pods started before the Operator need a restart (rollout restart) to be injected.' } },
    { t: 'What you see: the Kubernetes app', e: '🔭',
      k: 'From the principal\'s office you can see every class, every child, and who is feeling sick.',
      n: 'Once deployed, the **Kubernetes app** shows clusters, nodes, namespaces, workloads and pods, with health signals like **CPU throttling**, **memory working set** against **limits**, **restarts**, **OOM kills**, **pending pods**, and Kubernetes **events**. Workloads link to the services and traces running inside them, so you move from "pod restarting" to "which request failed" in two clicks. Teach clients the difference between **requests**, used for scheduling, and **limits**, enforced at runtime. Many incidents come from limits set too low.',
      v: { type: 'code', lang: 'DQL · Kubernetes', code:
`// Containers killed for memory in the last 24h, by namespace and workload
fetch events, from: now() - 24h
| filter k8s.namespace.name != "kube-system"
| filter contains(toString(event.name), "OOM") or contains(toString(event.reason), "OOM")
| summarize kills = count(), by: { k8s.namespace.name, k8s.workload.name }
| sort kills desc`, note: 'Event field names differ between sources. Inspect a sample first, then refine the filter.' } },
    { t: 'OpenShift specifics', e: '🎩',
      k: 'Same school, stricter rules: every helper needs a special badge before entering.',
      n: '**OpenShift** is Red Hat\'s Kubernetes distribution. The Dynatrace Operator is available through **OperatorHub** and is **Red Hat certified**. The main differences are security. OpenShift enforces **Security Context Constraints**, so the Operator needs the right permissions for its components. Projects are namespaces with extra policy. Routes replace some ingress patterns. Air-gapped OpenShift clusters often need images mirrored to an internal registry. In interviews, mention SCCs and image mirroring, and you will sound like someone who has really done it.',
      v: { type: 'chips', items: [['OperatorHub','Install the certified Dynatrace Operator'],['SCC','Security Context Constraints: permissions for agent pods'],['Projects','Namespaces with policy'],['Image mirroring','Air-gapped clusters need an internal registry'],['Routes','OpenShift ingress model'],['Monitoring stack','Coexists with built-in Prometheus']] } },
    { t: 'AWS, Azure and Google Cloud', e: '☁️',
      k: 'Some toys are rented from big toy shops. You cannot put a spy inside, but the shop sends you a report card.',
      n: 'For managed cloud services, such as databases, load balancers, queues or serverless functions, you cannot always install OneAgent. Dynatrace pulls their metrics and metadata through **cloud integrations**. On **AWS**, you create an **IAM role** that Dynatrace assumes, often with **CloudWatch Metric Streams** for low latency. On **Azure**, you use a **service principal** or app registration with reader rights on subscriptions. On **Google Cloud**, you use a **service account** and the GCP integration. Logs can arrive through **Firehose**, **Event Hubs**, or **Pub/Sub** forwarding. Serverless functions can use OneAgent layers or OTel.',
      v: { type: 'compare', cols: [['Agent-based (inside)',['EC2, Azure VMs, GCE: OneAgent','EKS, AKS, GKE: Operator + DynaKube','Lambda / Functions: layers or OTel']],['API-based (outside)',['AWS: IAM role + CloudWatch / Metric Streams','Azure: service principal + Monitor','GCP: service account + Cloud Monitoring','Logs: Firehose · Event Hubs · Pub/Sub']]], note: 'Cloud tags become Dynatrace tags. Agree a tagging policy (app, team, env, cost-centre) at the start.' } },
    { t: 'Production scenario: pods restarting at night', e: '🌙',
      k: 'Every night at two, one child falls asleep in class. Is it the child, the room, or the timetable?',
      n: 'A client says: the checkout pods restart every night around two A M. Method. One: in the Kubernetes app, check restart reasons, OOMKilled or failed probes. Two: compare memory working set to the limit over time. Three: look at what runs at two A M: a batch job, a backup, a cron job on the same node, or traffic from another time zone. Four: check traces and logs just before the restart. Five: check node pressure and evictions. The fix may be raising limits, fixing a memory leak, or moving the batch. Tell it like a story with evidence.',
      v: { type: 'stack', layers: [['1️⃣','Restart reason','OOMKilled vs liveness probe failure'],['2️⃣','Memory vs limit','working set trend before each restart','hot'],['3️⃣','What runs at 02:00?','CronJob, backup, batch, other time zone'],['4️⃣','Traces and logs','last requests and errors before restart'],['5️⃣','Node pressure','evictions, noisy neighbours','warn']] } }
  ],
  quiz: [
    { q: 'What does the Dynatrace Operator use to know what to deploy?', o: ['A DynaKube custom resource','A Grafana dashboard','A crontab'], a: 0, why: 'The Operator reconciles the DynaKube spec into running components.' },
    { q: 'Which mode is usually recommended for full observability on Kubernetes?', o: ['hostMonitoring','cloudNativeFullStack','None'], a: 1, why: 'It combines node monitoring and pod injection via webhook and CSI driver.' },
    { q: 'How does Dynatrace monitor AWS managed services like RDS?', o: ['By installing OneAgent inside RDS','Through the AWS integration with an IAM role and CloudWatch data','It cannot'], a: 1, why: 'Managed services are monitored through cloud APIs.' }
  ],
  interview: [
    { q: 'Design Dynatrace monitoring for 12 EKS clusters across 3 regions.', a: 'Operator via **Helm** or **GitOps (Argo CD)**, one **DynaKube** per cluster from a template, **cloudNativeFullStack**, ActiveGate per cluster with **kubernetes-monitoring** and **routing**, **network zones** per region. Namespace selectors to exclude system namespaces if needed. Tag from **k8s labels** (team, app, env). **AWS integration** for managed services, logs via OneAgent or Firehose with **OpenPipeline** routing to buckets. Config as code for alerting and segments. Validate token handling via secrets manager, and test upgrades in a non-prod cluster first.' },
    { q: 'Security team refuses privileged DaemonSets. What can you offer?', a: 'Explain what the host agent needs and why, then offer **applicationMonitoring** mode: pod-level injection only, no host agent, so less privilege but no full host visibility. Complement node metrics with the **Kubernetes API monitoring** via ActiveGate and, if needed, OTel or Prometheus scraping. Document the visibility gaps clearly so the decision is informed.' }
  ]
},

/* ================================================================ 08 */
{
  id: 8, phase: 'Phase IV · Advanced capabilities', minutes: 15,
  title: 'Davis analytics, SLOs and alerting design',
  blurb: 'Anomaly detection settings, metric events, SLOs, alert routing and a problem management process.',
  scenes: [
    { t: 'Three ways to detect trouble', e: '🚦',
      k: 'You can notice danger three ways: a smoke alarm with a fixed level, a parent who knows your usual mood, or a friend who learns patterns over time.',
      n: 'Dynatrace gives you three detection styles. **Built-in anomaly detection** for services, applications, hosts and Kubernetes, using baselines and sensible defaults you can tune. **Metric events**, now often called **custom alerts**, where you choose a metric or a DQL-based signal and a model: **static threshold**, **auto-adaptive threshold**, or **seasonal baseline**. And **Davis anomaly detectors** on Grail, which run a DQL query on a schedule and apply a model. Choose the simplest model that matches the behaviour of the signal.',
      v: { type: 'stack', layers: [['🏗️','Built-in anomaly detection','Services, apps, hosts, k8s · tune per entity or tag'],['📐','Metric events / custom alerts','static · auto-adaptive · seasonal baseline','hot'],['🔎','Anomaly detectors on Grail','DQL query + model, on a schedule'],['📤','Custom events via API','External tools push events into Davis']] } },
    { t: 'Tuning without breaking things', e: '🎻',
      k: 'You tune a guitar string a little at a time. Too tight, it snaps. Too loose, no music.',
      n: 'Default settings are good, but enterprises tune them. You can change sensitivity for **response time degradation**, **failure rate increase**, and **traffic drops**, globally, per service, or by tag. Use the **alerting window**, sometimes called violating samples over a sliding window, to avoid alerting on a single spike. Tune with evidence: list the noisy problems of the last month, check whether they were real, and adjust only those services. Store the tuned settings as code, so the reason for each change is documented in Git.',
      v: { type: 'chips', items: [['Response time','Absolute + relative degradation thresholds'],['Failure rate','Auto baseline or fixed %'],['Traffic','Drops and spikes'],['Sliding window','e.g. 3 of 5 samples to alert'],['Scope','Global → tag → single service'],['Evidence','Review last month\'s problems before tuning']] } },
    { t: 'SLOs: promises with numbers', e: '🤝',
      k: 'You promise mum to be home on time 99 days out of 100. That one late day is your "error budget".',
      n: 'A **service level indicator**, or **SLI**, measures good behaviour, such as the percentage of requests faster than five hundred milliseconds. A **service level objective**, or **SLO**, sets the target, for example ninety nine point five percent over twenty eight days. The **error budget** is what is left: point five percent. **Burn rate** tells you how fast you are using it. Dynatrace computes SLOs from metrics or DQL, shows them on dashboards, and can alert on fast burn. SLOs turn monitoring into a business conversation. Interviewers love this topic.',
      v: { type: 'stack', layers: [['📏','SLI','good requests / total requests'],['🎯','SLO','99.5% over 28 days','hot'],['💰','Error budget','0.5% of requests may fail or be slow'],['🔥','Burn rate','2× = budget gone in 14 days → alert','warn']] } },
    { t: 'Alert routing that people trust', e: '📬',
      k: 'The right letter to the right house. Nobody likes getting someone else\'s mail at three in the morning.',
      n: 'Detection is half the job. The other half is **routing**. In classic Dynatrace you combine **alerting profiles**, which filter by severity, delay and scope, with **problem notifications** to email, Slack, Teams, PagerDuty, ServiceNow, Jira or webhooks. On the latest platform, **Workflows** triggered by Davis problems can do the same with more logic, for example only page the payments team for production problems lasting more than ten minutes, and create a ServiceNow incident with the root cause. Design routing with teams, using **tags** for ownership.',
      v: { type: 'flow', nodes: [['📦','Problem','opened by Davis'],['🏷️','Ownership','tags: team, env, app'],['🧭','Filter','profile or workflow'],['📟','Route','PagerDuty · Teams · ITSM'],['🔁','Feedback','close loop · postmortem']] } },
    { t: 'Change events make Davis smarter', e: '📝',
      k: 'If you tell the doctor "I ate shrimp at lunch", he finds the cause of the tummy ache much faster.',
      n: 'Many incidents follow a change. Send **deployment events** and **configuration change events** to Dynatrace through the **Events API** or from your CI/CD pipeline, attached to the right entities. Davis then shows the change in the problem as possible evidence, and teams can see "this started five minutes after release one point four". It is cheap to do and very valuable. In a client project, adding deployment events to every pipeline is often a quick win you can propose in week one.',
      v: { type: 'code', lang: 'bash · Events API v2', code:
`curl -X POST "$DT_URL/api/v2/events/ingest" \\
  -H "Authorization: Api-Token $DT_TOKEN" -H "Content-Type: application/json" \\
  -d '{
    "eventType": "CUSTOM_DEPLOYMENT",
    "title": "checkout 1.4.0 deployed",
    "entitySelector": "type(SERVICE),tag(app:checkout),tag(env:prod)",
    "properties": { "dt.event.deployment.version": "1.4.0",
                    "dt.event.deployment.release_stage": "production",
                    "ci.pipeline": "gitlab#18233" }
  }'`, note: 'Token scope: **events.ingest**.' } },
    { t: 'Problem management, end to end', e: '🔁',
      k: 'When something breaks: notice, call the right helper, fix it, then learn so it does not happen again.',
      n: 'A mature process links Dynatrace to **ITSM**. Davis opens a problem. A workflow creates an incident in ServiceNow with the root cause and impact, and assigns it to the owner group from tags. The engineer uses the problem page, traces and a notebook to fix it, and comments are synced. When the problem closes, the incident is updated. Afterwards, the team runs a **postmortem**, and improvements become configuration changes in Git. You can measure **MTTD**, **MTTA** and **MTTR** from problem data in DQL.',
      v: { type: 'stack', layers: [['🔎','Detect','Davis problem · MTTD'],['📨','Notify','workflow → ITSM incident · MTTA'],['🛠️','Diagnose + fix','problem page, traces, notebook · MTTR','hot'],['✅','Close','auto-update incident'],['📚','Learn','postmortem → change as code']] } }
  ],
  quiz: [
    { q: 'An SLO of 99.9% over 30 days leaves an error budget of…', o: ['0.1% of the measured events','9.9%','Nothing'], a: 0, why: 'Budget = 100% − target.' },
    { q: 'What helps Davis link a problem to a release?', o: ['A deployment event sent from the pipeline','A bigger dashboard','Turning off baselines'], a: 0, why: 'Change events are evidence Davis attaches to problems on the same entities.' },
    { q: 'You need a fixed contractual limit of 2 s response time. Which model?', o: ['Static threshold','Seasonal baseline only','No alert'], a: 0, why: 'Contracts and hard limits suit static thresholds; baselines suit unknown normal behaviour.' }
  ],
  interview: [
    { q: 'How do you design alerting for a client with 200 services and 30 teams?', a: 'Start from **ownership**: tags for team, app, env from k8s labels or cloud tags. Define **severity levels** and which ones page. Use **workflows** or **alerting profiles** per team with filters and delays; send low severity to chat, high to on-call. Add **SLOs** with **burn-rate alerts** for critical user journeys. Integrate **ITSM**. Deploy everything as code. Review monthly: noisy problems, unrouted problems, MTTA.' },
    { q: 'What is the difference between an event and a problem in Dynatrace?', a: 'An **event** is a single detected occurrence on an entity (slowdown, error rate increase, process crash, custom event, deployment). A **problem** is Davis\'s correlated story: it groups related events across the topology over time, determines **root cause** and **impact**, and has a lifecycle (open, closed). Notifications are normally driven by problems, which is why one incident gives one alert instead of fifty.' }
  ]
},

/* ================================================================ 09 */
{
  id: 9, phase: 'Phase IV · Advanced capabilities', minutes: 14,
  title: 'AppEngine, Workflows and automation',
  blurb: 'Custom apps with the App Toolkit, app functions, the SDK, and AutomationEngine workflows.',
  scenes: [
    { t: 'AppEngine: apps inside Dynatrace', e: '🧩',
      k: 'You can build your own LEGO pieces and click them into the big Dynatrace castle.',
      n: '**AppEngine** lets you build custom applications that run inside the Dynatrace platform. They have direct, secure access to **Grail**, the **Settings**, documents and automation, using the logged-in user\'s permissions. Apps are written in **TypeScript** with **React** and the **Strato design system**, so they look like native Dynatrace apps. Server-side logic runs as **app functions**, which are serverless functions hosted by Dynatrace. Use cases: a team-specific operations cockpit, a cost report, an onboarding wizard, or an integration with an internal tool.',
      v: { type: 'stack', layers: [['🖼️','UI','React + Strato design system','hot'],['⚙️','App functions','Serverless TypeScript in the platform'],['📦','SDK clients','query, documents, settings, automation'],['🗄️','Grail + platform services','with the user\'s IAM permissions']] } },
    { t: 'Your first app in five commands', e: '🛠️',
      k: 'Like a cake mix: open the box, mix, bake, taste, and share.',
      n: 'You create an app with the **Dynatrace App Toolkit**, using npx d t dash app create, pointing to your environment. You run it locally with npm run start, which opens a development version connected to your tenant. You write a DQL query with the query client, and display the result with Strato components. When it is ready, npm run deploy publishes it to the environment. Because it is TypeScript, you can test, lint and deploy it through the same CI/CD pipeline as your other code.',
      v: { type: 'code', lang: 'bash + tsx · App Toolkit', code:
`npx dt-app@latest create --environment-url https://abc12345.apps.dynatrace.com
cd my-ops-cockpit && npm run start      # local dev against your tenant
npm run deploy                          # publish to the environment

// ui/app/pages/Errors.tsx (simplified)
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
const { data, isLoading } = useDqlQuery({ body: { query:
  'fetch logs | filter loglevel == "ERROR" | summarize c = count(), by: { k8s.namespace.name }' } });`, note: 'Package names and helpers change across SDK versions. Generate a fresh app and follow its README.' } },
    { t: 'Workflows: the automatic helper', e: '🤖',
      k: 'When the alarm rings, a robot automatically calls the plumber, opens the window and writes in the diary.',
      n: '**Workflows**, part of the **AutomationEngine**, are automations made of a **trigger** and **tasks**. Triggers can be a **Davis problem**, an **event**, a **schedule**, or a manual or API call. Tasks can run a **DQL query**, run **JavaScript**, call an **HTTP** endpoint, or use integrations such as **Slack**, **Microsoft Teams**, **Jira**, **ServiceNow**, **PagerDuty**, **Ansible** or **Red Hat Event-Driven Ansible**. Tasks can use conditions, loops and results of earlier tasks. This is where Dynatrace moves from seeing problems to fixing them.',
      v: { type: 'flow', nodes: [['⏰','Trigger','problem · event · schedule'],['🔎','DQL task','gather context'],['🧠','JS task','decide'],['📨','Integration','Slack · Jira · ServiceNow'],['🔧','Remediation','Ansible · HTTP']] } },
    { t: 'Example: auto-remediation with guardrails', e: '🛡️',
      k: 'The robot may restart the music box, but only twice, and only if a grown-up said yes.',
      n: 'Example: when Davis opens a problem where the root cause is a full disk on a non-production host, the workflow runs a DQL query to confirm, then calls an Ansible job to clean temporary files, then posts the result to the team channel. Guardrails are essential. Limit to known problem types and environments. Add an **approval** step for production. Make actions **idempotent**. Log every action as an event. And measure success, because a remediation that silently fails is worse than no remediation.',
      v: { type: 'stack', layers: [['🎯','Narrow trigger','problem category + root cause type + env:nonprod'],['🔎','Confirm with DQL','is it really the disk?'],['✋','Approval for prod','human in the loop','warn'],['🔧','Idempotent action','Ansible job / HTTP call','hot'],['📝','Record + notify','event on entity, message to team']] } },
    { t: 'Business use cases', e: '🛒',
      k: 'The doctor can also count how many cookies the bakery sold, and notice when sales suddenly drop.',
      n: 'Dynatrace is not only for IT. With **business events**, captured by OneAgent from request payloads, from real user monitoring, or sent through the API, you can follow orders, payments, sign-ups and their value in euros. Combined with traces, you can say: the slowdown in the payment service cost twelve thousand euros of abandoned carts in one hour. That sentence is what gets budget approved. Consultants who can connect technical signals to business impact are valued much more than pure tool operators.',
      v: { type: 'code', lang: 'DQL · business events', code:
`fetch bizevents, from: now() - 24h
| filter event.type == "com.shop.checkout.completed"
| makeTimeseries revenue = sum(amount), orders = count(), interval: 15m`, note: 'Event type names and fields are defined by the client. Agree a **business event schema** early.' } }
  ],
  quiz: [
    { q: 'Where does AppEngine server-side logic run?', o: ['In app functions hosted by the platform','On the user\'s laptop only','Inside OneAgent'], a: 0, why: 'App functions are serverless functions running in the Dynatrace platform.' },
    { q: 'Which is NOT a workflow trigger type?', o: ['Davis problem','Schedule','A DQL fetch command inside a dashboard tile'], a: 2, why: 'Triggers are events, problems, schedules or manual/API; DQL is used inside tasks.' },
    { q: 'What is the most important guardrail for auto-remediation in production?', o: ['Run as often as possible','Approval step, narrow trigger and idempotent actions','Hide the logs'], a: 1, why: 'Automation must be safe, scoped and auditable.' }
  ],
  interview: [
    { q: 'Give me one automation you would build in the first month for a client.', a: 'A **problem → ITSM** workflow: when Davis opens a production problem, look up the owner from **tags**, create a **ServiceNow incident** with title, root cause, impact and link, post to the team channel, and update or resolve the incident when the problem closes. Low risk, high value, measurable (MTTA). Second candidate: **deployment events** from every pipeline.' },
    { q: 'When would you build a custom AppEngine app instead of a dashboard?', a: 'When users need **interaction or logic** a dashboard cannot provide: forms, write-back to settings, multi-step flows, combining Dynatrace data with an **external API** via app functions, or a tailored experience for a non-technical audience. If it is read-only charts, a **Dashboard** or **Notebook** is cheaper to build and maintain.' }
  ]
},

/* ================================================================ 10 */
{
  id: 10, phase: 'Phase IV · Advanced capabilities', minutes: 15,
  title: 'Licensing, cost and platform optimisation',
  blurb: 'DPS rate card vs classic DDU and host units, cost drivers, volume control and a health check.',
  scenes: [
    { t: 'How Dynatrace is paid for', e: '🧾',
      k: 'A phone plan: you pay for minutes, messages and internet. Use more, pay more. Knowing the plan saves money.',
      n: 'Modern contracts use the **Dynatrace Platform Subscription**, or **DPS**. The client commits to an annual amount, and consumption of each capability is charged against it using a **rate card**. Older contracts use **classic licensing**: **host units** for hosts based on memory, and **Davis Data Units**, or **DDUs**, for custom metrics, logs, events and serverless. You must recognise both, because many clients are mid-migration. Never guess prices in an interview: explain the model and the drivers, and say rates come from the client\'s contract.',
      v: { type: 'compare', cols: [['DPS (current)',['Annual commitment, consumption-based','Rate card per capability','e.g. Full-Stack by memory GiB-hours','Logs: ingest, retain, query separately']],['Classic',['Host units (by host memory)','DEM units for user experience','DDUs for custom metrics, logs, events','Still on many existing contracts']]] } },
    { t: 'The main cost drivers', e: '🎯',
      k: 'Most of the phone bill comes from two or three things. Find them first.',
      n: 'In most environments, a few things drive most of the cost. **Full-Stack monitoring**, measured by host memory over time, so huge-memory hosts cost more. **Log ingest**, **retention** and **queries**. **Real user** sessions and **synthetic** tests. **Custom metrics** and high-cardinality dimensions. And **traces** volume. Use the **Account Management** usage views and DQL on billing data, where available, to find the top consumers per team. Cost reviews are a recurring consulting deliverable.',
      v: { type: 'chips', items: [['Full-Stack (GiB-hour)','Monitored host memory over time'],['Infrastructure','Lighter rate per host'],['Logs','Ingest + retain (GiB-day) + query (GiB scanned)'],['RUM / synthetic','Sessions and test executions'],['Custom metrics','Number of series; watch cardinality'],['Traces','Volume beyond included amounts']] } },
    { t: 'Ten levers to control volume', e: '🎚️',
      k: 'Turn off the lights in rooms nobody uses. Keep the lights on where people work.',
      n: 'Here are the levers. Choose **Infrastructure** mode for hosts that do not need code-level data. Exclude test or irrelevant processes from deep monitoring. In **OpenPipeline**, drop noise and route logs to buckets with the right retention. Extract metrics instead of querying logs. Control **metric cardinality**: never put a user ID or request ID as a dimension. Tune **RUM** session capture and synthetic frequency. Avoid duplicate OTel and OneAgent data. And review dashboards that scan large log ranges every minute. Always balance cost with the visibility the client needs.',
      v: { type: 'stack', layers: [['🎚️','Monitoring mode per host group','Full-Stack only where it pays'],['🧹','OpenPipeline drop + route','noise out, right bucket','hot'],['📈','Metrics from logs','dashboards stop scanning logs'],['🔢','Cardinality control','no IDs as metric dimensions','warn'],['🌐','RUM / synthetic tuning','sampling, frequency, locations'],['🔁','No double ingestion','one owner per signal']] } },
    { t: 'Platform performance and hygiene', e: '🧽',
      k: 'A tidy room is faster to play in. A messy room hides the toy you need.',
      n: 'Optimisation is also hygiene. Keep **OneAgent and ActiveGate versions** current, using update windows. Remove stale hosts and old tokens. Fix **service detection** that creates thousands of useless services, for example from unique URLs. Clean up unused dashboards and duplicated alerts. Check ActiveGate **resource usage** and scale out before saturation. Make sure **tags** and **naming** follow the convention. A quarterly **health check** report with findings and actions is a great consulting product.',
      v: { type: 'chips', items: [['Versions','OneAgent / ActiveGate update windows'],['Tokens','Expire, rotate, remove unused'],['Service sprawl','Fix URL-based explosion with detection rules'],['ActiveGate load','CPU, memory, queue, scale out'],['Tag coverage','% of entities with owner + env tags'],['Unused content','Old dashboards, duplicate alerts']] } },
    { t: 'Migration: Classic to latest Dynatrace', e: '🚚',
      k: 'Moving house: you pack carefully, label boxes, and make sure the new house works before giving back the keys.',
      n: 'Many clients are moving from Managed to SaaS, or from the classic interface to the latest platform. The second migration changes concepts. **Classic dashboards** move to new **Dashboards** with DQL tiles. **Management zones** are complemented by **segments** for filtering and **IAM policies** for access, including **record-level** permissions. **Problem notifications** can move to **Workflows**. **Log Monitoring classic** moves to Grail and OpenPipeline. A good plan inventories content, maps each item, migrates in waves, runs both in parallel, trains users, then switches off the old content.',
      v: { type: 'compare', cols: [['Classic',['Classic dashboards','Management zones','Problem notifications + alerting profiles','Log Monitoring classic, DDUs']],['Latest platform',['Dashboards + Notebooks (DQL)','Segments + IAM policies','Workflows (AutomationEngine)','Grail + OpenPipeline, DPS']]], note: 'Check the current Dynatrace upgrade guides: concept mapping keeps evolving release to release.' } }
  ],
  quiz: [
    { q: 'Which dimension choice is dangerous for metric cost and performance?', o: ['Using k8s namespace','Using a unique request ID or user ID','Using environment'], a: 1, why: 'Unbounded values explode cardinality: each value is a new series.' },
    { q: 'In DPS, log costs are typically split into…', o: ['Ingest, retain and query','Only the number of hosts','Number of dashboards'], a: 0, why: 'Log Management & Analytics consumption covers ingest/process, retention and query scanning.' },
    { q: 'In the latest platform, what complements management zones for filtering data?', o: ['Segments','Host units','Synthetic monitors'], a: 0, why: 'Segments filter data across apps; IAM policies control access.' }
  ],
  interview: [
    { q: 'The client says Dynatrace is too expensive. How do you respond?', a: 'Do not argue; **measure**. Break consumption down by capability and by team. Find the top drivers (Full-Stack on large hosts that need only Infrastructure, unfiltered logs, long retention, high-cardinality metrics, duplicate data). Propose levers with **estimated savings** and **visibility impact** for each, agree priorities, implement as code, and report the result. Also show **value**: incidents avoided, MTTR reduced, tools consolidated.' },
    { q: 'How would you plan a Managed to SaaS migration?', a: 'Phases: **assess** (inventory of config, dashboards, integrations, tokens, data residency, network), **design** (SaaS region, environments, ActiveGates, IAM, OpenPipeline), **migrate configuration as code** (Monaco download/convert/deploy), **re-point agents** in waves (oneagentctl or redeploy) with **parallel run**, validate data and alerting parity, migrate users and integrations, then **decommission**. Communicate history limits: historical data generally does not move, so plan overlap for reporting.' }
  ]
},

/* ================================================================ 11 */
{
  id: 11, phase: 'Phase V · Specialisation and interview', minutes: 14,
  title: 'AI and LLM observability',
  blurb: 'GenAI traces, prompts, tokens, cost, latency, RAG pipelines, guardrails and LLMOps.',
  scenes: [
    { t: 'Why AI apps need special watching', e: '🦜',
      k: 'A talking parrot may answer slowly, cost a lot of seeds, or say something wrong. You must watch all three.',
      n: 'An application that calls a **large language model** has new failure modes. Answers can be slow, because generation takes seconds. Cost depends on **tokens**, not requests. Quality can drop silently: wrong, unsafe or invented answers, called **hallucinations**. Providers have **rate limits**. And a single user question may trigger many steps: retrieval, several model calls, tools. **AI observability** covers performance, cost, quality and safety of these applications, and it uses the same building blocks you already know: traces, metrics, logs and events.',
      v: { type: 'chips', items: [['Latency','Time to first token, total generation time'],['Tokens','Input + output tokens drive cost'],['Errors','Rate limits (429), timeouts, content filters'],['Quality','Hallucinations, relevance, user feedback'],['Safety','Prompt injection, PII leakage, guardrails'],['Chains','Retrieval, tools, agents: many steps per question']] } },
    { t: 'An LLM trace, step by step', e: '🧵',
      k: 'The trail of stickers again, but now some rooms are "ask the library" and "ask the parrot".',
      n: 'An AI request is traced like any other. A root span for the user question. A child span for the **embedding** call. A span for the **vector database** search. A span for the **chat completion**, with attributes from the **OpenTelemetry GenAI semantic conventions**: the provider, the **request model**, **input tokens**, **output tokens**, and finish reason. Tools like **OpenLLMetry** add this instrumentation automatically for popular frameworks and SDKs, and export through OTLP to Dynatrace, which provides **AI observability** views on top.',
      v: { type: 'stack', layers: [['💬','span: POST /ask','root · 3.2 s','hot'],['🔢','span: embeddings','text-embedding model · 80 ms'],['📚','span: vector search','top-k = 5 · 120 ms'],['🧠','span: chat completion','gen_ai.request.model · input 1 850 / output 420 tokens · 2.8 s','warn'],['🛡️','span: guardrail check','policy pass · 60 ms']] } },
    { t: 'The key attributes', e: '🏷️',
      k: 'Each parrot answer gets a label: which parrot, how many words in, how many words out.',
      n: 'Learn the vocabulary of the **GenAI semantic conventions**. Attributes like **gen_ai.request.model** and **gen_ai.response.model**, **gen_ai.usage.input_tokens** and **gen_ai.usage.output_tokens**, and the operation name, such as chat or embeddings. With these on spans, you can build cost per team, latency per model, and error rates per provider with DQL. Be careful with **prompt and response content**: capturing it helps debugging but may contain personal data. Make it opt-in, mask it in OpenPipeline, and store it in a restricted bucket.',
      v: { type: 'code', lang: 'DQL · token usage', code:
`fetch spans, from: now() - 24h
| filter isNotNull(gen_ai.usage.input_tokens)
| summarize calls = count(),
            in_tokens = sum(gen_ai.usage.input_tokens),
            out_tokens = sum(gen_ai.usage.output_tokens),
            p95_ms = percentile(duration, 95) / 1ms,
            by: { gen_ai.request.model, service.name }
| sort in_tokens desc`, note: 'Semantic conventions for GenAI are still evolving. Check the attribute names your instrumentation emits.' } },
    { t: 'Observing RAG pipelines', e: '📚',
      k: 'Before answering, the parrot reads books from the library. If it picks the wrong book, the answer is wrong even if the parrot is clever.',
      n: '**Retrieval augmented generation**, or **RAG**, retrieves documents from a **vector store** and adds them to the prompt. Each stage can fail. Embeddings can be slow. Retrieval can return irrelevant chunks, giving poor answers. The prompt can become too long, raising cost and latency. Observe each stage as a span, track number of chunks and similarity scores as attributes, and correlate with user feedback, like thumbs up or down, sent as **business events**. Then you can answer: are bad answers caused by retrieval or by the model?',
      v: { type: 'flow', nodes: [['❓','Question','user'],['🔢','Embed','latency'],['📚','Retrieve','top-k, scores'],['🧩','Build prompt','tokens'],['🧠','Generate','latency, cost'],['👍','Feedback','bizevent']] } },
    { t: 'LLMOps and MLOps in one picture', e: '🔄',
      k: 'Training the parrot, testing it, letting it talk, and watching it every day are all part of the job.',
      n: '**MLOps** covers the lifecycle of machine learning models: data, training, evaluation, deployment and monitoring for **drift**. **LLMOps** applies this to LLM apps: prompt versions, model versions, evaluation datasets, guardrails, and cost control. Dynatrace fits in the operate stage: monitoring production behaviour, comparing a new prompt or model version through **deployment events** and attributes, and alerting on rising cost, latency or error rates. In an interview, show you understand the whole lifecycle, and position Dynatrace precisely in it.',
      v: { type: 'stack', layers: [['📦','Data + prompts','versioned in Git'],['🧪','Evaluate','offline test sets, quality metrics'],['🚀','Deploy','model / prompt version as deployment event'],['🔭','Observe (Dynatrace)','traces, tokens, latency, errors, feedback','hot'],['🔁','Improve','drift and cost signals feed the next version']] } }
  ],
  quiz: [
    { q: 'What mainly drives the cost of an LLM call?', o: ['Number of HTTP headers','Input and output tokens','Number of dashboards'], a: 1, why: 'Providers charge per token, so track gen_ai.usage.* attributes.' },
    { q: 'Where should prompt text containing personal data be handled?', o: ['Stored everywhere for debugging','Opt-in capture, masked in OpenPipeline, restricted bucket','Printed on dashboards'], a: 1, why: 'Privacy by design: minimise, mask at ingest, restrict access.' },
    { q: 'Answers are bad but the model is fine. Which RAG stage do you check first?', o: ['Retrieval: relevance and scores of chunks','The CSS of the chat page','The OneAgent version'], a: 0, why: 'Wrong context in, wrong answer out.' }
  ],
  interview: [
    { q: 'How would you monitor a client\'s new GenAI chatbot with Dynatrace?', a: 'Instrument with **OpenTelemetry** (e.g. **OpenLLMetry**) following **GenAI semantic conventions**, export **OTLP** to Dynatrace; OneAgent on the hosting services for the rest. Trace every stage: retrieval, model calls, tools, guardrails. Dashboards and alerts for **latency (incl. time to first token)**, **error/429 rates**, **tokens and cost per team/model**, and **user feedback** via business events. Privacy: no prompt content by default, masking in **OpenPipeline**, restricted bucket. Deployment events for prompt/model versions.' },
    { q: 'Cost of the chatbot doubled this week. How do you find why?', a: 'DQL over spans: tokens by **model**, **service**, **operation** and day. Check for a new **model version** (deployment events), **longer prompts** (more retrieved chunks, bigger system prompt), more **retries** after 429s, a loop in an **agent**, or traffic growth. Compare input vs output tokens per request before and after. Then fix the cause and add an alert on tokens per request.' }
  ]
},

/* ================================================================ 12 */
{
  id: 12, phase: 'Phase V · Specialisation and interview', minutes: 20,
  title: 'Architecture, incidents and the interview',
  blurb: 'An enterprise reference design, high-volume patterns, an incident drill and how to tell your story.',
  scenes: [
    { t: 'The enterprise reference architecture', e: '🏛️',
      k: 'Now you draw the whole city: neighbourhoods, post offices, roads, the library, the doctor, and the rules for who can enter where.',
      n: 'Here is a reference design to draw in an interview. Account with **SSO** and **IAM policies**. Two SaaS environments, production and non-production, in an **EU region** for data residency. Per data centre or cloud region, a **network zone** with at least two **ActiveGates**. OneAgent on VMs, **Operator** on Kubernetes, **cloud integrations** for managed services, an **OTel Collector** layer for open telemetry. **OpenPipeline** with masking, routing and buckets per retention. Configuration as code in Git with CI/CD. Workflows to ITSM and chat. And a governance model: owners, conventions, reviews.',
      v: { type: 'stack', layers: [['🔐','Identity + governance','SSO · groups · IAM policies · conventions · CoE','hot'],['🏢','Environments','prod + non-prod · EU region'],['🌐','Network zones','2+ ActiveGates per DC / region'],['📥','Collection','OneAgent · Operator · cloud integrations · OTel Collector'],['🧹','OpenPipeline + Grail','masking · routing · buckets by retention'],['🤖','Automation','Monaco/Terraform CI/CD · Workflows → ITSM']] } },
    { t: 'High-volume telemetry patterns', e: '🌊',
      k: 'When a river is huge, you build channels, dams and filters, or the village floods.',
      n: 'For very large estates: scale **ActiveGates** horizontally and separate their roles. Put an **OTel Collector** tier with **load balancing**, **memory limiters** and **batching** in front of high-volume OTel sources, and use **tail sampling** where it matters. Use **OpenPipeline** to drop and route early. Control **cardinality** at the source. Use **metrics** for dashboards and keep raw logs for investigation. Plan **network bandwidth** and proxy capacity. And monitor the monitoring: ActiveGate health, ingest rejections, and pipeline throughput.',
      v: { type: 'flow', nodes: [['🏭','Sources','thousands of hosts, pods'],['⚖️','LB + Collector tier','batch · limit · sample'],['🏤','ActiveGates','scaled per zone'],['🧹','OpenPipeline','drop · route · extract'],['🪣','Buckets','retention tiers']] } },
    { t: 'Incident drill: checkout is slow', e: '🚒',
      k: 'The fire alarm rings. You do not run around. You follow your plan, step by step.',
      n: 'Practise this out loud. Alert: checkout response time doubled. Step one, open the **Davis problem**: impact, root cause candidate, evidence, changes. Step two, follow the **service flow** and a few slow **traces** to see where time is spent. Step three, check the infrastructure under it: process, host or pod, CPU throttling, memory, garbage collection. Step four, check **deployment events** and config changes. Step five, look at logs in a notebook around the time. Step six, mitigate, such as rollback or scale, then confirm recovery in the metrics. Step seven, write the postmortem.',
      v: { type: 'stack', layers: [['1️⃣','Davis problem','impact · root cause · evidence'],['2️⃣','Service flow + traces','where is the time spent?','hot'],['3️⃣','Infrastructure','pod throttling · GC · DB host'],['4️⃣','Changes','deployment and config events'],['5️⃣','Logs in a notebook','errors around the start time'],['6️⃣','Mitigate + verify','rollback / scale · watch recovery','warn'],['7️⃣','Postmortem','actions as code']] } },
    { t: 'Case study you can tell', e: '📖',
      k: 'Tell the story like a good fairy tale: the problem, what you did, and the happy ending with numbers.',
      n: 'Use the **STAR** method: situation, task, action, result. Use your real operational experience honestly, for example maintenance windows and incident handling, and show the engineering layer you built on top. For example. Situation: alert storms during planned patching. Task: reduce noise without losing visibility. Action: maintenance windows driven by the change calendar through the Settings API, tag-based scopes, alerting profiles per team, and a weekly noise review. Result: fewer notifications, and faster acknowledgement. Only quote numbers you can defend.',
      v: { type: 'stack', layers: [['🧭','Situation','Context, scale, constraint'],['🎯','Task','What you owned'],['🛠️','Action','Technical steps: tools, design choices, trade-offs','hot'],['📊','Result','Measured outcome you can defend'],['💡','Learning','What you would do differently']] } },
    { t: 'What the interviewers will test', e: '🎤',
      k: 'The judges look at three things: do you know it, can you do it, and can you explain it to someone else.',
      n: 'For an engineer or architect role at a consultancy like Devoteam, expect three kinds of questions. **Knowledge**: architecture, components, ports, data flow, DQL, licensing. **Hands-on**: write a query, read a DynaKube, troubleshoot an agent, design network zones. **Consulting**: how you run a workshop, handle a client who disagrees, estimate a deployment, and explain cost. Also check the certifications Dynatrace offers, such as the **Associate** and **Professional** levels, as many partners value them. Prepare short, structured answers, and say when you would verify something rather than invent it.',
      v: { type: 'compare', cols: [['Technical',['Draw the architecture end to end','Write DQL live','Troubleshoot agents and broken traces','Design for Kubernetes and multi-region']],['Consulting',['Discovery workshop and scoping','Explain cost and trade-offs to a client','Migration plan with risks','Hand-over, training, governance']]] } },
    { t: 'Your 30-day practice plan', e: '🗓️',
      k: 'Little steps every day build a big tower.',
      n: 'Week one: lessons one to four, with a free trial tenant. Install OneAgent on a Linux VM, deploy a demo app, and read Davis problems. Week two: lesson five and six. Write twenty DQL queries in a notebook, and put two configurations into Monaco with a Git pipeline. Week three: lessons seven to nine. Deploy the Operator on a local cluster like kind or minikube, send OTel data through a Collector, build one workflow. Week four: lessons ten to twelve. Write your architecture diagram, rehearse three STAR stories, and replay every interview corner aloud.',
      v: { type: 'stack', layers: [['1️⃣','Week 1 · Foundations','Trial tenant · OneAgent on a VM · demo app · Davis'],['2️⃣','Week 2 · Data + automation','20 DQL queries · Monaco + Git pipeline'],['3️⃣','Week 3 · Cloud-native','Operator on kind/minikube · OTel Collector · a workflow','hot'],['4️⃣','Week 4 · Interview','Architecture diagram · 3 STAR stories · mock interviews']] } }
  ],
  quiz: [
    { q: 'What is the minimum ActiveGate count per network zone for high availability?', o: ['One','Two','Ten'], a: 1, why: 'Two gives redundancy; scale beyond that with load.' },
    { q: 'In an incident, what do you check right after the Davis problem summary?', o: ['The service flow and slow traces','The licence contract','The colour of the dashboard'], a: 0, why: 'Find where time is spent before diving into infrastructure.' },
    { q: 'What does STAR stand for?', o: ['Situation, Task, Action, Result','Start, Test, Alert, Repeat','Service, Trace, Agent, Root cause'], a: 0, why: 'A structured story with a measurable result.' }
  ],
  interview: [
    { q: 'Design an observability platform for a European retailer: 2 000 VMs, 15 Kubernetes clusters, AWS and Azure, strict GDPR.', a: 'SaaS in an **EU region**; account with **SSO**, groups, **IAM policies** per domain; prod and non-prod environments. **Network zones** per DC and cloud region, 2+ **ActiveGates** each, role-separated at scale. OneAgent via **Ansible** with host groups and tags; **Operator/DynaKube** via GitOps; **AWS/Azure integrations**; OTel **Collector** tier. **OpenPipeline**: PII masking, routing to buckets by retention (audit 1y, app 35d, debug 7d), metric extraction. Config as code (Monaco) with CI/CD. Workflows to ServiceNow and Teams. SLOs for checkout, search, payment. Governance: CoE, conventions, monthly cost and noise review.' },
    { q: 'Tell me about a time you handled a production incident.', a: 'Use **STAR** with your real experience. Be precise about what **you** did, the tools, the timeline and the outcome. Then add one sentence on how you would do it now with Dynatrace: Davis problem, traces, deployment events, workflow to ITSM, postmortem actions as code. Honesty about scope beats inflated claims; experienced interviewers probe details.' },
    { q: 'Which question would you ask us at the end?', a: 'Examples: Which Dynatrace platform generation are your main clients on, and how many are migrating to the latest platform? How is the Dynatrace practice organised (CoE, certifications, pre-sales)? What does a typical first mission look like for this role? These show you understand the real work.' }
  ]
}

]);
