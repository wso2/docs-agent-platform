# Docs Writing Quality Review

Review an `.mdx` page for writing quality, voice consistency, product terminology, and AI-writing patterns. Report every issue with the exact quote, its line number, and a suggested rewrite; never fix silently unless the user asks you to apply fixes. Structure is `check.md`'s job; technical accuracy is `tech.md`'s.

## Usage

Read when the user asks to review, polish, or fix the writing or tone of a page, or to make it sound less AI-generated. `edit.md` and `new-page.md` also read this file before drafting. If no path is given, ask which file.

**Scope on existing pages**: many older pages predate these rules. When reviewing a diff, apply the rules to changed lines only (see `review.md` → Diff mode). When reviewing a whole page, report pre-existing issues but group them under "Pre-existing (not blocking)".

**Vale**: a pull request's added lines also get Vale suggestions in CI (`.github/workflows/vale.yml`, rules in `.github/styles/AgentManager/`). Vale covers a lenient subset of this file, such as registry-project wording, a few terms, condescending words, and sentences over 40 words, so this review still applies in full. If `vale` is installed, run `vale <path>` and include its findings. When a rule here can be matched by a pattern without many false positives, add it as a Vale rule at `suggestion` level.

## Step 1: Identify the page type

This site has no `docType` field. Infer the type from the folder, then confirm it from structure:

| Folder | Type | Shape |
|---|---|---|
| `docs/concepts/` | concept | Explains what something is and how it relates to other concepts. No step instructions. |
| `docs/guides/` | guide | A task: prerequisites, then `## Step N:` sections with numbered actions. |
| `docs/tutorials/` | tutorial | End-to-end path, often on a sample agent. |
| `docs/reference/` | reference | Tables and exact facts. No narrative. |
| `docs/get-started/` | get-started | Overview or quick start. Treat quick starts as guides. |

State the type before running checks. If the content does not match its folder (a concept page full of click-by-click steps), flag it.

## Step 2: Calibrate against sibling pages

Read two or three pages of the same type, preferably from the same sidebar category, and compare sentence rhythm, how sections open, how steps are phrased, and density of tables and admonitions. Flag concrete deviations by quoting the target next to a sibling phrase. "The tone feels off" is not a finding.

## Step 3: Universal checks

### Product terminology

Use these terms consistently. They match the Console and the majority of existing pages.

| Use | Avoid in prose |
|---|---|
| WSO2 Agent Manager (first mention on a page), then Agent Manager | "the AMP", "Agent Management Platform" in new prose. Keep `AMP` only in identifiers (`amp-instrumentation`), chart names, and exact UI labels. |
| the Console (capitalized) | the console, the UI, the portal, the dashboard |
| platform-hosted agent / externally-hosted agent (Title Case only in headings and UI labels) | internal agent, external agent (except where the UI or a heading uses those words), hosted agent |
| organization, project, environment (lowercase in prose) | org, proj, env (outside code) |
| LLM Service Provider, MCP Proxy, AI Gateway (as named resources in the Console) | LLM provider, MCP server proxy, API gateway (for these resources) |
| deployment pipeline | promotion pipeline |
| `amctl` (in code format) | amctl, AMCTL, the CLI tool |
| API key | api key, API-key |
| sign in / sign out (verbs), sign-in (noun) | log in, login (verb), log out |
| configure, set up (verb), setup (noun) | setup (as a verb) |
| select (dropdowns, options) | choose, pick |
| click (buttons), enter (text fields) | press, hit, type in |
| create / delete (Console resources) | add / remove, unless the UI label says "Add" or "Remove" |

When the Console label differs from this table, the Console label wins inside **bold** UI references. Check the literal string in `console/workspaces/pages/**` of the source repo (`source.md`).

Define an acronym at first use on each page unless it is universal for the audience (API, URL, LLM, MCP, JWT, OAuth are fine undefined; OTel, IdP, RBAC need the full form first).

### Voice

