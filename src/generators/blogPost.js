// Generates SVG for blog post thumbnails (similar to jongalloway style)
// Features: title, subtitle, pill/badge, logos on right side

export function generateBlogPostSvg(values, width = 1920, height = 1080) {
  const {
    title = 'Blog Post Title',
    subtitle = '',
    pill = '.NET',
    gradientStart = '#512bd4',
    gradientEnd = '#7b3ff2',
    textColor = '#ffffff',
    logoImage = null,
    extraImages = [],
  } = values

  const titleSize = Math.round(width * 0.042)
  const subtitleSize = Math.round(titleSize * 0.5)
  const pillSize = Math.round(titleSize * 0.35)

  // Pill badge
  const pillWidth = pill.length * pillSize * 0.65 + 40
  const pillSection = pill ? `
    <rect x="100" y="100" width="${pillWidth}" height="${pillSize + 24}" rx="${(pillSize + 24) / 2}" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
    <text x="${100 + pillWidth / 2}" y="${100 + pillSize + 4}" font-family="'Segoe UI', sans-serif" font-size="${pillSize}" font-weight="600" fill="${textColor}" text-anchor="middle">
      ${escapeXml(pill)}
    </text>
  ` : ''

  // Title - wrap long text (rough wrapping at ~30 chars per line)
  const maxCharsPerLine = Math.floor(width * 0.55 / (titleSize * 0.55))
  const titleLines = wrapText(title, maxCharsPerLine)
  const titleStartY = pill ? 200 : 140
  const titleSection = titleLines.map((line, i) =>
    `<text x="100" y="${titleStartY + i * (titleSize + 10)}" font-family="'Segoe UI', system-ui, sans-serif" font-size="${titleSize}" font-weight="700" fill="${textColor}" letter-spacing="-1">${escapeXml(line)}</text>`
  ).join('\n  ')

  // Subtitle at bottom
  const subtitleSection = subtitle ? `
    <text x="100" y="${height - 80}" font-family="'Segoe UI', system-ui, sans-serif" font-size="${subtitleSize}" font-weight="400" fill="${textColor}" opacity="0.75">
      ${escapeXml(subtitle)}
    </text>
  ` : ''

  // Logo circles on right side
  const allLogos = [logoImage, ...extraImages].filter(Boolean)
  const logoCircleSize = Math.min(120, Math.round(height * 0.16))
  const logoStartY = height / 2 - (allLogos.length * (logoCircleSize + 20)) / 2
  const logoSection = allLogos.map((logo, i) => {
    const cy = logoStartY + i * (logoCircleSize + 20) + logoCircleSize / 2
    const cx = width - 160
    return `
      <circle cx="${cx}" cy="${cy}" r="${logoCircleSize / 2 + 10}" fill="rgba(255,255,255,0.95)" />
      <image href="${logo}" x="${cx - logoCircleSize / 2}" y="${cy - logoCircleSize / 2}" width="${logoCircleSize}" height="${logoCircleSize}" preserveAspectRatio="xMidYMid meet" clip-path="circle(${logoCircleSize / 2}px at ${logoCircleSize / 2}px ${logoCircleSize / 2}px)" />
    `
  }).join('\n  ')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradientStart}" />
      <stop offset="100%" stop-color="${gradientEnd}" />
    </linearGradient>
    <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.07)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg-grad)" />

  <!-- Decorative glows -->
  <circle cx="${width * 0.1}" cy="${height * 0.2}" r="${height * 0.4}" fill="url(#glow1)" />
  <circle cx="${width * 0.75}" cy="${height * 0.8}" r="${height * 0.5}" fill="url(#glow1)" />

  <!-- Dot pattern -->
  <g opacity="0.04">
    ${Array.from({ length: Math.floor(width / 90) }, (_, i) =>
      Array.from({ length: Math.floor(height / 90) }, (_, j) =>
        `<circle cx="${60 + i * 90}" cy="${60 + j * 90}" r="2" fill="${textColor}" />`
      ).join('')
    ).join('')}
  </g>

  <!-- Pill badge -->
  ${pillSection}

  <!-- Title -->
  ${titleSection}

  <!-- Subtitle -->
  ${subtitleSection}

  <!-- Logos -->
  ${logoSection}

  <!-- .NET mark -->
  <g transform="translate(100, ${height - 40})" opacity="0.35">
    <circle cx="6" cy="-6" r="3.5" fill="${textColor}" />
    <text x="14" y="0" font-family="'Segoe UI', sans-serif" font-size="14" fill="${textColor}" font-weight="600">NET</text>
  </g>
</svg>`
}

function wrapText(text, maxChars) {
  if (text.length <= maxChars) return [text]
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    if (current.length + word.length + 1 > maxChars && current.length > 0) {
      lines.push(current)
      current = word
    } else {
      current = current ? `${current} ${word}` : word
    }
  }
  if (current) lines.push(current)
  return lines
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
