---
name: incident-triage
description: Diagnose an active service outage or degradation by checking availability, TLS certificates, recent changes and bounded logs; produce evidence, ranked hypotheses and next checks. Use for initial incident investigation, not incident-management process design or automatic remediation.
---

# Incident triage

Investigate the failing user operation and identify the next discriminating check.
Prefer the project's incident runbooks, approved observability tools and installed
access helpers. This workflow collects evidence; it does not grant permission to
restart services, change DNS, roll back releases or alter access controls.

## Establish the target

Resolve the service, environment, exact failing operation, incident start time and
observation point from the request and repository. Distinguish user-facing impact
from a failed monitor. Ask only for missing information that prevents safe target
selection; continue independent read-only work meanwhile. Use UTC timestamps and
record the inspected time window and timezone conversions.

Read applicable local access instructions before remote operations. Reuse the
installed Teleport, Vault and identity helpers when documented; do not discover
credentials by dumping environment files or provision another access mechanism.
Keep secret-bearing responses in a local process and publish only required fields.

## Gather bounded evidence

Start with cheap independent observations. Select actual commands from repository
runbooks and installed tool help; do not invent hostnames, health routes or labels.
Set request deadlines, log windows and result limits. Avoid load tests, broad
network scans and repeated retries during an outage.

- **Availability:** distinguish DNS, routing, TCP, TLS, HTTP and application
  failures. Record status, latency and vantage point. Use a documented safe
  health/read operation. A login redirect, public homepage or HTTP 200 alone does
  not prove the affected authenticated workflow or dependency works.
- **Certificates:** check the served leaf/chain, hostname/SAN, issuer, validity
  and trust using the intended hostname and SNI. Separate expiry from trust,
  clock and hostname errors. A decoded certificate is not proof of chain trust.
  Preserve TLS verification and use the documented internal CA where applicable.
- **Recent changes:** correlate deployment IDs, image digests, config/DNS/IAM
  changes and dependency events with the incident window. Compare the running
  release with the deployment record; the local Git HEAD is not proof of what
  runs. Temporal correlation creates a hypothesis, not a confirmed cause.
- **Logs and telemetry:** narrow by service, environment, time and request or
  trace ID. Correlate errors, rate, latency, saturation and dependency failures.
  Include restart/OOM and resource events when the runtime warrants it. Redact
  tokens, cookies, authorization headers, personal data and connection strings.

If monitoring or remote access fails, record that visibility gap separately from
service health. A failed diagnostic command does not prove the service is down.
Use a small bounded sample and expand only when it can distinguish hypotheses.

## Report and hand off

Lead with impact, current status and observation time. Then provide:

- Verified facts with timestamps, environment and evidence pointers or sanitized
  command summaries; include observations that rule out likely explanations.
- Ranked hypotheses, each with supporting and conflicting evidence and the next
  specific check that would confirm or reject it. State uncertainty explicitly.
- Next checks in priority order, their expected outcomes and any missing access.
  Separate read-only diagnostics from proposed changes and their blast radius.

Stop when the requested diagnosis is supported or further progress needs missing
access or an unapproved mutation. If remediation is already authorized, honor its
scope, verify the affected operation afterwards and preserve the incident timeline.
Do not announce recovery on one successful probe or invent a recovery window.

Example: `$incident-triage` for a service returning 502 after a release should
check the exact ingress route, backend readiness, running revision and correlated
logs before attributing the failure to that release.
