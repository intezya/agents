#!/usr/bin/env node
"use strict";

const fs = require("fs");
const http = require("http");

const targetTag = process.env.TARGET_TAG || "";
const targetPort = process.env.TARGET_PORT ? Number(process.env.TARGET_PORT) : null;

function readCmdline(pid) {
  try {
    return fs.readFileSync(`/proc/${pid}/cmdline`, "utf8").split("\u0000").filter(Boolean);
  } catch {
    return [];
  }
}

function findConfigUrl() {
  for (const pid of fs.readdirSync("/proc")) {
    if (!/^\d+$/.test(pid)) continue;
    const argv = readCmdline(pid);
    const idx = argv.indexOf("-config");
    if (idx >= 0 && argv[idx + 1] && argv[idx + 1].startsWith("http+unix://")) {
      return argv[idx + 1];
    }
  }
  throw new Error("xray http+unix config URL not found in /proc");
}

function splitHttpUnixUrl(raw) {
  const prefix = "http+unix://";
  const rest = raw.slice(prefix.length);
  const slash = rest.indexOf("/internal/");
  if (!raw.startsWith(prefix) || slash < 0) {
    throw new Error("unexpected config URL format");
  }
  return { socketPath: rest.slice(0, slash), path: rest.slice(slash) };
}

function requestConfig({ socketPath, path }) {
  return new Promise((resolve, reject) => {
    const req = http.request({ socketPath, path, method: "GET" }, (res) => {
      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve({ statusCode: res.statusCode, data }));
    });
    req.on("error", reject);
    req.end();
  });
}

function summarizeInbound(ib) {
  const clients = ib.settings?.clients || ib.settings?.users || [];
  const xh = ib.streamSettings?.xhttpSettings || ib.streamSettings?.splithttpSettings || {};
  const extra = xh.extra || {};
  return [
    "inbound",
    `tag=${ib.tag || ""}`,
    `listen=${ib.listen || ""}`,
    `port=${ib.port || ""}`,
    `protocol=${ib.protocol || ""}`,
    `clients=${Array.isArray(clients) ? clients.length : 0}`,
    `network=${ib.streamSettings?.network || ""}`,
    `security=${ib.streamSettings?.security || ""}`,
    `path=${xh.path || ""}`,
    `mode=${xh.mode || ""}`,
    `uplinkHTTPMethod=${extra.uplinkHTTPMethod || xh.uplinkHTTPMethod || "unset"}`,
  ].join("|");
}

(async () => {
  const url = splitHttpUnixUrl(findConfigUrl());
  const { statusCode, data } = await requestConfig(url);
  console.log(`status=${statusCode}|bytes=${data.length}`);

  const parsed = JSON.parse(data);
  const cfg = parsed.config || parsed.response || parsed;
  const inbounds = Array.isArray(cfg.inbounds) ? cfg.inbounds : [];
  console.log(`cfg_inbounds=${inbounds.length}`);

  for (const ib of inbounds) {
    console.log(summarizeInbound(ib));
  }

  if (targetTag || targetPort !== null) {
    const target = inbounds.find((ib) => (
      (targetTag && ib.tag === targetTag) ||
      (targetPort !== null && Number(ib.port) === targetPort)
    ));
    console.log(`target=${target ? "present" : "missing"}`);
    if (target) console.log(`target_summary|${summarizeInbound(target).slice("inbound|".length)}`);
  }
})().catch((err) => {
  console.error(`error=${err.message}`);
  process.exit(1);
});
