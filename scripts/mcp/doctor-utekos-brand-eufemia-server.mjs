#!/usr/bin/env node

import path from "node:path";
import process from "node:process";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const repoRoot = path.resolve(process.env.UTEKOS_BRAND_REPO_ROOT ?? process.cwd());
const serverPath = path.join(repoRoot, "scripts/mcp/utekos-brand-eufemia-server.mjs");

const expectedTools = [
  "brand_eufemia_bootstrap",
  "connector_surface_audit",
  "tool_inventory",
  "search_exact_identifier",
  "source_search",
  "source_read",
  "repo_tree",
  "package_manifest",
  "exports_map",
  "component_source",
  "component_style",
  "component_tests",
  "token_inventory",
  "token_resolve",
  "css_variable_inventory",
  "version_context",
  "changelog_diff",
  "figma_token_export_read",
];

function fail(message, details = undefined) {
  console.error(`FAIL ${message}`);
  if (details) console.error(details);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`OK ${message}`);
}

async function main() {
  const stderrChunks = [];
  const transport = new StdioClientTransport({
    command: "node",
    args: [serverPath],
    cwd: repoRoot,
    env: {
      ...process.env,
      UTEKOS_BRAND_REPO_ROOT: repoRoot,
    },
    stderr: "pipe",
  });

  transport.stderr?.on("data", (chunk) => {
    stderrChunks.push(String(chunk));
  });

  const client = new Client({
    name: "utekos-brand-eufemia-doctor",
    version: "1.0.0",
  });

  try {
    await client.connect(transport);
    ok("MCP initialize handshake completed");

    const listed = await client.listTools();
    const toolNames = listed.tools.map((tool) => tool.name).sort();
    const missing = expectedTools.filter((tool) => !toolNames.includes(tool));
    const unexpected = toolNames.filter((tool) => !expectedTools.includes(tool));

    if (missing.length > 0) fail(`missing tools: ${missing.join(", ")}`);
    else ok(`all expected tools present (${expectedTools.length})`);

    if (unexpected.length > 0) fail(`unexpected tools: ${unexpected.join(", ")}`);
    else ok("no unexpected tools present");

    const missingOutputSchema = listed.tools
      .filter((tool) => !tool.outputSchema)
      .map((tool) => tool.name);
    if (missingOutputSchema.length > 0)
      fail(`tools without outputSchema: ${missingOutputSchema.join(", ")}`);
    else ok("all tools expose outputSchema");

    const badAnnotations = listed.tools
      .filter(
        (tool) =>
          tool.annotations?.readOnlyHint !== true || tool.annotations?.destructiveHint !== false,
      )
      .map((tool) => tool.name);
    if (badAnnotations.length > 0)
      fail(`tools with non-read-only annotations: ${badAnnotations.join(", ")}`);
    else ok("all tools are annotated read-only and non-destructive");

    const bootstrap = await client.callTool({
      name: "brand_eufemia_bootstrap",
      arguments: {},
    });
    if (bootstrap.structuredContent?.ok === true)
      ok("brand_eufemia_bootstrap returned structuredContent");
    else fail("brand_eufemia_bootstrap did not return ok structuredContent");

    const component = await client.callTool({
      name: "component_source",
      arguments: { component_name: "Button" },
    });
    const componentFiles = component.structuredContent?.data?.files;
    if (Array.isArray(componentFiles) && componentFiles.length > 0)
      ok(`component_source(Button) found ${componentFiles.length} files`);
    else fail("component_source(Button) found no files");

    const versionContext = await client.callTool({
      name: "version_context",
      arguments: {},
    });
    if (versionContext.structuredContent?.ok === true)
      ok("version_context returned structuredContent");
    else fail("version_context did not return ok structuredContent");

    const token = await client.callTool({
      name: "token_resolve",
      arguments: {
        token_name: "--token-color-text-neutral-on-dark",
        theme: "dnb",
        include_references: true,
      },
    });
    if (token.structuredContent?.ok === true) ok("token_resolve returned structuredContent");
    else fail("token_resolve did not return ok structuredContent");
  } finally {
    await client.close();
  }

  if (process.exitCode && stderrChunks.length > 0) {
    console.error("--- server stderr ---");
    console.error(stderrChunks.join("").trim());
  }

  if (!process.exitCode) console.log("RESULT accepted");
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
