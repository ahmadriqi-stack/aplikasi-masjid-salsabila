import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = 'scripts/shots'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const consoleErrors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
})
page.on('pageerror', (err) => consoleErrors.push(`PAGEERROR: ${err.message}`))

await page.goto('http://localhost:5173?tv=0', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForSelector('text=Masjid', { timeout: 20000 })
await page.waitForTimeout(2500) // let framer-motion settle + API load

// Verify key sections
const checks = {
  heroBrand: await page.locator('text=Salsabila').first().isVisible(),
  jadwal: await page.locator('text=Jadwal Sholat Hari Ini').first().isVisible(),
  kalender: await page.locator('text=Tanggal Hijriyah').first().isVisible(),
  pengumuman: await page.locator('text=Papan Pengumuman').first().isVisible(),
  hadis: await page.locator('text=Kumpulan Hadis').first().isVisible(),
  agenda: await page.locator('text=Agenda Mingguan').first().isVisible(),
  countdown: await page.locator('text=Menjelang').first().isVisible(),
}

await page.screenshot({ path: `${OUT}/01-hero.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } })
await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }))
await page.waitForTimeout(1200)
await page.screenshot({ path: `${OUT}/02-schedule.png` })
await page.evaluate(() => document.getElementById('kalender')?.scrollIntoView())
await page.waitForTimeout(1200)
await page.screenshot({ path: `${OUT}/03-calendar.png` })
await page.evaluate(() => document.getElementById('hadis')?.scrollIntoView())
await page.waitForTimeout(1200)
await page.screenshot({ path: `${OUT}/04-hadith.png` })
await page.evaluate(() => document.getElementById('pengumuman')?.scrollIntoView())
await page.waitForTimeout(1200)
await page.screenshot({ path: `${OUT}/05-announcements.png` })

// Theme switch test
await page.locator('button[aria-label="Ganti tema warna"]').click()
await page.waitForTimeout(400)
await page.locator('text=Midnight Azur').click()
await page.waitForTimeout(800)
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
await page.waitForTimeout(600)
await page.screenshot({ path: `${OUT}/06-theme-midnight.png` })

// Mobile viewport
await page.setViewportSize({ width: 390, height: 844 })
await page.waitForTimeout(600)
await page.screenshot({ path: `${OUT}/07-mobile.png` })

// TV / Signage mode (16:9, like a living-room TV)
// Use domcontentloaded — networkidle races with auto-rotate (14s) and API polls
await page.setViewportSize({ width: 1920, height: 1080 })
await page.goto('http://localhost:5173/?tv=1', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector('text=Waktu Sholat', { timeout: 15000 })
await page.keyboard.press('1')
await page.waitForTimeout(1200)
checks.tvWaktu = await page.locator('text=Waktu sekarang').first().isVisible()
checks.tvCountdown = await page.locator('text=Menjelang').first().isVisible()
await page.screenshot({ path: `${OUT}/08-tv-waktu.png` })

await page.keyboard.press('2')
await page.waitForTimeout(900)
await page.screenshot({ path: `${OUT}/09-tv-jadwal.png` })
checks.tvJadwal = await page.locator('text=Jadwal Sholat Hari Ini').first().isVisible()

// Fresh load with #hadis hash — bright jernih backdrop + motion
await page.goto('http://localhost:5173/?tv=1#hadis', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector('text=Kumpulan Hadis', { timeout: 15000 })
await page.waitForTimeout(1800)
checks.tvHadis = await page.locator('text=Kumpulan Hadis').first().isVisible()
checks.tvHadisCard = await page.locator('text=Hadis berikutnya').first().isVisible()
await page.screenshot({ path: `${OUT}/10-tv-hadis.png` })

console.log('CHECKS:', JSON.stringify(checks, null, 2))
console.log('CONSOLE_ERRORS:', consoleErrors.length ? consoleErrors : 'none')
await browser.close()