- **Active voice** for instructions. ❌ "The endpoint can be added by clicking..." → ✅ "Click **Add Endpoint**."
- **Second person**, never labels for the reader. ❌ "Administrators can configure..." → ✅ "Configure..." (state the required role in Prerequisites instead).
- **No condescension**: cut "simply", "just", "easily", "all you need to do is", "straightforward".
- **No hedging in instructions**: "You may want to run..." → "Run...", unless the step is genuinely optional (then say "Optional:").
- **One action per numbered step** where the actions are on different controls. ❌ "Click **Create**, fill in the name and select a type." → ✅ three steps, or "Enter a **Name**, then select a **Type**."

### Formatting

- **Bold** for UI labels exactly as shown: buttons, tabs, fields, menu items.
- `Inline code` for commands, flags, file paths, config keys and values, env vars, endpoint paths, resource names the reader types, and port numbers.
- No quotation marks around UI labels or code values.
- Navigation paths use `→` between bold labels: **Settings** → **Gateways**.
- Numbers: spell out one to nine in prose; numerals for 10+, versions, ports, sizes, durations, and counts of things the reader configures ("3 replicas", "port 8080", "8 GB").
- US spelling (organization, color, license, canceled).
- No contractions in new text ("do not", "it is"). Do not flag untouched lines on older pages.

### Punctuation

- Avoid em dashes (—) and en dashes (–) in new or rewritten sentences; use a period, comma, colon, or parentheses. Existing pages use them heavily, so flag them only on changed lines, as a warning. Ranges in prose use "to" ("5 to 10 minutes").
- Serial comma before the final "and"/"or".
- A colon introduces a list only when the text before it is a complete sentence. ❌ "The roles are: admin, developer." → ✅ "Agent Manager defines two roles: admin and developer."

### Filler and AI vocabulary

Cut or replace in prose (outside code):

- **AI vocabulary**: additionally, align with, crucial, delve, enhance, foster, garner, highlight (verb), intricate, key (as filler), landscape, leverage, navigate (abstract, not UI), pivotal, robust, showcase, tapestry, testament, underscore (verb), vibrant, seamless(ly), empower, powerful, comprehensive, streamline, cutting-edge, game-changer, holistic, unlock, out-of-the-box (as filler), effortless.
- **Filler phrases**: "in order to" → "to"; "it is important to note that" → state the point; "please note that" → cut; "has the ability to" → "can"; "essentially", "basically" → cut; "allows you to" / "enables you to" → describe the behavior or use the imperative.
- **Superficial -ing tails**: "..., allowing you to monitor agents efficiently." → cut, or make it its own sentence with real content.
- **Over-explaining**: "Click the **Save** button to save your changes." → "Click **Save**."

**Hard gate**: 5 or more AI-vocabulary occurrences on changed lines (or on a new page).

### Rhetorical scaffolding

Flag every templated pivot: "Here's where it gets interesting", "But here's the thing", "At its core", "This is where it all comes together", "The bottom line:", "That's not the whole story". Replace with the specific concept under discussion.

Flag symmetric contrast framing: "It's not X. It's Y." One per page is tolerable; two or more is a hard gate.

Flag a list (prerequisites, options) spelled out in full a second time on the same page; refer back to it instead.

**Hard gate**: any templated pivot, or 2 or more symmetric contrasts.

### Structural AI patterns

- 4 or more consecutive sentences of near-identical length → flag; vary them.
- 3 or more consecutive sections with an identical internal template (definition → explanation → example) → flag.
- Paragraphs opening with "Furthermore,", "Moreover,", "Additionally,", "In addition to this," → cut and connect to the previous paragraph's specific content.

### Specificity

- **Interchangeability test**: could a section's first paragraph appear unchanged in another product's docs? If so, it needs something specific to Agent Manager: a named resource, a scope (organization, project, environment), a concrete behavior, or a limit.
- **Promotional tone**: docs are neutral. ❌ "Agent Manager's powerful gateway makes securing agents effortless." → ✅ "The AI Gateway validates each request's API key before forwarding it to the upstream MCP server."
- **Section necessity**: flag an H2 the reader could skip without losing anything (restates the intro, generic background).

### Sentence and paragraph length

Flag prose sentences over 30 words and paragraphs over 5 sentences. Flag 3 or more consecutive very short sentences (8 words or fewer) in running prose; this is fine inside numbered steps.

