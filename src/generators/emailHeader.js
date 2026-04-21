// Generates SVG for the .NET Updates Email Header template
// Matches the purple gradient + ".NET" + month/year + dotnet-bot style

export function generateEmailHeaderSvg(values, width = 1920, height = 640) {
  const {
    month = 'March',
    year = '2025',
    title = '.NET',
    subtitle = 'Updates',
    gradientStart = '#512bd4',
    gradientEnd = '#7b3ff2',
    textColor = '#ffffff',
    showBot = 'yes',
    botImage = null,
  } = values

  const dateText = `${month} ${year}`

  // dotnet-bot image
  const botSrc = botImage || 'dotnet-bot.png'
  const botSection = showBot === 'yes' ? `
    <g transform="translate(${width - 320}, ${height / 2 - 180})">
      <image href="${botSrc}" x="0" y="0" width="280" height="360" preserveAspectRatio="xMidYMid meet" />
    </g>
  ` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradientStart}" />
      <stop offset="100%" stop-color="${gradientEnd}" />
    </linearGradient>
    <!-- Decorative circles -->
    <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.08)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg-grad)" />

  <!-- Decorative elements -->
  <circle cx="${width * 0.15}" cy="${height * 0.3}" r="200" fill="url(#glow1)" />
  <circle cx="${width * 0.7}" cy="${height * 0.8}" r="300" fill="url(#glow1)" />
  <circle cx="${width * 0.85}" cy="${height * 0.2}" r="150" fill="url(#glow1)" />

  <!-- Dot pattern -->
  <g opacity="0.06">
    ${Array.from({ length: 20 }, (_, i) =>
      Array.from({ length: 8 }, (_, j) =>
        `<circle cx="${100 + i * 90}" cy="${60 + j * 80}" r="2" fill="${textColor}" />`
      ).join('')
    ).join('')}
  </g>

  <!-- Title -->
  <text x="120" y="${height / 2 - 60}" font-family="'Segoe UI', system-ui, -apple-system, sans-serif" font-size="120" font-weight="700" fill="${textColor}" letter-spacing="-2">
    ${escapeXml(title)}
  </text>

  <!-- Subtitle -->
  <text x="120" y="${height / 2 + 20}" font-family="'Segoe UI', system-ui, -apple-system, sans-serif" font-size="52" font-weight="400" fill="${textColor}" opacity="0.9">
    ${escapeXml(subtitle)}
  </text>

  <!-- Date -->
  <text x="120" y="${height / 2 + 80}" font-family="'Segoe UI', system-ui, -apple-system, sans-serif" font-size="36" font-weight="300" fill="${textColor}" opacity="0.7">
    ${escapeXml(dateText)}
  </text>

  <!-- Extra images -->
  ${(values.extraImages || []).map((img, i) =>
    `<image href="${img}" x="${400 + i * 130}" y="${height - 140}" width="110" height="110" preserveAspectRatio="xMidYMid meet" />`
  ).join('\n  ')}

  ${botSection}
</svg>`
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
