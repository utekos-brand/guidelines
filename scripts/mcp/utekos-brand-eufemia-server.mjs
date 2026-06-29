#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createHash, randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod/v4";

const repoRoot = path.resolve(process.env.UTEKOS_BRAND_REPO_ROOT ?? process.cwd());
const profile = "utekos_brand_chatgpt_eufemia";
const mode = "read-only-design-system-insight";

const allowedRoots = [
  "AGENTS.md",
  "README.md",
  "docs/",
  "styles/",
  "src/app/",
  "src/config/",
  "components/brand/",
  "components/ui/",
  "config/brand-themes.ts",
  "config/mcp/chatgpt-profiles.json",
  "lib/brand/",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "scripts/mcp/",
  "tsconfig.json",
  "node_modules/@modelcontextprotocol/sdk/package.json",
  "node_modules/@dnb/eufemia/",
];

const deniedPathPatterns = [
  ".env",
  ".env.",
  ".git/",
  ".next/",
  ".vercel/",
  ".agent-artifacts/",
  ".playwright-mcp/",
  ".cursor/mcp.json",
  ".vscode/mcp.json",
  "mcp.json",
  "node_modules/",
];

const allowedNodeModulesPaths = new Set(["node_modules/@modelcontextprotocol/sdk/package.json"]);

const allowedNodeModulesPrefixes = ["node_modules/@dnb/eufemia/"];