### Instruction precision (guides, tutorials)

- **Ambiguous UI references**: ❌ "Open the settings." → ✅ "In the Console, navigate to **Organization Settings** → **Gateways**."
- **Missing scope**: say whether the screen is at organization, project, or environment level when it matters.
- **Vague outcomes**: say what the reader should see when it is not obvious ("The endpoint status changes to **Deployed**.").
- **Placeholders**: values the reader must replace are in `<angle-brackets>` inside code, and the text says what to put there.

### Step count and locality (not a hard gate)

- 10 or more steps in one numbered sequence: propose a restructure and ask whether the flat list or the proposal is better.
- The same screen appears, then another screen, then the first again, with no dependency: propose the regrouped order and ask.

Ask both in one message. If the user confirms the current structure, mark it passed.

### Admonitions

Use by meaning, not for variety:

| Type | When |
|---|---|
| `:::note` | Supplementary, non-blocking information |
| `:::tip` | A shortcut or best practice |
| `:::info` | Background framing, links to deeper material |
| `:::warning` / `:::caution` | Risk of misconfiguration or a confusing failure |
| `:::danger` | Destructive, irreversible, or security-critical (for example, default credentials in production) |

Flag an admonition that repeats the paragraph above it.

### Emojis

No emojis in new headings, prose, or table cells. Flag existing ones only when that line is being changed.

### Diagrams

Diagrams are fenced ` ```mermaid ` blocks. Flag ASCII art, box drawings, or screenshots of diagrams, and any `%%{init}%%` or inline `style`/`classDef` color override.

### Inclusive language

allowlist/denylist (not whitelist/blacklist); primary/replica (not master/slave); "placeholder value" (not "dummy value"); they/them for a hypothetical user.

## Step 4: Page-type checks

These override Step 3 where they conflict.

### Concept

- Opens by defining the thing and its scope, not with a task.
- No imperative instructions ("Click X", "Run Y"); link to the guide instead.
- Ends with how it relates to other concepts (`## Relationship to Other Concepts` or a related-concepts list), matching siblings.

### Guide

- Intro states the task and outcome in one or two sentences. ❌ "This guide walks you through MCP proxies." → ✅ "Register an MCP Proxy to expose an upstream MCP server to your agents through the AI Gateway."
- `## Prerequisites` comes before the first step and lists required role, installed components, and any upstream credentials.
- Step headings are `## Step N: <Imperative Verb Phrase>`.
- Ends with `## Next Steps`, `## Related`, `## Troubleshooting`, or a verification section; not "Go Further" or "What's Next?" with a question mark.
- A full parameter table belongs on a reference page; link to it instead of embedding it.

### Tutorial

- States what the reader will build and what they need before starting.
- Every step produces a visible result the reader can check.
- Ends with `## What's Next` or `## See Also`.

### Reference

- Tables over prose. No second person ("Set to `true` to enable caching.", not "You can set this to `true`").
- No "you need to" / "you should".
- No closing section required.

## Hard gates

The review FAILS only on these:

1. 5 or more AI-vocabulary occurrences (changed lines, or the whole page if new).
2. Any templated rhetorical pivot.
3. 2 or more symmetric contrast constructions.

Every other finding should be fixed before merge but does not fail the review.

## Output format

Group findings by category and omit categories with no findings. Per finding: line number, quote, what is wrong in one line, and a rewrite (or `[needs writer input]`).

```text
Reviewing: docs/guides/register-mcp-proxy.mdx
Page type: guide
Siblings read: register-llm-service-provider.mdx, configure-agent-mcp-proxies.mdx

TERMINOLOGY
  ❌  line 14: "the console" → "the Console"

VOICE
  ❌  line 31: "The endpoint can be added by..." → "Click **Add Endpoint**."

AI VOCABULARY
  ❌  line 9: "seamlessly" → cut

GUIDE: INTRO
  ✅  states task and outcome

PRE-EXISTING (NOT BLOCKING)
  ⚠️   lines 22, 40: em dashes

─────────────────────────────────────
Result: PASS
Hard gates: 0
Issues: 3 to fix · 1 pre-existing
```
