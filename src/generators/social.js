// Generates SVG for social media post thumbnails (Twitter, Facebook, YouTube, Bluesky)
// Purple gradient with .NET branding, title, subtitle, and optional logo

export function generateSocialSvg(values, width = 1200, height = 675, platform = '') {
  const {
    title = '.NET Updates',
    subtitle = 'March 2025',
    gradientStart = '#512bd4',
    gradientEnd = '#7b3ff2',
    textColor = '#ffffff',
    logoImage = null,
  } = values

  const titleSize = width > 1200 ? 72 : 60
  const subtitleSize = width > 1200 ? 36 : 30
  const centerX = width / 2
  const centerY = height / 2

  const logoSrc = logoImage || 'dotnet-bot.png'
  const logoSection = `
    <image href="${logoSrc}" x="${centerX - 50}" y="${centerY - 140}" width="100" height="100" preserveAspectRatio="xMidYMid meet" />
  `

  // Platform badge (subtle, bottom-right)
  const platformBadge = platform ? `
    <text x="${width - 40}" y="${height - 30}" font-family="'Segoe UI', sans-serif" font-size="16" fill="${textColor}" opacity="0.3" text-anchor="end">${escapeXml(platform)}</text>
  ` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradientStart}" />
      <stop offset="100%" stop-color="${gradientEnd}" />
    </linearGradient>
    <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.06)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg-grad)" />

  <!-- Decorative glows -->
  <circle cx="${width * 0.2}" cy="${height * 0.3}" r="${height * 0.4}" fill="url(#glow1)" />
  <circle cx="${width * 0.8}" cy="${height * 0.7}" r="${height * 0.5}" fill="url(#glow1)" />

  <!-- Dot pattern -->
  <g opacity="0.05">
    ${Array.from({ length: 15 }, (_, i) =>
      Array.from({ length: 8 }, (_, j) =>
        `<circle cx="${80 + i * 80}" cy="${50 + j * 85}" r="2" fill="${textColor}" />`
      ).join('')
    ).join('')}
  </g>

  <!-- Logo -->
  ${logoSection}

  <!-- Title -->
  <text x="${centerX}" y="${centerY + 30}" font-family="'Segoe UI', system-ui, -apple-system, sans-serif" font-size="${titleSize}" font-weight="700" fill="${textColor}" text-anchor="middle" letter-spacing="-1">
    ${escapeXml(title)}
  </text>

  <!-- Subtitle -->
  <text x="${centerX}" y="${centerY + 30 + subtitleSize + 12}" font-family="'Segoe UI', system-ui, -apple-system, sans-serif" font-size="${subtitleSize}" font-weight="400" fill="${textColor}" text-anchor="middle" opacity="0.85">
    ${escapeXml(subtitle)}
  </text>

  <!-- Bottom .NET mark -->
  <g transform="translate(40, ${height - 50})" opacity="0.4">
    <circle cx="8" cy="-8" r="4" fill="${textColor}" />
    <text x="18" y="0" font-family="'Segoe UI', sans-serif" font-size="16" fill="${textColor}" font-weight="600">NET</text>
  </g>

  ${platformBadge}
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