const textExtensions = new Set([
  ".css",
  ".d.ts",
  ".js",
  ".json",
  ".md",
  ".mdx",
  ".mjs",
  ".scss",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const canonicalTools = [
  {
    name: "brand_eufemia_bootstrap",
    title: "Brand Eufemia Bootstrap",
    purpose:
      "Use this first. Returns the operating mode, allowed source roots, golden path, and canonical tools for Utekos brand/Eufemia work.",
  },
  {
    name: "connector_surface_audit",
    title: "Connector Surface Audit",
    purpose:
      "Use this when ChatGPT shows stale, generic, or missing tools. It reports expected connector metadata and remediation steps.",
  },
  {
    name: "tool_inventory",
    title: "Tool Inventory",
    purpose:
      "Use this to inspect the canonical read-only tool surface, metadata policy, and forbidden tool families.",
  },
  {
    name: "search_exact_identifier",
    title: "Search Exact Identifier",
    purpose:
      "Use this for exact CSS variables, prop names, exports, filenames, and token identifiers.",
  },
  {
    name: "source_search",
    title: "Source Search",
    purpose:
      "Use this for scoped literal or regex search across local docs, Eufemia package files, and brand source snapshots.",
  },
  {
    name: "source_read",
    title: "Source Read",
    purpose:
      "Use this to read explicit source files after locating them. Secret paths and generic node_modules are denied.",
  },
  {
    name: "repo_tree",
    title: "Repo Tree",
    purpose: "Use this to map allowed source roots before deeper reads.",
  },
  {
    name: "package_manifest",
    title: "Package Manifest",
    purpose: "Use this to inspect the project or installed @dnb/eufemia package manifest.",
  },
  {
    name: "exports_map",
    title: "Exports Map",
    purpose:
      "Use this to resolve package entrypoints, side effects, style entrypoints, and package exports.",
  },
  {
    name: "component_source",
    title: "Component Source",
    purpose:
      "Use this to locate Eufemia component runtime files, docs snapshots, barrels, and declaration files.",
  },
  {
    name: "component_style",
    title: "Component Style",
    purpose: "Use this to locate Eufemia component SCSS/CSS style files.",
  },
  {
    name: "component_tests",
    title: "Component Tests",
    purpose:
      "Use this to locate local snapshot tests and visual regression artifacts for a component when present.",
  },
  {
    name: "token_inventory",
    title: "Token Inventory",
    purpose:
      "Use this to return structured CSS token definitions from local themes and installed Eufemia theme files.",
  },
  {
    name: "token_resolve",
    title: "Token Resolve",
    purpose:
      "Use this to resolve one token/CSS variable across local theme files, Eufemia package files, and docs snapshots.",
  },
  {
    name: "css_variable_inventory",
    title: "CSS Variable Inventory",
    purpose: "Use this to list CSS custom properties with file and line provenance.",
  },
  {
    name: "version_context",
    title: "Version Context",
    purpose:
      "Use this to compare project package versions, installed @dnb/eufemia version, MCP SDK version, and git state.",
  },
  {
    name: "changelog_diff",
    title: "Changelog Diff",
    purpose: "Use this to inspect installed @dnb/eufemia changelog sections for a version window.",
  },
  {
    name: "figma_token_export_read",
    title: "Figma Token Export Read",
    purpose:
      "Use this to inspect the local Figma token export snapshot when token decisions depend on it.",
  },
];

const toolAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

const sourceSchema = z.object({
  path: z.string(),
  sha256: z.string().optional(),
  size_bytes: z.number().int().nonnegative().optional(),
  line_count: z.number().int().nonnegative().optional(),
  truncated: z.boolean().optional(),
});

const errorSchema = z.object({
  code: z.string(),
  message: z.string(),
  category: z.string(),
  retryable: z.boolean(),
  safe_to_retry: z.boolean(),
  user_action_required: z.boolean(),
  suggested_fix: z.string(),
  details_redacted: z.boolean(),
});

const permissionsSchema = z.object({
  read_only: z.boolean(),
  allowed_roots: z.array(z.string()),
  denied_patterns: z.array(z.string()),
});

function envelopeSchema(toolName) {
  return z.object({
    ok: z.boolean(),
    tool: z.literal(toolName),
    profile: z.literal(profile),
    mode: z.literal(mode),
    request_id: z.string(),
    started_at: z.string(),
    finished_at: z.string(),
    duration_ms: z.number().nonnegative(),
    data: z.record(z.string(), z.unknown()),
    sources: z.array(sourceSchema),
    warnings: z.array(z.string()),
    errors: z.array(errorSchema),
    limits: z.record(z.string(), z.unknown()),
    permissions: permissionsSchema,
    next: z.array(z.string()),
  });
}

function nowIso() {
  return new Date().toISOString();
}

function auditToolCall(toolName) {
  console.error(
    JSON.stringify({
      time: nowIso(),
      level: "INFO",
      msg: "utekos_brand_eufemia_tool_call",
      profile,
      mode,
      tool: toolName,
    }),
  );
}

function permissions() {
  return {
    read_only: true,
    allowed_roots: allowedRoots,
    denied_patterns: deniedPathPatterns,
  };
}

function makeError(code, message, suggestedFix, category = "tool_execution") {
  return {
    code,
    message,
    category,
    retryable: false,
    safe_to_retry: true,
    user_action_required: false,
    suggested_fix: suggestedFix,
    details_redacted: true,
  };
}

function cleanJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function createEnvelope(toolName, startedAt, data, options = {}) {
  const finishedAt = nowIso();
  return cleanJson({
    ok: options.ok ?? true,
    tool: toolName,
    profile,
    mode,
    request_id: options.requestId ?? randomUUID(),
    started_at: startedAt,
    finished_at: finishedAt,
    duration_ms: Math.max(0, Date.parse(finishedAt) - Date.parse(startedAt)),
    data,
    sources: options.sources ?? [],
    warnings: options.warnings ?? [],
    errors: options.errors ?? [],
    limits: options.limits ?? {},
    permissions: permissions(),
    next: options.next ?? [],
  });
}

function textResult(envelope) {
  return {
    content: [{ type: "text", text: JSON.stringify(envelope, null, 2) }],
    structuredContent: envelope,
  };
}

function relativePath(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function normalizeRelative(value) {
  const cleaned = String(value ?? "")
    .trim()
    .replaceAll("\\", "/");
  if (!cleaned || cleaned.includes("\0")) throw new Error("Path is empty or invalid");
  const resolved = path.resolve(repoRoot, cleaned);
  const relative = relativePath(resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Path escapes repo root: ${cleaned}`);
  }
  return relative;
}

function hasAllowedNodeModulesPrefix(relative) {
  if (allowedNodeModulesPaths.has(relative)) return true;
  return allowedNodeModulesPrefixes.some(
    (prefix) => relative === prefix.slice(0, -1) || relative.startsWith(prefix),
  );
}

function isDenied(relative) {
  const normalized = `${relative}${relative.endsWith("/") ? "" : ""}`;
  if (hasAllowedNodeModulesPrefix(normalized)) return false;

  return deniedPathPatterns.some((pattern) => {
    if (pattern.endsWith("/"))
      return normalized === pattern.slice(0, -1) || normalized.startsWith(pattern);
    if (pattern.endsWith("."))
      return normalized === pattern.slice(0, -1) || normalized.startsWith(pattern);
    return normalized === pattern || normalized.startsWith(`${pattern}/`);
  });
}

function isAllowed(relative) {
  if (isDenied(relative)) return false;
  return allowedRoots.some((root) => {
    if (root.endsWith("/")) return relative === root.slice(0, -1) || relative.startsWith(root);
    return relative === root;
  });
}

function resolveProjectPath(inputPath) {
  const relative = normalizeRelative(inputPath);
  if (!isAllowed(relative)) {
    throw new Error(
      `Path is outside allowed Utekos Brand MCP roots or denied by policy: ${relative}`,
    );
  }
  return { absolute: path.join(repoRoot, relative), relative };
}

function hashBuffer(value) {
  return createHash("sha256").update(value).digest("hex");
}

function lineCount(text) {
  return text.length === 0 ? 0 : text.split("\n").length;
}

function readTextFile(relative, maxBytes = 60000) {
  const resolved = resolveProjectPath(relative);
  const stat = fs.statSync(resolved.absolute);
  if (!stat.isFile()) throw new Error(`Not a file: ${resolved.relative}`);

  const ext = path.extname(resolved.relative).toLowerCase();
  if (ext && !textExtensions.has(ext)) throw new Error(`Unsupported text file extension: ${ext}`);

  const buffer = fs.readFileSync(resolved.absolute);
  const truncated = buffer.byteLength > maxBytes;
  const content = buffer.subarray(0, maxBytes).toString("utf8");

  return {
    path: resolved.relative,
    content,
    sha256: hashBuffer(buffer),
    size_bytes: buffer.byteLength,
    line_count: lineCount(content),
    truncated,
  };
}

function fileSource(file) {
  return {
    path: file.path,
    sha256: file.sha256,
    size_bytes: file.size_bytes,
    line_count: file.line_count,
    truncated: file.truncated,
  };
}

function safeReadJson(relative, fallback = {}) {
  try {
    return JSON.parse(readTextFile(relative, 300000).content);
  } catch {
    return fallback;
  }
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: options.timeout ?? 30000,
  });
}

function outputLines(result) {
  return (result.stdout ?? "").split("\n").filter(Boolean);
}

function safeStat(relative) {
  try {
    const resolved = resolveProjectPath(relative);
    const stat = fs.statSync(resolved.absolute);
    return {
      path: resolved.relative,
      exists: true,
      type: stat.isDirectory() ? "directory" : "file",
      size_bytes: stat.size,
      mtime: stat.mtime.toISOString(),
    };
  } catch {
    return {
      path: relative,
      exists: false,
    };
  }
}

function toKebab(value) {
  return String(value)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function toPascal(value) {
  return String(value)
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function listFilesRecursive(relativeRoot, options = {}) {
  const maxDepth = options.maxDepth ?? 3;
  const limit = options.limit ?? 250;
  const includeDirs = options.includeDirs ?? true;
  const files = [];
  const warnings = [];

  function walk(relative, depth) {
    if (files.length >= limit) return;
    if (!isAllowed(relative)) return;

    let resolved;
    try {
      resolved = resolveProjectPath(relative);
    } catch (error) {
      warnings.push(`${relative}: ${error instanceof Error ? error.message : String(error)}`);
      return;
    }

    let entries;
    try {
      entries = fs.readdirSync(resolved.absolute, { withFileTypes: true });
    } catch (error) {
      warnings.push(`${relative}: ${error instanceof Error ? error.message : String(error)}`);
      return;
    }

    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (files.length >= limit) break;
      const child = `${resolved.relative.replace(/\/$/, "")}/${entry.name}`.replace(/^\.\//, "");
      if (isDenied(child) || !isAllowed(child)) continue;
      const childPath = path.join(repoRoot, child);
      const stat = fs.statSync(childPath);
      const type = entry.isDirectory() ? "directory" : "file";
      if (type === "file" || includeDirs) {
        files.push({
          path: child,
          type,
          size_bytes: stat.size,
        });
      }
      if (entry.isDirectory() && depth < maxDepth) walk(child, depth + 1);
    }
  }

  walk(normalizeRelative(relativeRoot), 0);
  return { files, warnings, truncated: files.length >= limit };
}

function rgSearch({ query, roots, mode: searchMode, limit, fileGlobs }) {
  const args = [
    "--line-number",
    "--color=never",
    "--hidden",
    "--follow",
    "--glob",
    "!.git/**",
    "--glob",
    "!.next/**",
    "--glob",
    "!.env*",
    "--glob",
    "!mcp.json",
    "--glob",
    "!.cursor/mcp.json",
    "--glob",
    "!.vscode/mcp.json",
  ];

  for (const glob of fileGlobs ?? []) args.push("--glob", glob);
  if (searchMode !== "regex") args.push("--fixed-strings");
  args.push(query);
  args.push(...roots.map((root) => path.join(repoRoot, root)));

  const result = run("rg", args, { timeout: 30000 });
  const matches = [];
  for (const line of outputLines(result)) {
    if (matches.length >= limit) break;
    const match = line.match(/^(.*?):(\d+):(.*)$/);
    if (!match) continue;
    const relative = relativePath(path.resolve(match[1]));
    if (!isAllowed(relative)) continue;
    matches.push({
      path: relative,
      line: Number(match[2]),
      text: match[3].slice(0, 700),
    });
  }

  const warnings = [];
  if (result.status === 1) warnings.push("No matches found.");
  if (result.status && result.status !== 0 && result.status !== 1) {
    warnings.push(result.stderr.trim() || `rg exited with status ${result.status}`);
  }

  return { matches, warnings };
}

function defaultSearchRoots() {
  return [
    "docs",
    "styles",
    "src/app",
    "src/config",
    "components/brand",
    "components/ui",
    "lib/brand",
    "node_modules/@dnb/eufemia",
  ].filter((root) => fs.existsSync(path.join(repoRoot, root)));
}

function sanitizeRoots(inputRoots) {
  const roots = inputRoots?.length ? inputRoots : defaultSearchRoots();
  return roots.map((root) => normalizeRelative(root)).filter(isAllowed);
}

function componentCandidateFiles(componentName) {
  const kebab = toKebab(componentName);
  const pascal = toPascal(componentName);
  const roots = [
    {
      source: "local-docs-snapshot",
      root: `docs/mcp/dnb/UI-Components/${kebab}`,
    },
    {
      source: "local-docs-snapshot",
      root: `docs/mcp/dnb/UI-Components/${pascal}.ts`,
    },
    {
      source: "installed-eufemia-package",
      root: `node_modules/@dnb/eufemia/components/${kebab}`,
    },
    {
      source: "installed-eufemia-package",
      root: `node_modules/@dnb/eufemia/components/${pascal}.js`,
    },
    {
      source: "installed-eufemia-package",
      root: `node_modules/@dnb/eufemia/components/${pascal}.d.ts`,
    },
  ];

  const files = [];
  for (const candidate of roots) {
    const absolute = path.join(repoRoot, candidate.root);
    if (!fs.existsSync(absolute)) continue;
    const stat = fs.statSync(absolute);
    if (stat.isFile()) {
      files.push(classifyComponentFile(candidate.root, candidate.source));
      continue;
    }

    const tree = listFilesRecursive(candidate.root, {
      maxDepth: 5,
      limit: 400,
      includeDirs: false,
    });
    for (const file of tree.files) {
      files.push(classifyComponentFile(file.path, candidate.source));
    }
  }

  return files.sort((a, b) => a.path.localeCompare(b.path));
}

function classifyComponentFile(relative, source) {
  const lower = relative.toLowerCase();
  let role = "source";
  if (lower.includes("__tests__") || lower.includes(".test.") || lower.includes("screenshot"))
    role = "test";
  if (
    lower.includes("/style/") ||
    lower.endsWith("/style.ts") ||
    lower.endsWith(".scss") ||
    lower.endsWith(".css")
  )
    role = "style";
  if (lower.includes("docs")) role = "docs";
  const stat = safeStat(relative);
  return {
    path: relative,
    role,
    source,
    exists: stat.exists,
    size_bytes: stat.size_bytes,
  };
}

function cssTokenFiles(theme = "dnb") {
  const normalized = String(theme ?? "dnb").toLowerCase();
  const files = ["styles/tokens/palette.css", "styles/tokens/semantic-map.css"];

  if (normalized === "all") {
    for (const name of ["dnb", "havdyp", "utekos", "vy"]) files.push(`styles/themes/${name}.css`);
  } else {
    files.push(`styles/themes/${normalized}.css`);
  }

  if (normalized === "dnb" || normalized === "all") {
    files.push(
      "src/app/(brand)/themes/dnb/utils/properties.ts",
      "node_modules/@dnb/eufemia/style/themes/ui/properties.css",
      "node_modules/@dnb/eufemia/style/themes/ui/properties.scss",
      "node_modules/@dnb/eufemia/style/themes/ui/properties.js",
      "node_modules/@dnb/eufemia/style/themes/ui/tokens.scss",
      "node_modules/@dnb/eufemia/style/themes/ui/tokens-dark.scss",
      "node_modules/@dnb/eufemia/style/themes/ui/properties-tailwind.css",
      "node_modules/@dnb/eufemia/style/themes/ui/tokens-dark-tailwind.css",
    );
  }

  return [...new Set(files)].filter(
    (file) => fs.existsSync(path.join(repoRoot, file)) && isAllowed(file),
  );
}

function extractCssVariables(file, maxTokens = 500) {
  const read = readTextFile(file, 1000000);
  const lines = read.content.split("\n");
  const tokens = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const regex = /(--[A-Za-z0-9_-]+)\s*:\s*([^;]+);/g;
    let match;
    while ((match = regex.exec(line)) && tokens.length < maxTokens) {
      tokens.push({
        name: match[1],
        value: match[2].trim(),
        path: file,
        line: index + 1,
      });
    }
  }
  return { file: read, tokens };
}

function packagePath(packageName) {
  if (!packageName || packageName === "project" || packageName === "utekos-brand-guidelines")
    return "package.json";
  if (packageName === "@dnb/eufemia") return "node_modules/@dnb/eufemia/package.json";
  throw new Error(`Unsupported package for this dedicated MCP surface: ${packageName}`);
}

function toolData(tool) {
  return {
    name: tool.name,
    title: tool.title,
    purpose: tool.purpose,
    read_only: true,
    destructive: false,
    open_world: false,
    has_output_schema: true,
    has_structured_content: true,
  };
}

const server = new McpServer(
  {
    name: "utekos-brand-eufemia-insight",
    version: "1.0.0",
  },
  {
    instructions:
      "Use brand_eufemia_bootstrap first. This is a read-only Utekos Brand/Eufemia insight surface. Prefer exact identifier lookup, then source_read. Do not infer source availability: version_context distinguishes installed package files from local docs snapshots. Auth in ChatGPT can be No Authentication; the Secure MCP Tunnel owns private reachability.",
  },
);

server.registerTool(
  "brand_eufemia_bootstrap",
  {
    title: "Brand Eufemia Bootstrap",
    description:
      "Use this first in Utekos Brand/Eufemia ChatGPT sessions. Returns read-only policy, canonical workflow, source roots, and exact next tool calls.",
    inputSchema: z.object({}),
    outputSchema: envelopeSchema("brand_eufemia_bootstrap"),
    annotations: toolAnnotations,
  },
  async () => {
    const startedAt = nowIso();
    auditToolCall("brand_eufemia_bootstrap");
    return textResult(
      createEnvelope(
        "brand_eufemia_bootstrap",
        startedAt,
        {
          profile,
          mode,
          repo_root: repoRoot,
          canonical_tools: canonicalTools.map((tool) => tool.name),
          golden_path: [
            "brand_eufemia_bootstrap",
            "version_context",
            "search_exact_identifier or component_source",
            "source_read for exact files",
            "token_inventory or token_resolve for theme work",
            "connector_surface_audit if ChatGPT metadata looks stale",
          ],
          chatgpt_connector: {
            name: "Utekos Brand Eufemia Insight",
            authentication: "No Authentication in ChatGPT connector settings",
            transport: "Secure MCP Tunnel to local stdio server",
          },
          source_truth_policy:
            "Use installed @dnb/eufemia package files and local docs/mcp/dnb snapshots as evidence. If neither contains the requested source, report the gap instead of guessing.",
          sensitive_paths_denied: deniedPathPatterns,
        },
        {
          next: [
            "Call version_context to establish package and repo state.",
            "Call search_exact_identifier for the exact token, prop, export, or filename.",
            "Call source_read only after locating exact file paths.",
          ],
        },
      ),
    );
  },
);

server.registerTool(
  "connector_surface_audit",
  {
    title: "Connector Surface Audit",
    description:
      "Use this when ChatGPT shows stale, generic, missing, or unexpected tools. Returns expected metadata and remediation for this dedicated tunnel.",
    inputSchema: z.object({}),
    outputSchema: envelopeSchema("connector_surface_audit"),
    annotations: toolAnnotations,
  },
  async () => {
    const startedAt = nowIso();
    auditToolCall("connector_surface_audit");
    const profileConfig = safeReadJson("config/mcp/chatgpt-profiles.json", { profiles: [] });
    const configured = (profileConfig.profiles ?? []).find((item) => item.id === profile) ?? {};
    return textResult(
      createEnvelope(
        "connector_surface_audit",
        startedAt,
        {
          expected_surface: {
            mcp_command:
              configured.mcpCommand ??
              "node ${repoRoot}/scripts/mcp/utekos-brand-eufemia-server.mjs",
            mcp_surface: configured.mcpSurface ?? "utekos-brand-eufemia-canonical-read-only",
            tunnel_profile: configured.tunnelProfile ?? "utekos-brand-eufemia",
            health_addr: configured.healthAddr ?? "127.0.0.1:8086",
            canonical_tools: canonicalTools.map((tool) => tool.name),
            expected_tool_count: canonicalTools.length,
            chatgpt_authentication: "No Authentication",
          },
          metadata_policy: {
            output_schema_required: true,
            structured_content_required: true,
            read_only_annotations_required: true,
            canonical_tools_compliant: true,
          },
          stale_surface_indicators: [
            {
              signal: "ChatGPT shows only the hosted @dnb/eufemia docs MCP tools.",
              severity: "critical",
              meaning:
                "The app is not connected to this dedicated local Utekos Brand Eufemia tunnel.",
              remediation:
                "Start npm run mcp:tunnel:run:eufemia and create or refresh the ChatGPT app while the tunnel is running.",
            },
            {
              signal:
                "ChatGPT shows mcp-find, mcp-activate-profile, Docker catalog tools, or write-capable filesystem tools.",
              severity: "critical",
              meaning:
                "The connector metadata is stale or points at a generic MCP profile, not this canonical read-only server.",
              remediation:
                "Reconnect the app and verify brand_eufemia_bootstrap appears in the tool list.",
            },
            {
              signal: "ChatGPT warns that OutputSchema is missing.",
              severity: "warning",
              meaning:
                "Discovery did not bind to this server; all canonical tools here declare outputSchema.",
              remediation:
                "Run npm run mcp:brand-eufemia:doctor locally, then refresh connector tools in ChatGPT settings.",
            },
          ],
          chatgpt_acceptance_prompt:
            "Use the Utekos Brand Eufemia Insight app. First call brand_eufemia_bootstrap, then version_context, then search_exact_identifier for Button or --token-color-text-neutral-on-dark. Do not use built-in browsing or a generic Eufemia docs connector.",
        },
        {
          sources: [{ path: "config/mcp/chatgpt-profiles.json" }],
          next: ["Run npm run mcp:brand-eufemia:doctor if tool metadata is uncertain."],
        },
      ),
    );
  },
);

server.registerTool(
  "tool_inventory",
  {
    title: "Tool Inventory",
    description:
      "Use this to list canonical tools, purposes, and tool metadata policy for the dedicated ChatGPT connector.",
    inputSchema: z.object({}),
    outputSchema: envelopeSchema("tool_inventory"),
    annotations: toolAnnotations,
  },
  async () => {
    const startedAt = nowIso();
    auditToolCall("tool_inventory");
    return textResult(
      createEnvelope(
        "tool_inventory",
        startedAt,
        {
          canonical_tools: canonicalTools.map(toolData),
          forbidden_tool_families: [
            "write_file",
            "edit_file",
            "git_commit",
            "git_reset",
            "mcp-activate-profile",
            "generic node_modules browsing",
          ],
          metadata: {
            output_schema: "present on every tool",
            structured_content: "present on every tool response",
            annotations: toolAnnotations,
          },
        },
        {
          next: [
            "Use search_exact_identifier for symbols or component_source for component-level investigation.",
          ],
        },
      ),
    );
  },
);

server.registerTool(
  "search_exact_identifier",
  {
    title: "Search Exact Identifier",
    description:
      "Use this for exact CSS variables, Eufemia prop names, exported identifiers, filenames, and token names. This is literal search, not semantic search.",
    inputSchema: z.object({
      identifier: z
        .string()
        .min(2)
        .max(240)
        .describe("Exact identifier, token, CSS variable, export, prop, or filename."),
      roots: z
        .array(z.string())
        .max(12)
        .optional()
        .describe(
          "Optional allowed relative roots. Defaults to docs, styles, src, components, lib, and @dnb/eufemia.",
        ),
      limit: z
        .number()
        .int()
        .min(1)
        .max(200)
        .optional()
        .describe("Maximum matches. Defaults to 50."),
    }),
    outputSchema: envelopeSchema("search_exact_identifier"),
    annotations: toolAnnotations,
  },
  async ({ identifier, roots, limit }) => {
    const startedAt = nowIso();
    auditToolCall("search_exact_identifier");
    const searchedRoots = sanitizeRoots(roots);
    const maxMatches = limit ?? 50;
    const { matches, warnings } = rgSearch({
      query: identifier,
      roots: searchedRoots,
      mode: "exact",
      limit: maxMatches,
    });
    return textResult(
      createEnvelope(
        "search_exact_identifier",
        startedAt,
        {
          identifier,
          matches,
          searched_roots: searchedRoots,
        },
        {
          warnings,
          limits: { limit: maxMatches },
          next:
            matches.length > 0
              ? ["Call source_read on exact matching paths."]
              : ["Try source_search with regex mode or inspect repo_tree."],
        },
      ),
    );
  },
);

server.registerTool(
  "source_search",
  {
    title: "Source Search",
    description:
      "Use this for scoped source search across allowed Utekos Brand and Eufemia evidence roots.",
    inputSchema: z.object({
      query: z.string().min(2).max(240),
      mode: z.enum(["exact", "regex"]).optional().describe("Defaults to exact literal search."),
      roots: z.array(z.string()).max(12).optional(),
      file_globs: z
        .array(z.string())
        .max(8)
        .optional()
        .describe("Optional ripgrep globs like *.tsx or !*.map."),
      limit: z.number().int().min(1).max(200).optional(),
    }),
    outputSchema: envelopeSchema("source_search"),
    annotations: toolAnnotations,
  },
  async ({ query, mode: searchMode, roots, file_globs: fileGlobs, limit }) => {
    const startedAt = nowIso();
    auditToolCall("source_search");
    const searchedRoots = sanitizeRoots(roots);
    const maxMatches = limit ?? 50;
    const { matches, warnings } = rgSearch({
      query,
      roots: searchedRoots,
      mode: searchMode ?? "exact",
      limit: maxMatches,
      fileGlobs,
    });
    return textResult(
      createEnvelope(
        "source_search",
        startedAt,
        {
          query,
          mode: searchMode ?? "exact",
          matches,
          searched_roots: searchedRoots,
        },
        {
          warnings,
          limits: { limit: maxMatches, file_globs: fileGlobs ?? [] },
          next:
            matches.length > 0
              ? ["Call source_read on exact paths."]
              : ["Try repo_tree for structure or a narrower identifier."],
        },
      ),
    );
  },
);

server.registerTool(
  "source_read",
  {
    title: "Source Read",
    description:
      "Use this to read explicit allowed source files. Secret files and generic node_modules paths are denied.",
    inputSchema: z.object({
      paths: z.array(z.string()).min(1).max(20),
      max_bytes_per_file: z
        .number()
        .int()
        .min(1000)
        .max(250000)
        .optional()
        .describe("Defaults to 70000."),
    }),
    outputSchema: envelopeSchema("source_read"),
    annotations: toolAnnotations,
  },
  async ({ paths, max_bytes_per_file: maxBytesPerFile }) => {
    const startedAt = nowIso();
    auditToolCall("source_read");
    const maxBytes = maxBytesPerFile ?? 70000;
    const files = [];
    const denied_files = [];
    const missing_files = [];
    const warnings = [];

    for (const requested of paths) {
      try {
        const resolved = resolveProjectPath(requested);
        if (!fs.existsSync(resolved.absolute)) {
          missing_files.push(resolved.relative);
          continue;
        }
        const file = readTextFile(resolved.relative, maxBytes);
        files.push(file);
        if (file.truncated) warnings.push(`${file.path} truncated at ${maxBytes} bytes`);
      } catch (error) {
        denied_files.push(requested);
        warnings.push(`${requested}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return textResult(
      createEnvelope(
        "source_read",
        startedAt,
        {
          files,
          denied_files,
          missing_files,
        },
        {
          ok: denied_files.length === 0,
          sources: files.map(fileSource),
          warnings,
          errors:
            denied_files.length === 0
              ? []
              : [
                  makeError(
                    "UTEKOS_BRAND_DENIED_PATH",
                    "One or more requested paths were denied by policy.",
                    "Request non-secret files under the allowed roots.",
                    "access_control",
                  ),
                ],
          limits: { max_bytes_per_file: maxBytes },
          next: [
            "Use version_context for version-sensitive conclusions.",
            "Use token_resolve for variable mapping questions.",
          ],
        },
      ),
    );
  },
);

server.registerTool(
  "repo_tree",
  {
    title: "Repo Tree",
    description: "Use this to inspect allowed source tree structure without reading file contents.",
    inputSchema: z.object({
      root: z
        .string()
        .optional()
        .describe("Allowed relative root. Defaults to docs/mcp/dnb/UI-Components."),
      max_depth: z.number().int().min(0).max(8).optional(),
      limit: z.number().int().min(1).max(1000).optional(),
    }),
    outputSchema: envelopeSchema("repo_tree"),
    annotations: toolAnnotations,
  },
  async ({ root, max_depth: maxDepth, limit }) => {
    const startedAt = nowIso();
    auditToolCall("repo_tree");
    const selectedRoot = root ?? "docs/mcp/dnb/UI-Components";
    const tree = listFilesRecursive(selectedRoot, {
      maxDepth: maxDepth ?? 3,
      limit: limit ?? 300,
      includeDirs: true,
    });
    return textResult(
      createEnvelope(
        "repo_tree",
        startedAt,
        {
          root: selectedRoot,
          entries: tree.files,
          truncated: tree.truncated,
        },
        {
          warnings: tree.warnings,
          limits: { max_depth: maxDepth ?? 3, limit: limit ?? 300 },
          next: ["Use source_read on exact files or component_source for component-level mapping."],
        },
      ),
    );
  },
);

server.registerTool(
  "package_manifest",
  {
    title: "Package Manifest",
    description:
      "Use this to inspect the project or @dnb/eufemia package manifest with version, exports, dependencies, and repository metadata.",
    inputSchema: z.object({
      package_name: z.enum(["project", "utekos-brand-guidelines", "@dnb/eufemia"]).optional(),
    }),
    outputSchema: envelopeSchema("package_manifest"),
    annotations: toolAnnotations,
  },
  async ({ package_name: packageName }) => {
    const startedAt = nowIso();
    auditToolCall("package_manifest");
    const relative = packagePath(packageName ?? "project");
    const file = readTextFile(relative, 250000);
    const manifest = JSON.parse(file.content);
    return textResult(
      createEnvelope(
        "package_manifest",
        startedAt,
        {
          package_name: packageName ?? "project",
          path: relative,
          manifest: {
            name: manifest.name,
            version: manifest.version,
            packageManager: manifest.packageManager,
            type: manifest.type,
            main: manifest.main,
            module: manifest.module,
            types: manifest.types,
            exports: manifest.exports,
            sideEffects: manifest.sideEffects,
            repository: manifest.repository,
            homepage: manifest.homepage,
            dependencies: manifest.dependencies ?? {},
            peerDependencies: manifest.peerDependencies ?? {},
            scripts: packageName === "@dnb/eufemia" ? undefined : manifest.scripts,
          },
        },
        {
          sources: [fileSource(file)],
          next: ["Call exports_map for package entrypoint interpretation."],
        },
      ),
    );
  },
);

server.registerTool(
  "exports_map",
  {
    title: "Exports Map",
    description:
      "Use this to inspect package exports and common Eufemia style/component entrypoints.",
    inputSchema: z.object({
      package_name: z.enum(["project", "@dnb/eufemia"]).optional(),
    }),
    outputSchema: envelopeSchema("exports_map"),
    annotations: toolAnnotations,
  },
  async ({ package_name: packageName }) => {
    const startedAt = nowIso();
    auditToolCall("exports_map");
    const selected = packageName ?? "@dnb/eufemia";
    const relative = packagePath(selected);
    const file = readTextFile(relative, 250000);
    const manifest = JSON.parse(file.content);
    const entrypoints =
      selected === "@dnb/eufemia"
        ? [
            "node_modules/@dnb/eufemia/index.js",
            "node_modules/@dnb/eufemia/index.d.ts",
            "node_modules/@dnb/eufemia/style/index.scss",
            "node_modules/@dnb/eufemia/style/themes/ui/properties.css",
            "node_modules/@dnb/eufemia/style/themes/ui/tokens.scss",
            "node_modules/@dnb/eufemia/components/button/Button.js",
            "node_modules/@dnb/eufemia/components/button/style/dnb-button.scss",
          ].map(safeStat)
        : [safeStat("package.json")];

    return textResult(
      createEnvelope(
        "exports_map",
        startedAt,
        {
          package_name: selected,
          package_path: relative,
          exports: manifest.exports ?? null,
          main: manifest.main ?? null,
          module: manifest.module ?? null,
          types: manifest.types ?? null,
          sideEffects: manifest.sideEffects ?? null,
          known_entrypoints: entrypoints,
        },
        {
          sources: [fileSource(file)],
          next: ["Use source_read for one of the existing known_entrypoints."],
        },
      ),
    );
  },
);

function componentToolResponse(toolName, componentName, roleFilter) {
  const files = componentCandidateFiles(componentName).filter(
    (file) => !roleFilter || roleFilter(file),
  );
  return {
    component: componentName,
    normalized: {
      kebab: toKebab(componentName),
      pascal: toPascal(componentName),
    },
    files,
    read_order: files.map((file) => file.path),
    source_note:
      "Installed @dnb/eufemia package contains compiled JS, declaration files, SCSS, docs, and package metadata. Local docs/mcp/dnb contains source snapshots and tests where present.",
  };
}

server.registerTool(
  "component_source",
  {
    title: "Component Source",
    description:
      "Use this to locate component runtime files, declaration files, docs snapshots, and barrels before reading source.",
    inputSchema: z.object({
      component_name: z.string().min(2).max(80),
    }),
    outputSchema: envelopeSchema("component_source"),
    annotations: toolAnnotations,
  },
  async ({ component_name: componentName }) => {
    const startedAt = nowIso();
    auditToolCall("component_source");
    const data = componentToolResponse(
      "component_source",
      componentName,
      (file) => file.role !== "style" && file.role !== "test",
    );
    return textResult(
      createEnvelope("component_source", startedAt, data, {
        warnings: data.files.length === 0 ? [`No source files found for ${componentName}.`] : [],
        next:
          data.files.length > 0
            ? ["Call source_read with selected read_order paths."]
            : ["Try repo_tree under node_modules/@dnb/eufemia/components."],
      }),
    );
  },
);

server.registerTool(
  "component_style",
  {
    title: "Component Style",
    description:
      "Use this to locate component SCSS/CSS style files before reading styling implementation.",
    inputSchema: z.object({
      component_name: z.string().min(2).max(80),
    }),
    outputSchema: envelopeSchema("component_style"),
    annotations: toolAnnotations,
  },
  async ({ component_name: componentName }) => {
    const startedAt = nowIso();
    auditToolCall("component_style");
    const data = componentToolResponse(
      "component_style",
      componentName,
      (file) => file.role === "style",
    );
    return textResult(
      createEnvelope("component_style", startedAt, data, {
        warnings: data.files.length === 0 ? [`No style files found for ${componentName}.`] : [],
        next:
          data.files.length > 0
            ? ["Call source_read with selected style paths."]
            : ["Try source_search for dnb component class names."],
      }),
    );
  },
);

server.registerTool(
  "component_tests",
  {
    title: "Component Tests",
    description:
      "Use this to locate component test and screenshot evidence where local snapshots exist.",
    inputSchema: z.object({
      component_name: z.string().min(2).max(80),
    }),
    outputSchema: envelopeSchema("component_tests"),
    annotations: toolAnnotations,
  },
  async ({ component_name: componentName }) => {
    const startedAt = nowIso();
    auditToolCall("component_tests");
    const data = componentToolResponse(
      "component_tests",
      componentName,
      (file) => file.role === "test",
    );
    return textResult(
      createEnvelope("component_tests", startedAt, data, {
        warnings:
          data.files.length === 0
            ? [`No test files found for ${componentName} in allowed local snapshots.`]
            : [],
        next:
          data.files.length > 0
            ? ["Call source_read with selected test paths."]
            : ["Use component_source and component_style for implementation evidence."],
      }),
    );
  },
);

server.registerTool(
  "token_inventory",
  {
    title: "Token Inventory",
    description:
      "Use this to list structured CSS custom-property definitions from local Utekos themes and installed Eufemia theme files.",
    inputSchema: z.object({
      theme: z.enum(["dnb", "utekos", "havdyp", "vy", "all"]).optional(),
      limit: z.number().int().min(1).max(2000).optional(),
    }),
    outputSchema: envelopeSchema("token_inventory"),
    annotations: toolAnnotations,
  },
  async ({ theme, limit }) => {
    const startedAt = nowIso();
    auditToolCall("token_inventory");
    const files = cssTokenFiles(theme ?? "dnb");
    const maxTokens = limit ?? 500;
    const tokens = [];
    const sources = [];
    const warnings = [];
    for (const file of files) {
      if (tokens.length >= maxTokens) break;
      try {
        const extracted = extractCssVariables(file, maxTokens - tokens.length);
        tokens.push(...extracted.tokens);
        sources.push(fileSource(extracted.file));
      } catch (error) {
        warnings.push(`${file}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    return textResult(
      createEnvelope(
        "token_inventory",
        startedAt,
        {
          theme: theme ?? "dnb",
          token_count: tokens.length,
          tokens,
          token_files: files,
        },
        {
          sources,
          warnings,
          limits: { limit: maxTokens },
          next: [
            "Call token_resolve for a specific token before mapping it to semantic UI variables.",
          ],
        },
      ),
    );
  },
);

server.registerTool(
  "token_resolve",
  {
    title: "Token Resolve",
    description:
      "Use this to resolve a token/CSS variable across local theme files, installed Eufemia theme files, and docs snapshots.",
    inputSchema: z.object({
      token_name: z.string().min(2).max(240),
      theme: z.enum(["dnb", "utekos", "havdyp", "vy", "all"]).optional(),
      include_references: z.boolean().optional(),
    }),
    outputSchema: envelopeSchema("token_resolve"),
    annotations: toolAnnotations,
  },
  async ({ token_name: tokenName, theme, include_references: includeReferences }) => {
    const startedAt = nowIso();
    auditToolCall("token_resolve");
    const files = cssTokenFiles(theme ?? "dnb");
    const definitions = [];
    const references = [];
    const sources = [];
    for (const file of files) {
      const read = readTextFile(file, 1000000);
      sources.push(fileSource(read));
      const lines = read.content.split("\n");
      lines.forEach((line, index) => {
        if (!line.includes(tokenName)) return;
        const isDefinition = new RegExp(
          `${tokenName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:`,
        ).test(line);
        const record = {
          path: file,
          line: index + 1,
          text: line.trim().slice(0, 900),
        };
        if (isDefinition) definitions.push(record);
        else if (includeReferences) references.push(record);
      });
    }
    return textResult(
      createEnvelope(
        "token_resolve",
        startedAt,
        {
          token_name: tokenName,
          theme: theme ?? "dnb",
          definitions,
          references,
          token_files: files,
        },
        {
          sources,
          warnings:
            definitions.length === 0 ? [`No direct definitions found for ${tokenName}.`] : [],
          next:
            definitions.length > 0
              ? ["Use source_read for the defining files if exact selector context matters."]
              : ["Use search_exact_identifier across broader roots."],
        },
      ),
    );
  },
);

server.registerTool(
  "css_variable_inventory",
  {
    title: "CSS Variable Inventory",
    description:
      "Use this to list CSS custom properties with provenance. This is optimized for CSS variable audits.",
    inputSchema: z.object({
      theme: z.enum(["dnb", "utekos", "havdyp", "vy", "all"]).optional(),
      prefix: z
        .string()
        .max(120)
        .optional()
        .describe("Optional variable prefix, for example --token-color or --color."),
      limit: z.number().int().min(1).max(2000).optional(),
    }),
    outputSchema: envelopeSchema("css_variable_inventory"),
    annotations: toolAnnotations,
  },
  async ({ theme, prefix, limit }) => {
    const startedAt = nowIso();
    auditToolCall("css_variable_inventory");
    const files = cssTokenFiles(theme ?? "dnb");
    const maxTokens = limit ?? 500;
    const variables = [];
    const sources = [];
    for (const file of files) {
      if (variables.length >= maxTokens) break;
      const extracted = extractCssVariables(file, maxTokens);
      sources.push(fileSource(extracted.file));
      for (const token of extracted.tokens) {
        if (variables.length >= maxTokens) break;
        if (prefix && !token.name.startsWith(prefix)) continue;
        variables.push(token);
      }
    }
    return textResult(
      createEnvelope(
        "css_variable_inventory",
        startedAt,
        {
          theme: theme ?? "dnb",
          prefix: prefix ?? null,
          variable_count: variables.length,
          variables,
          token_files: files,
        },
        {
          sources,
          limits: { limit: maxTokens },
          next: ["Call token_resolve for a selected variable."],
        },
      ),
    );
  },
);

server.registerTool(
  "version_context",
  {
    title: "Version Context",
    description:
      "Use this to establish installed package versions, repo state, source availability, and documentation source boundaries.",
    inputSchema: z.object({}),
    outputSchema: envelopeSchema("version_context"),
    annotations: toolAnnotations,
  },
  async () => {
    const startedAt = nowIso();
    auditToolCall("version_context");
    const projectManifestFile = readTextFile("package.json", 250000);
    const eufemiaManifestFile = readTextFile("node_modules/@dnb/eufemia/package.json", 250000);
    const sdkManifestFile = readTextFile(
      "node_modules/@modelcontextprotocol/sdk/package.json",
      250000,
    );
    const projectManifest = JSON.parse(projectManifestFile.content);
    const eufemiaManifest = JSON.parse(eufemiaManifestFile.content);
    const sdkManifest = JSON.parse(sdkManifestFile.content);
    const head = run("git", ["rev-parse", "HEAD"]);
    const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    const status = run("git", ["status", "--porcelain=v1"]);
    const componentDir = safeStat("node_modules/@dnb/eufemia/components");
    const docsSnapshotDir = safeStat("docs/mcp/dnb/UI-Components");
    return textResult(
      createEnvelope(
        "version_context",
        startedAt,
        {
          project: {
            name: projectManifest.name,
            version: projectManifest.version,
            packageManager: projectManifest.packageManager,
          },
          eufemia: {
            package_name: eufemiaManifest.name,
            installed_version: eufemiaManifest.version,
            repository: eufemiaManifest.repository,
            homepage: eufemiaManifest.homepage,
            package_contains_component_runtime_files: componentDir.exists,
            package_contains_original_repo_tests: safeStat(
              "node_modules/@dnb/eufemia/components/button/__tests__",
            ).exists,
          },
          mcp_sdk: {
            package_name: sdkManifest.name,
            installed_version: sdkManifest.version,
          },
          local_snapshots: {
            docs_mcp_dnb_ui_components: docsSnapshotDir,
            docs_readme: safeStat("docs/README.md"),
            dnb_theme_css: safeStat("styles/themes/dnb.css"),
            figma_tokens: safeStat("src/app/details/figma/figma-tokens.json"),
          },
          git: {
            branch: outputLines(branch)[0] ?? "unknown",
            head: outputLines(head)[0] ?? "unknown",
            dirty: outputLines(status).length > 0,
            status_count: outputLines(status).length,
          },
          source_boundary:
            "Installed package is authoritative for installed runtime/style artifacts. docs/mcp/dnb is a repo-local source snapshot and must not be treated as proof of current upstream unless separately refreshed.",
        },
        {
          sources: [
            fileSource(projectManifestFile),
            fileSource(eufemiaManifestFile),
            fileSource(sdkManifestFile),
          ],
          next: [
            "Use component_source/component_style for specific components.",
            "Use token_inventory for DNB token mapping.",
          ],
        },
      ),
    );
  },
);

server.registerTool(
  "changelog_diff",
  {
    title: "Changelog Diff",
    description:
      "Use this to inspect installed @dnb/eufemia changelog sections for a version window.",
    inputSchema: z.object({
      from_version: z.string().max(40).optional(),
      to_version: z.string().max(40).optional(),
      max_bytes: z.number().int().min(1000).max(120000).optional(),
    }),
    outputSchema: envelopeSchema("changelog_diff"),
    annotations: toolAnnotations,
  },
  async ({ from_version: fromVersion, to_version: toVersion, max_bytes: maxBytes }) => {
    const startedAt = nowIso();
    auditToolCall("changelog_diff");
    const file = readTextFile("node_modules/@dnb/eufemia/CHANGELOG.md", maxBytes ?? 50000);
    const lines = file.content.split("\n");
    const headings = lines
      .map((line, index) => ({ line, index }))
      .filter((item) => /^#{1,3}\s/.test(item.line) && /\d+\.\d+\.\d+/.test(item.line));
    const fromIndex = fromVersion
      ? headings.find((item) => item.line.includes(fromVersion))?.index
      : undefined;
    const toIndex = toVersion
      ? headings.find((item) => item.line.includes(toVersion))?.index
      : undefined;
    const start = typeof toIndex === "number" ? toIndex : 0;
    const end =
      typeof fromIndex === "number" && fromIndex > start
        ? fromIndex
        : Math.min(lines.length, start + 220);
    const excerpt = lines.slice(start, end).join("\n");
    return textResult(
      createEnvelope(
        "changelog_diff",
        startedAt,
        {
          path: file.path,
          from_version: fromVersion ?? null,
          to_version: toVersion ?? null,
          excerpt,
          truncated: file.truncated || end < lines.length,
        },
        {
          sources: [fileSource(file)],
          limits: { max_bytes: maxBytes ?? 50000 },
          next: [
            "Use version_context to confirm the installed version before making version-sensitive claims.",
          ],
        },
      ),
    );
  },
);

server.registerTool(
  "figma_token_export_read",
  {
    title: "Figma Token Export Read",
    description:
      "Use this to inspect the local Figma token export snapshot for token and theme decisions.",
    inputSchema: z.object({
      max_bytes: z.number().int().min(1000).max(250000).optional(),
    }),
    outputSchema: envelopeSchema("figma_token_export_read"),
    annotations: toolAnnotations,
  },
  async ({ max_bytes: maxBytes }) => {
    const startedAt = nowIso();
    auditToolCall("figma_token_export_read");
    const pathName = "src/app/details/figma/figma-tokens.json";
    if (!fs.existsSync(path.join(repoRoot, pathName))) {
      return textResult(
        createEnvelope(
          "figma_token_export_read",
          startedAt,
          {
            path: pathName,
            exists: false,
          },
          {
            ok: false,
            warnings: ["Local Figma token export snapshot does not exist."],
            next: ["Use token_inventory and token_resolve instead."],
          },
        ),
      );
    }
    const file = readTextFile(pathName, maxBytes ?? 120000);
    let parsedSummary = null;
    try {
      const parsed = JSON.parse(file.content);
      parsedSummary = {
        root_type: Array.isArray(parsed) ? "array" : typeof parsed,
        root_keys: Array.isArray(parsed) ? [] : Object.keys(parsed).slice(0, 80),
        array_length: Array.isArray(parsed) ? parsed.length : null,
      };
    } catch {
      parsedSummary = {
        parse_error: "The returned content was truncated or is not valid JSON.",
      };
    }
    return textResult(
      createEnvelope(
        "figma_token_export_read",
        startedAt,
        {
          file,
          parsed_summary: parsedSummary,
        },
        {
          sources: [fileSource(file)],
          limits: { max_bytes: maxBytes ?? 120000 },
          next: ["Use token_resolve for exact CSS variable mapping after reading Figma context."],
        },
      ),
    );
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Utekos Brand Eufemia Insight MCP server running on stdio");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
