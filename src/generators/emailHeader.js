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

  const displayText = `${title} ${subtitle}`
  const dateText = `${month} ${year}`

  // dotnet-bot SVG inline (simplified)
  const botSection = showBot === 'yes' ? `
    <g transform="translate(${width - 320}, ${height / 2 - 180})">
      ${botImage
        ? `<image href="${botImage}" x="0" y="0" width="280" height="360" preserveAspectRatio="xMidYMid meet" />`
        : `
        <!-- Default dotnet-bot placeholder -->
        <rect x="80" y="40" width="120" height="140" rx="60" fill="rgba(255,255,255,0.15)" />
        <circle cx="120" cy="90" r="12" fill="${textColor}" opacity="0.8" />
        <circle cx="160" cy="90" r="12" fill="${textColor}" opacity="0.8" />
        <rect x="90" y="180" width="100" height="120" rx="10" fill="rgba(255,255,255,0.15)" />
        <rect x="70" y="200" width="30" height="80" rx="8" fill="rgba(255,255,255,0.12)" />
        <rect x="180" y="200" width="30" height="80" rx="8" fill="rgba(255,255,255,0.12)" />
        <rect x="100" y="300" width="35" height="60" rx="6" fill="rgba(255,255,255,0.12)" />
        <rect x="145" y="300" width="35" height="60" rx="6" fill="rgba(255,255,255,0.12)" />
        `
      }
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
  <text x="120" y="${height / 2 - 40}" font-family="'Segoe UI', system-ui, -apple-system, sans-serif" font-size="120" font-weight="700" fill="${textColor}" letter-spacing="-2">
    ${escapeXml(displayText)}
  </text>

  <!-- Date -->
  <text x="120" y="${height / 2 + 60}" font-family="'Segoe UI', system-ui, -apple-system, sans-serif" font-size="56" font-weight="400" fill="${textColor}" opacity="0.85">
    ${escapeXml(dateText)}
  </text>

  <!-- .NET logo mark -->
  <g transform="translate(120, ${height - 80})" opacity="0.5">
    <circle cx="12" cy="-12" r="6" fill="${textColor}" />
    <text x="26" y="0" font-family="'Segoe UI', sans-serif" font-size="24" fill="${textColor}" font-weight="600">NET</text>
  </g>

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
