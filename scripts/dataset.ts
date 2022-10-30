import fs from "fs"
import playwright, { devices } from "playwright"

import { detab, tab } from "../src/utils"
import { toCamelCase, toTitleCase } from "../src/utils/cases"
import { formatJSX, formatSVG } from "./helpers"
import { Dataset, Manifest } from "./types"

const UNPKG_CSS_SELECTOR = "css-xt128v"

async function run() {
	// Create a playwright context and browser
	const browser = await playwright.chromium.launch({ headless: false })
	const context = await browser.newContext(devices["Desktop Chrome HiDPI"])
	// Close the playwright context and browser
	async function teardown() {
		await context.close() // Close in reverse order
		await browser.close()
	}
	// Get package metadata
	const page1 = await context.newPage()
	await page1.goto("https://unpkg.com/browse/heroicons/")
	const groups = /@(\d+\.\d+\.\d+)/.exec(page1.url())
	if (groups === null) {
		await teardown()
		return
	}
	const version = groups[1]
	const page2 = await context.newPage()
	await page2.goto("https://npmjs.com/package/heroicons/")
	const created = await page2.evaluate(() => {
		return document.getElementsByTagName("time")[0].dateTime
	})
	// Get names and hrefs
	const page3 = await context.newPage()
	await page3.exposeFunction("toCamelCase", (name: string) => toCamelCase(name))
	await page3.exposeFunction("toTitleCase", (name: string) => toTitleCase(name))
	await page3.goto(`https://unpkg.com/browse/heroicons@${version}/24/outline/`)
	const dataset = await page3.evaluate(async ([version, created, cssSelector]) => {
		// Use x.slice(3) because of:
		//
		// - UNPKG     e.g. x.slice(0)
		// - heroicons e.g. x.slice(1)
		// - size      e.g. x.slice(2)
		// - ..        e.g. x.slice(3)
		//
		//// const anchors = [...document.getElementsByClassName(cssSelector)].slice(version === "1.0.6" ? 2 : 3) as HTMLAnchorElement[]
		const anchors = [...document.getElementsByClassName(cssSelector)].slice(3) as HTMLAnchorElement[]
		const dataset: Dataset = {
			meta: {
				package: "heroicons",
				version,
				created,
			},
			payload: [],
		}
		for (const anchor of anchors) {
			const name = anchor.textContent!.slice(0, -1 * ".svg".length)
			dataset.payload.push({
				name: {
					kebab: name,
					camel: await window.toCamelCase(name),
					title: await window.toTitleCase(name),
				},
				[20]: {
					solid: {
						href: anchor.href
							.replace("/browse/", "/")
							.replace("/24/", "/20/")
							.replace("/outline/", "/solid/"),
						svg: "",
						jsx: "",
					},
				},
				[24]: {
					outline: {
						href: anchor.href
							.replace("/browse/", "/")
							.replace("/24/", "/24/")            // No-op
							.replace("/outline/", "/outline/"), // No-op
						svg: "",
						jsx: "",
					},
					solid: {
						href: anchor.href
							.replace("/browse/", "/")
							.replace("/24/", "/24/") // No-op
							.replace("/outline/", "/solid/"),
						svg: "",
						jsx: "",
					},
				},
			})
		}
		return dataset
	}, [
		version,
		created,
		UNPKG_CSS_SELECTOR,
	])
	// Get SVG and JSX contents
	const p1 = await context.newPage()
	const p2 = await context.newPage()
	const p3 = await context.newPage()
	for (const icon of dataset.payload) {
		for (const tuple of [
			{ page: p1, size: 20, variant: "solid"   },
			{ page: p2, size: 24, variant: "outline" },
			{ page: p3, size: 24, variant: "solid"   },
		]) {
			await tuple.page.goto(icon[tuple.size][tuple.variant].href)
			const content = await tuple.page.content()
			icon[tuple.size][tuple.variant].svg = formatSVG(content)
			icon[tuple.size][tuple.variant].jsx = formatJSX(icon[tuple.size][tuple.variant].href, icon.name.title, content)
		}
	}
	// src/manifest@VERSION.ts
	const manifest: Manifest = {
		meta: dataset.meta,
		payload: dataset.payload.map(icon => icon.name),
	}
	const manifestContents = detab(`
		// AUTOGENERATED; DO NOT EDIT
		// RUN npm run dataset TO REGENERATE\n
		export const manifest = ${tab(JSON.stringify(manifest, null, "\t"), 2, { omitStart: true })}
	`).trim() + "\n"
	await fs.promises.mkdir("src/data", { recursive: true })
	await fs.promises.writeFile(`src/data/manifest@${version}.ts`, manifestContents)
	// src/assets/heroicons@VERSION/index.ts
	const indexContents = detab(`
		// AUTOGENERATED; DO NOT EDIT
		// RUN npm run dataset TO REGENERATE\n
		export * as sm from "./20"
		export * as lg from "./24"
	`).trim() + "\n"
	await fs.promises.mkdir(`src/assets/heroicons@${version}`, { recursive: true })
	await fs.promises.writeFile(`src/assets/heroicons@${version}/index.ts`, indexContents)
	for (const size of [20, 24]) {
		// src/assets/heroicons@VERSION/SIZE/index.ts
		let contents = ""
		if (size === 20) {
			contents = detab(`
				export * as solid from "./solid"
			`).trim() + "\n"
		} else {
			contents = detab(`
				export * as outline from "./outline"
				export * as solid from "./solid"
			`).trim() + "\n"
		}
		await fs.promises.mkdir(`src/assets/heroicons@${version}/${size}`, { recursive: true })
		await fs.promises.writeFile(`src/assets/heroicons@${version}/${size}/index.ts`, contents)
		for (const variant of size === 20 ? ["solid"] : ["outline", "solid"]) {
			// src/assets/heroicons@VERSION/SIZE/VARIANT/index.ts
			const contents = dataset.payload.map(icon => detab(`
				export * from "./${icon.name.title}"
			`).trim()).join("\n") + "\n"
			await fs.promises.mkdir(`src/assets/heroicons@${version}/${size}/${variant}`, { recursive: true })
			await fs.promises.writeFile(`src/assets/heroicons@${version}/${size}/${variant}/index.ts`, contents)
			for (const icon of dataset.payload) {
				// src/assets/heroicons@VERSION/SIZE/VARIANT/TITLE.{svg,tsx}
				await fs.promises.mkdir(`src/assets/heroicons@${version}/${size}/${variant}`, { recursive: true })
				await fs.promises.writeFile(`src/assets/heroicons@${version}/${size}/${variant}/${icon.name.title}.tsx`, icon[size][variant].jsx)
			}
		}
	}
	await teardown()
}

run()
