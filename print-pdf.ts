/* eslint-disable @typescript-eslint/no-floating-promises */
import puppeteer from "puppeteer"

const colorSchemes = ["dark", "light"]

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await colorSchemes.reduce(async (lastResult, color): Promise<undefined> => {
    await lastResult

    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: color },
    ])
    await page.goto(`http://localhost:8000/resume`, {
      waitUntil: "networkidle2",
    })
    await page.pdf({
      path: `./static/resume-${color}.pdf`,
      format: "A4",
      pageRanges: "1",
      printBackground: true,
    })
    return undefined
  }, Promise.resolve())
  await browser.close()
})()