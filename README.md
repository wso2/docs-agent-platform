# docs-agent-platform
Source repository for WSO2 Agent Manager Platform documentation

## Requirements

- Node.js 20.19.0 or later. The `open` and `flat` overrides resolve to ESM-only packages that Docusaurus and `webpack-merge` load with `require()`, which Node.js supports by default from 20.19.0.

## Dependency overrides

`package.json` uses npm `overrides` to pin patched versions of transitive dependencies. Two of them need explicit notes:

- **`mermaid` → `katex` (`>=0.18.2 <0.18.5`)**: KaTeX 0.18.5 and later pull in a CLI dependency that requires Node.js 22.12 or newer, while this site supports Node.js 20.19 or later. Remove the upper bound once the minimum Node.js version is raised to 22.12 or later.
- **`docusaurus-lunr-search` → `parse5` (`^6.0.1`)**: the global `parse5` override targets 8.x, but the `rehype-parse@7` used by `docusaurus-lunr-search` imports parse5 6 internals, so it stays on 6.x.
