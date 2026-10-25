import { execFileSync, spawn } from "node:child_process"
import { createRequire } from "node:module"
import { stripVTControlCharacters } from "node:util"

const require = createRequire(import.meta.url)
let origins = []
let httpsEnabled = false

try {
  const status = JSON.parse(
    execFileSync("tailscale", ["status", "--json"], {
      encoding: "utf8",
      timeout: 5000,
      stdio: ["ignore", "pipe", "pipe"],
    })
  )
  if (status.BackendState === "Running") {
    httpsEnabled = Boolean(status.CertDomains?.length)
    origins = [
      status.Self.DNSName.replace(/\.$/, ""),
      ...status.TailscaleIPs,
    ].filter(Boolean)
  }
} catch {
  // Tailscale is optional, as local development still works without it.
}

const child = spawn(
  process.execPath,
  [
    require.resolve("next/dist/bin/next"),
    "dev",
    "--hostname",
    "127.0.0.1",
    ...process.argv.slice(2),
  ],
  {
    env: {
      ...process.env,
      PORT: process.env.PORT || "3100",
      DEV_TAILSCALE_ORIGINS: origins.join(","),
    },
    stdio: ["inherit", "pipe", "inherit"],
  }
)

let startup = ""
let forwarded = false
child.stdout.on("data", (chunk) => {
  process.stdout.write(chunk)
  if (forwarded) return

  startup += stripVTControlCharacters(chunk.toString())
  const local = startup.match(/Local:\s+(https?:\/\/\S+)/)
  if (!local || !startup.includes("Ready in")) return
  forwarded = true

  if (!origins.length) {
    console.log(
      "\nConnect Tailscale on this machine to enable a MacBook link.\n"
    )
    return
  }

  const url = new URL(local[1])
  try {
    const serve = JSON.parse(
      execFileSync("tailscale", ["serve", "status", "--json"], {
        encoding: "utf8",
        timeout: 5000,
        stdio: ["ignore", "pipe", "pipe"],
      })
    )
    // Tailscale requires removing an HTTP listener before switching its port to HTTPS.
    if (httpsEnabled && serve.TCP?.[url.port]?.HTTP) {
      execFileSync("tailscale", ["serve", `--http=${url.port}`, "off"], {
        timeout: 5000,
        stdio: ["ignore", "pipe", "pipe"],
      })
    }
    const output = execFileSync(
      "tailscale",
      [
        "serve",
        "--bg",
        `--https=${url.port}`,
        `${url.protocol === "https:" ? "https+insecure:" : url.protocol}//127.0.0.1:${url.port}`,
      ],
      { encoding: "utf8", timeout: 10000, stdio: ["ignore", "pipe", "pipe"] }
    )
    console.log(
      `\n${output.trim()}\nKeep Tailscale connected on your MacBook.\n`
    )
  } catch (error) {
    const details = [error.stdout, error.stderr]
      .map((value) => value?.toString().trim())
      .filter(Boolean)
      .join("\n")
    console.error(
      `\nHTTPS forwarding failed: ${details || error.message}\nComplete any Tailscale setup above, then restart pnpm dev.`
    )
  }
})

let stopping = false
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    stopping = true
    child.kill(signal)
  })
}
child.on("error", (error) => {
  console.error(error.message)
  process.exitCode = 1
})
child.on("exit", (code, signal) => {
  process.exitCode = stopping ? 0 : (code ?? (signal ? 1 : 0))
})
