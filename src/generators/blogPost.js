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

  const scale = width / 1920
  const edgeX = Math.round(75 * scale)
  const titleSize = Math.round(133 * scale)
  const subtitleSize = Math.round(75 * scale)
  const pillSize = Math.round(88 * scale)
  const pillHeight = Math.round(126 * scale)

  // Pill badge
  const pillPadX = Math.round(44 * scale)
  const pillWidth = pill ? pill.length * pillSize * 0.6 + pillPadX * 2 : 0
  const pillSection = pill ? `
    <rect x="${edgeX}" y="${Math.round(132 * scale)}" width="${pillWidth}" height="${pillHeight}" rx="${pillHeight / 2}" fill="rgba(141,200,232,0.9)" />
    <text x="${edgeX + pillWidth / 2}" y="${Math.round(132 * scale) + pillHeight / 2 + pillSize * 0.35}" font-family="'Segoe UI', sans-serif" font-size="${pillSize}" font-weight="600" fill="#000000" text-anchor="middle">
      ${escapeXml(pill)}
    </text>
  ` : ''

  // Title - constrain to left side when logos present
  const hasLogos = [logoImage, ...extraImages].filter(Boolean).length > 0
  const textMaxWidth = hasLogos ? width / 2 : width - edgeX * 2
  const maxCharsPerLine = Math.floor(textMaxWidth / (titleSize * 0.55))
  const titleLines = wrapText(title, maxCharsPerLine)
  const titleStartY = Math.round(444 * scale)
  const titleLineHeight = titleSize * 1.1
  const titleSection = titleLines.map((line, i) =>
    `<text x="${edgeX}" y="${titleStartY + i * titleLineHeight}" font-family="'Segoe UI', system-ui, sans-serif" font-size="${titleSize}" font-weight="700" fill="${textColor}" letter-spacing="-1">${escapeXml(line)}</text>`
  ).join('\n  ')

  // Subtitle at bottom
  const edgeY = Math.round(132 * scale)
  const subtitleSection = subtitle ? `
    <text x="${edgeX}" y="${height - edgeY}" font-family="'Segoe UI', system-ui, sans-serif" font-size="${subtitleSize}" font-weight="700" fill="${textColor}">
      ${escapeXml(subtitle)}
    </text>
  ` : ''

  // Logo circles on right side (large, like jongalloway style)
  const allLogos = [logoImage, ...extraImages].filter(Boolean)
  const logoCircleRadius = Math.round(205 * (width / 1920))
  const logoGap = (allLogos.length === 3 ? 18 : 24) * (width / 1920)
  const logoBaseX = width - Math.round(376 * (width / 1920))
  const stackHeight = allLogos.length > 0 ? (allLogos.length * 2 * logoCircleRadius) + ((allLogos.length - 1) * logoGap) : 0
  const logoTopY = allLogos.length > 1 ? Math.max(55, (height - stackHeight) / 2) + logoCircleRadius : height * 0.48
  const logoSpacing = (logoCircleRadius * 2) + logoGap
  const logoSection = allLogos.map((logo, i) => {
    const cy = allLogos.length > 1 ? logoTopY + i * logoSpacing : logoTopY
    const cx = logoBaseX
    const clipRadius = logoCircleRadius * 0.9
    const logoSize = clipRadius * Math.SQRT2 * 0.98
    return `
      <g transform="translate(${cx}, ${cy})">
        <circle cx="0" cy="0" r="${logoCircleRadius}" fill="white" />
        <clipPath id="logo-clip-${i}"><circle cx="0" cy="0" r="${clipRadius}" /></clipPath>
        <image href="${logo}" x="${-logoSize / 2}" y="${-logoSize / 2}" width="${logoSize}" height="${logoSize}" clip-path="url(#logo-clip-${i})" preserveAspectRatio="xMidYMid meet" />
      </g>
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
