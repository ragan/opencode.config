import { tool } from "@opencode-ai/plugin"
import { chromium } from "playwright"

export default tool({
  description: "Automate web browsing and testing with Playwright",
  args: {
    url: tool.schema.string().describe("URL of the web page to browse"),
    actions: tool.schema.array(tool.schema.object({
      type: tool.schema.enum(["click", "fill", "wait", "screenshot", "extractText"]).describe("Type of action"),
      selector: tool.schema.string().optional().describe("CSS selector or element identifier"),
      value: tool.schema.string().optional().describe("Value for fill actions"),
      timeout: tool.schema.number().optional().describe("Timeout in milliseconds")
    })).describe("List of actions to perform"),
    verify: tool.schema.boolean().describe("Whether to verify functionality")
  },
  async execute(args, context) {
    let browser
    try {
      browser = await chromium.launch({ headless: true })
      const page = await browser.newPage()
      await page.goto(args.url, { timeout: 30000 })
      
      const title = await page.title()
      
      let output = ""
      
      for (const action of args.actions || []) {
        try {
          switch (action.type) {
            case "click": {
              if (!action.selector) {
                output += "Click action requires a selector\n"
                break
              }
              await page.waitForSelector(action.selector, { state: "visible" })
              await page.click(action.selector)
              output += `Clicked: ${action.selector}\n`
              break
            }
            case "fill": {
              if (!action.selector || !action.value) {
                output += "Fill action requires selector and value\n"
                break
              }
              await page.waitForSelector(action.selector, { state: "visible" })
              await page.fill(action.selector, action.value)
              output += `Filled: ${action.selector} with ${action.value}\n`
              break
            }
            case "wait":
              await page.waitForTimeout(action.timeout || 1000)
              output += `Waited ${action.timeout || 1000}ms\n`
              break
            case "screenshot": {
              const screenshotPath = `/tmp/screenshot_${Date.now()}.png`
              await page.screenshot({ path: screenshotPath, fullPage: true })
              output += `Screenshot saved to ${screenshotPath}\n`
              break
            }
            case "extractText": {
              let text = ""
              if (action.selector) {
                try {
                  await page.waitForSelector(action.selector, { state: "visible" })
                  text = await page.$eval(action.selector, el => el.textContent)
                } catch (selectorError) {
                  output += `Error: Selector '${action.selector}' not found\n`
                  break
                }
              } else {
                text = await page.evaluate(() => document.body?.textContent || document.documentElement.innerText || "")
              }
              output += text || "No text found\n"
              break
            }
          }
        } catch (actionError) {
          output += `Action error: ${actionError.message}\n`
        }
      }
      
      return output || `Navigated to ${args.url} - Page title: ${title}`
    } catch (error) {
      return `Error: ${error.message}`
    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }
})
