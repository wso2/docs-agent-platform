# docs-agent-platform
Source repository for WSO2 Agent Manager Platform documentation

## Dependency overrides

`package.json` uses npm `overrides` to pin patched versions of transitive dependencies. One of them is a deliberate cap:

- **`mermaid` → `katex` (`>=0.18.2 <0.18.5`)**: KaTeX 0.18.5 and later pull in a CLI dependency that requires Node.js 22.12 or newer, while this site supports Node.js 20. Remove the upper bound once the minimum Node.js version is raised to 22.12 or later.
