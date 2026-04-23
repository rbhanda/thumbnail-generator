// Generates SVG for blog post thumbnails
// Two styles: light (pink/white bg) and dark (purple gradient)
// Features: pill badge, title, subtitle, logo in white circle, decorative geometric shapes

export function generateBlogPostSvg(values, width = 1920, height = 1080) {
  const {
    title = '.NET 10.0.7 Update',
    subtitle = 'Out of Band Security Update',
    pill = 'April 2026',
    variant = 'light',
    gradientStart = '#f5e6f0',
    gradientEnd = '#fce4ec',
    logoImage = null,
    extraImages = [],
  } = values

  const scale = width / 1920
  const edgeX = Math.round(75 * scale)

  // Style-dependent colors
  const isLight = variant === 'light'
  const textColor = isLight ? '#1a1a2e' : '#ffffff'
  const pillBg = isLight ? '#2563eb' : '#8dc8e8'
  const pillText = isLight ? '#ffffff' : '#000000'
  const bgStart = isLight ? gradientStart : (gradientStart === '#f5e6f0' ? '#2d1b69' : gradientStart)
  const bgEnd = isLight ? gradientEnd : (gradientEnd === '#fce4ec' ? '#512bd4' : gradientEnd)

  // Pill badge
  const pillSize = Math.round(56 * scale)
  const pillHeight = Math.round(80 * scale)
  const pillPadX = Math.round(36 * scale)
  const pillWidth = pill ? pill.length * pillSize * 0.58 + pillPadX * 2 : 0
  const pillY = Math.round(80 * scale)
  const pillSection = pill ? `
    <rect x="${edgeX}" y="${pillY}" width="${pillWidth}" height="${pillHeight}" rx="${pillHeight / 2}" fill="${pillBg}" />
    <text x="${edgeX + pillWidth / 2}" y="${pillY + pillHeight / 2 + pillSize * 0.35}" font-family="'Segoe UI', sans-serif" font-size="${pillSize}" font-weight="600" fill="${pillText}" text-anchor="middle">
      ${escapeXml(pill)}
    </text>
  ` : ''

  // Title
  const titleSize = Math.round(120 * scale)
  const titleLineHeight = titleSize * 1.15
  const hasLogos = [logoImage, ...extraImages].filter(Boolean).length > 0
  const textMaxWidth = hasLogos ? width * 0.52 : width - edgeX * 2
  const maxCharsPerLine = Math.floor(textMaxWidth / (titleSize * 0.52))
  const titleLines = wrapText(title, maxCharsPerLine)
  const titleStartY = pill ? pillY + pillHeight + Math.round(40 * scale) + titleSize : Math.round(160 * scale) + titleSize
  const titleSection = titleLines.map((line, i) =>
    `<text x="${edgeX}" y="${titleStartY + i * titleLineHeight}" font-family="'Segoe UI', system-ui, sans-serif" font-size="${titleSize}" font-weight="800" fill="${textColor}" letter-spacing="-2">${escapeXml(line)}</text>`
  ).join('\n  ')

  // Subtitle at bottom-left
  const subtitleSize = Math.round(48 * scale)
  const subtitleY = height - Math.round(100 * scale)
  const subtitleMaxChars = Math.floor(textMaxWidth / (subtitleSize * 0.5))
  const subtitleLines = wrapText(subtitle, subtitleMaxChars)
  const subtitleSection = subtitle ? subtitleLines.map((line, i) =>
    `<text x="${edgeX}" y="${subtitleY + i * (subtitleSize * 1.2)}" font-family="'Segoe UI', system-ui, sans-serif" font-size="${subtitleSize}" font-weight="600" fill="${textColor}" opacity="0.8">${escapeXml(line)}</text>`
  ).join('\n  ') : ''

  // Logo in white circle on right side
  const allLogos = [logoImage, ...extraImages].filter(Boolean)
  const logoCircleRadius = Math.round(140 * scale)
  const logoCenterX = width - Math.round(380 * scale)
  const logoCenterY = Math.round(height * 0.42)
  const logoSection = allLogos.length > 0 ? allLogos.map((logo, i) => {
    const cx = logoCenterX + (i === 1 ? Math.round(180 * scale) : i === 2 ? Math.round(90 * scale) : 0)
    const cy = logoCenterY + (i === 1 ? Math.round(200 * scale) : i === 2 ? Math.round(-150 * scale) : 0)
    const r = i === 0 ? logoCircleRadius : Math.round(logoCircleRadius * 0.7)
    const clipR = r * 0.88
    const imgSize = clipR * Math.SQRT2 * 0.95
    return `
      <g>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="white" />
        <clipPath id="logo-clip-${i}"><circle cx="${cx}" cy="${cy}" r="${clipR}" /></clipPath>
        <image href="${logo}" x="${cx - imgSize / 2}" y="${cy - imgSize / 2}" width="${imgSize}" height="${imgSize}" clip-path="url(#logo-clip-${i})" preserveAspectRatio="xMidYMid meet" />
      </g>`
  }).join('\n  ') : ''

  // Decorative shapes
  const shapes = isLight ? generateLightShapes(width, height, scale) : generateDarkShapes(width, height, scale)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgStart}" />
      <stop offset="100%" stop-color="${bgEnd}" />
    </linearGradient>
    ${!isLight ? `<radialGradient id="magenta-glow" cx="40%" cy="35%">
      <stop offset="0%" stop-color="#ff6ec7" />
      <stop offset="100%" stop-color="#d500f9" />
    </radialGradient>` : ''}
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" rx="${Math.round(32 * scale)}" fill="url(#bg-grad)" />

  <!-- Decorative shapes -->
  ${shapes}

  <!-- Pill badge -->
  ${pillSection}

  <!-- Title -->
  ${titleSection}

  <!-- Subtitle -->
  ${subtitleSection}

  <!-- Logo -->
  ${logoSection}
</svg>`
}

function generateLightShapes(width, height, scale) {
  const r = (v) => Math.round(v * scale)
  return `
    <!-- Pink blob top-right -->
    <ellipse cx="${width - r(500)}" cy="${r(180)}" rx="${r(60)}" ry="${r(45)}" fill="#e91e90" opacity="0.6" transform="rotate(-20, ${width - r(500)}, ${r(180)})" />

    <!-- Purple circle bottom-right -->
    <circle cx="${width - r(300)}" cy="${height - r(200)}" r="${r(80)}" fill="#9c27b0" opacity="0.85" />

    <!-- Purple rounded square, tilted -->
    <rect x="${width - r(220)}" y="${height - r(380)}" width="${r(160)}" height="${r(160)}" rx="${r(24)}" fill="none" stroke="#512bd4" stroke-width="${r(8)}" opacity="0.5" transform="rotate(15, ${width - r(140)}, ${height - r(300)})" />

    <!-- Overlapping tilted square -->
    <rect x="${width - r(180)}" y="${height - r(320)}" width="${r(120)}" height="${r(120)}" rx="${r(18)}" fill="none" stroke="#512bd4" stroke-width="${r(6)}" opacity="0.35" transform="rotate(-10, ${width - r(120)}, ${height - r(260)})" />

    <!-- Small accent circle -->
    <circle cx="${width - r(150)}" cy="${r(350)}" r="${r(20)}" fill="#e91e90" opacity="0.4" />
  `
}

function generateDarkShapes(width, height, scale) {
  const r = (v) => Math.round(v * scale)
  return `
    <!-- Blue arrow / chevron -->
    <g transform="translate(${r(500)}, ${height - r(400)}) rotate(-15)">
      <path d="M0,${r(40)} L${r(80)},0 L${r(100)},${r(20)} L${r(40)},${r(50)} L${r(100)},${r(80)} L${r(80)},${r(100)} Z" fill="#2196f3" opacity="0.9" />
    </g>

    <!-- Large magenta sphere -->
    <circle cx="${width * 0.55}" cy="${height - r(200)}" r="${r(160)}" fill="url(#magenta-glow)" opacity="0.9" />

    <!-- Small red dot -->
    <circle cx="${r(480)}" cy="${height - r(350)}" r="${r(16)}" fill="#ff1744" opacity="0.8" />

    <!-- Purple tilted square bottom-right -->
    <rect x="${width - r(350)}" y="${height - r(250)}" width="${r(150)}" height="${r(150)}" rx="${r(16)}" fill="#7c4dff" opacity="0.5" transform="rotate(20, ${width - r(275)}, ${height - r(175)})" />

    <!-- Lilac shape bottom-left -->
    <rect x="${r(200)}" y="${height - r(200)}" width="${r(100)}" height="${r(80)}" rx="${r(30)}" fill="#b388ff" opacity="0.4" transform="rotate(-25, ${r(250)}, ${height - r(160)})" />

    <!-- Subtle bg circles -->
    <circle cx="${width - r(200)}" cy="${r(300)}" r="${r(100)}" fill="rgba(255,255,255,0.03)" />
  `
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
