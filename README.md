<div align="center">
  <img src="icons/perspective.svg" alt="Perspective" width="96" height="96" />

# n8n-nodes-perspective

**[n8n](https://n8n.io) community node for [Perspective.co](https://www.perspective.co) — Funnels, CRM, metrics, and webhooks**

[![npm version](https://img.shields.io/npm/v/n8n-nodes-perspective.svg)](https://www.npmjs.com/package/n8n-nodes-perspective)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-perspective.svg)](https://www.npmjs.com/package/n8n-nodes-perspective)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)
[![n8n community node](https://img.shields.io/badge/n8n-community%20node-FF6D5A.svg)](https://docs.n8n.io/integrations/community-nodes/)

</div>

---

[Perspective](https://www.perspective.co) is a mobile-first, no-code funnel builder for lead generation and sales. This package brings the **full Perspective External API** (CRM, metrics, workspaces) and the **outgoing webhooks** (new lead, funnel completed) directly into your n8n workflows.

## ✨ Features

- 🎯 **Action node** — paginated CRM, metrics & workspaces via the official REST API
- ⚡ **Webhook Trigger** — receive new leads and funnel completions in real time, no API key required
- 🔁 **Polling Trigger** — schedule-based fetch of new contacts, fully automatic per-funnel selection
- 🔍 **Funnel resource locator** — searchable dropdown of all your funnels, auto-loaded from `/v1/workspaces`
- 🤖 **AI-tool ready** — the action node is `usableAsTool: true`, so AI agents can call Perspective directly
- 🛡️ **API-key auth** — `x-perspective-api-key` header, validated against `/v1/workspaces` on save
- 📦 **Zero runtime dependencies** — no npm bloat in your n8n install

## Table of contents

- [Installation](#installation)
- [Operations](#operations)
- [Webhook Trigger](#webhook-trigger)
- [Polling Trigger](#polling-trigger)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Resources](#resources)
- [Version history](#version-history)

## Installation

In n8n, go to **Settings → Community Nodes → Install** and enter:

```
n8n-nodes-perspective
```

Or follow the [community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) for self-hosted installs:

```bash
npm install n8n-nodes-perspective
```

## Operations

The **Perspective** action node supports three resources.

### 👥 Contact (CRM)

| Operation | Endpoint | Notes |
|---|---|---|
| Get Many | `GET /v1/funnels/{funnelId}/contacts` | Paginated (1–100 per page, 0-based), sortable by `ps_converted_at`, `email`, `firstName`, `lastName` |
| Get | `GET /v1/funnels/{funnelId}/contacts/{contactId}` | Single contact lookup |
| Create | `POST /v1/funnels/{funnelId}/contacts` | At least `email` or `phone` required. Optional: `firstName`, `lastName`, `website`, `birthday`, `address`, `skipAutomationTrigger` |
| Update Field | `PUT /v1/funnels/{funnelId}/contacts/{contactId}/values` | Set a single field by name (standard, address subfield, or any custom property) |

### 📊 Metric

| Operation | Endpoint | Notes |
|---|---|---|
| Get KPI | `GET /v1/funnels/{funnelId}/metrics/kpis/{subtype}` | 9 KPIs: conversion rate, completion rate, new contacts, total sessions, time on page, time to completion, message stats |
| Get Chart | `GET /v1/funnels/{funnelId}/metrics/charts/{subtype}` | 7 charts: contacts over time, page-to-page conversion, activity by daytime, devices, top UTM sources, time on page, button clicks. A/B test filter for page-to-page conversion |
| Get Insight | `GET /v1/funnels/{funnelId}/metrics/insights/{insightId}` | Survey responses & feedback per insight block (e.g. `question_1234`) |

All metric operations take a `from` / `to` ISO 8601 date range and an optional timezone offset (minutes).

### 🏢 Workspace

| Operation | Endpoint |
|---|---|
| Get Many | `GET /v1/workspaces` — list all workspaces and their funnels |

## Webhook Trigger

The **Perspective Trigger** node receives outgoing webhooks from Perspective. Two events fire:

- **New Lead** — when a visitor submits the funnel with a completed `email` or `phone` field
- **Funnel Completed** — when a visitor reaches the final or any result page

### Setup

1. Add a *Perspective Trigger* node to your workflow and activate the workflow.
2. Copy the production webhook URL from the trigger node.
3. In Perspective, open the funnel → **Settings → Webhooks** and add the URL for the desired event (New Lead and/or Funnel Completed). You can configure up to 3 webhooks per event.
4. Submit a test lead in Perspective → the workflow fires with the lead payload.

### Payload shape

```jsonc
{
  "id": "contact-id",
  "funnelName": "My Lead Magnet",
  "meta": {
    "createdAt": "2026-05-07T14:32:11.000Z",
    "lastSeenAt": "2026-05-07T14:35:42.000Z",
    "completedAt": "2026-05-07T14:35:42.000Z",
    "convertedAt": "2026-05-07T14:34:08.000Z",
    "globalId": "global-contact-id"
  },
  "profile": {
    "email":      { "value": "ada@example.com",  "title": "Email" },
    "firstName":  { "value": "Ada",               "title": "First Name" },
    "phone":      { "value": "+49 …",             "title": "Phone" },
    "quiz_q1":    { "value": "Option 2",          "title": "How did you hear about us?" }
  }
}
```

> The trigger does **not** require an API key — webhook URLs are the secret. Keep your workflow URL private.

## Polling Trigger

The **Perspective Polling Trigger** node fetches new contacts on a schedule — no manual webhook setup in Perspective required. Just pick a funnel, set the polling interval, and the node emits new items each tick.

### Setup

1. Add a *Perspective Polling Trigger* to your workflow.
2. Pick the funnel from the searchable dropdown (loaded via `/v1/workspaces`).
3. Choose the event:
   - **New Converted Lead** *(default)* — watermark on `meta.ps_converted_at`. Fires only when contacts submit email/phone.
   - **New Contact** — watermark on `meta.ps_first_seen_at`. Fires for any visitor that lands and gets tracked.
4. Set the polling schedule (every minute, hour, custom cron).
5. Activate the workflow.

### How it works

- On every tick, the node calls `GET /v1/funnels/{funnelId}/contacts?sortField=ps_converted_at&sortOrder=-1&limit=100`.
- The first poll establishes the watermark and emits nothing — this prevents flooding the workflow with historical leads on activation.
- Subsequent polls emit only contacts whose watermark timestamp is **newer** than the last seen value, sorted oldest → newest.
- Watermark is stored per-workflow-node via `staticData` and survives restarts.

### When to use which trigger

| Scenario | Recommended trigger |
|---|---|
| You're on the Free / Starter plan (no API key) | **Webhook Trigger** |
| You want true real-time delivery | **Webhook Trigger** |
| You want fully automatic setup, no Perspective dashboard touching | **Polling Trigger** |
| You need historical contacts on workflow activation | Use **Action node** with a Schedule trigger |

> The Polling Trigger requires an API key (Scale Plan / legacy Volume Plan). Each poll counts against your API quota.

## Credentials

The action node requires a **Perspective API** credential.

1. In Perspective, go to **Account Settings → API** ([app.perspective.co/en/settings](https://app.perspective.co/en/settings)). Only admins can create keys.
2. Create an API key (it is shown only once — save it immediately).
3. In n8n, create a new *Perspective API* credential and paste the key. n8n verifies it by calling `GET /v1/workspaces`.

The API is available from the **Scale Plan** (or legacy Volume Plan) onwards. The trigger node works on all plans.

## Compatibility

- Tested against n8n `2.x`
- Requires Node.js ≥ 22 for local development and build
- No external runtime dependencies

## Resources

- 📘 [Perspective External API documentation (Swagger)](https://perspective-api.co/api-docs/)
- 📝 [What can I do with the API App in Perspective?](https://intercom.help/perspective-funnels/en/articles/12381478-what-can-i-do-with-the-api-app-in-perspective)
- 🔔 [How do I use webhooks for my funnel?](https://intercom.help/perspective-funnels/en/articles/5199389-how-do-i-use-webhooks-for-my-funnel)
- 📚 [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## Version history

### 0.1.0

- Initial release: action node (Contact CRUD, Metrics KPI/Chart/Insight, Workspaces) + webhook trigger (New Lead, Funnel Completed) + polling trigger (New Converted Lead, New Contact)

## License

[MIT](LICENSE.md) © Tim Querengässer
