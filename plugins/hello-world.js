import { tool } from "@opencode-ai/plugin"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const scriptPath = join(dirname(fileURLToPath(import.meta.url)), "hello_world.sh")

function runScript(name) {
  return new Promise((resolve, reject) => {
    const child = spawn("bash", [scriptPath, name])
    let out = ""
    let err = ""
    child.stdout.on("data", (d) => (out += d))
    child.stderr.on("data", (d) => (err += d))
    child.on("close", (code) => (code === 0 ? resolve(out.trimEnd()) : reject(new Error(err.trim() || `exit ${code}`))))
    child.on("error", reject)
  })
}

export const HelloWorldPlugin = async () => {
  return {
    tool: {
      hello_world: tool({
        description: "Runs a bash script that prints a hello world greeting for the given name.",
        args: {
          name: tool.schema.string().describe("The name to greet. Defaults to 'world'."),
        },
        async execute(args) {
          const name = args.name && args.name.length > 0 ? args.name : "world"
          return await runScript(name)
        },
      }),
    },
  }
}

export default HelloWorldPlugin
