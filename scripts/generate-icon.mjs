import sharp from 'sharp'
import { readFileSync } from 'fs'
import { mkdirSync } from 'fs'

mkdirSync('resources', { recursive: true })

const svg = readFileSync('public/icon.svg')

await sharp(svg)
  .resize(1024, 1024)
  .png()
  .toFile('resources/icon.png')

console.log('✅ Icon generated at resources/icon.png')
