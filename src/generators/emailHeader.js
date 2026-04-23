// Generates SVG for the .NET Updates Email Header template
// 3 variants: dark (navy/purple), light (pink), white
// Shared decorative shapes on the right side

export function generateEmailHeaderSvg(values, width = 1920, height = 640) {
  const {
    month = 'April',
    year = '2025',
    title = '.NET Updates',
    subtitle = '',
    variant = 'dark',
    extraImages = [],
    fontFamily = "'Segoe UI', system-ui, sans-serif",
    titleBold = false,
    titleItalic = true,
  } = values

  // Sanitize image URLs to prevent script injection
  const safeHref = (url) => url && !url.match(/^\s*javascript:/i) ? url : ''

  const scale = width / 1920
  const scaleH = height / 640
  const r = (v) => Math.round(v * scale)
  const rh = (v) => Math.round(v * scaleH)

  const dateText = `${month} ${year}`

  // Variant-dependent colors
  const isDark = variant === 'dark'
  const bgColor = variant === 'light' ? '#f5e6f0' : '#ffffff'
  const dateColor = isDark ? '#4d9fff' : '#0066ff'
  const titleColor = isDark ? '#ffffff' : '#512bd4'
  const subtitleColor = isDark ? '#8dc8e8' : '#0066ff'
  const fontWeight = titleBold ? '700' : '300'
  const fontStyle = titleItalic ? 'italic' : 'normal'
  const safeFont = escapeXml(fontFamily)

  // .NET badge
  const badgeW = r(90)
  const badgeH = r(52)
  const badgeX = width - r(380)
  const badgeY = height - rh(160)
  const badgeSection = `
    <rect x="${badgeX}" y="${badgeY}" width="${badgeW}" height="${badgeH}" rx="${r(8)}" fill="#512bd4" />
    <text x="${badgeX + badgeW / 2}" y="${badgeY + badgeH / 2 + r(6)}" font-family="'Segoe UI', sans-serif" font-size="${r(18)}" font-weight="700" fill="#ffffff" text-anchor="middle">.NET</text>
  `

  // Subtitle (center-right area, only if provided)
  const subtitleSection = subtitle ? `
  <text x="${width * 0.52}" y="${rh(420)}" font-family="${safeFont}" font-size="${r(32)}" font-weight="400" font-style="${fontStyle}" fill="${subtitleColor}">
    ${escapeXml(subtitle)}
  </text>` : ''

  // Extra uploaded images
  const extraSection = extraImages.filter(Boolean).map(safeHref).filter(Boolean).map((img, i) =>
    `<image href="${img}" x="${width - r(220) + i * r(120)}" y="${height - rh(200)}" width="${r(100)}" height="${r(100)}" preserveAspectRatio="xMidYMid meet" />`
  ).join('\n  ')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    ${isDark ? `<linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a1040" />
      <stop offset="100%" stop-color="#3b1f8e" />
    </linearGradient>` : ''}
    <radialGradient id="magenta-sphere" cx="45%" cy="40%">
      <stop offset="0%" stop-color="#ff6ec7" />
      <stop offset="100%" stop-color="#d500f9" />
    </radialGradient>
    <radialGradient id="purple-sphere" cx="45%" cy="35%">
      <stop offset="0%" stop-color="#b388ff" />
      <stop offset="100%" stop-color="#7c4dff" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${isDark ? 'url(#bg-grad)' : bgColor}" />

  <!-- Date text -->
  <text x="${r(80)}" y="${rh(130)}" font-family="${safeFont}" font-size="${r(40)}" font-weight="600" fill="${dateColor}">
    ${escapeXml(dateText)}
  </text>

  <!-- Title -->
  <text x="${r(80)}" y="${rh(280)}" font-family="${safeFont}" font-size="${r(110)}" font-weight="${fontWeight}" font-style="${fontStyle}" fill="${titleColor}" letter-spacing="-1">
    ${escapeXml(title)}
  </text>

  <!-- Subtitle -->
  ${subtitleSection}

  <!-- Decorative shapes (right side) -->

  <!-- Pink/magenta blob top-right -->
  <ellipse cx="${width - r(180)}" cy="${rh(60)}" rx="${r(35)}" ry="${r(25)}" fill="#e91e90" opacity="0.8" transform="rotate(-30, ${width - r(180)}, ${rh(60)})" />

  <!-- Small pink capsule -->
  <rect x="${width - r(300)}" y="${rh(55)}" width="${r(40)}" height="${r(20)}" rx="${r(10)}" fill="#ff80ab" opacity="0.7" transform="rotate(-25, ${width - r(280)}, ${rh(65)})" />

  <!-- Purple capsule -->
  <rect x="${width - r(220)}" y="${rh(110)}" width="${r(60)}" height="${r(30)}" rx="${r(15)}" fill="#9c27b0" opacity="0.75" transform="rotate(-20, ${width - r(190)}, ${rh(125)})" />

  <!-- Blue checkmark -->
  <g transform="translate(${width - r(300)}, ${rh(190)}) scale(${scale * 1.2}) rotate(-5)">
    <path d="M0,30 L25,55 L65,0 L55,0 L25,42 L10,27 Z" fill="#2196f3" opacity="0.9" />
  </g>

  <!-- Tilted purple square (outlined) -->
  <rect x="${width - r(200)}" y="${rh(290)}" width="${r(120)}" height="${r(120)}" rx="${r(10)}" fill="none" stroke="#7c4dff" stroke-width="${r(6)}" opacity="0.55" transform="rotate(15, ${width - r(140)}, ${rh(350)})" />

  <!-- .NET badge -->
  ${badgeSection}

  <!-- Large magenta sphere bottom-right -->
  <circle cx="${width - r(250)}" cy="${height - rh(90)}" r="${r(65)}" fill="url(#magenta-sphere)" opacity="0.9" />

  <!-- Small purple sphere -->
  <circle cx="${width - r(430)}" cy="${rh(140)}" r="${r(30)}" fill="url(#purple-sphere)" opacity="0.75" />

  <!-- Tiny accent dots -->
  <circle cx="${width - r(490)}" cy="${rh(70)}" r="${r(6)}" fill="#e91e90" opacity="0.5" />
  <circle cx="${width - r(140)}" cy="${rh(200)}" r="${r(8)}" fill="#b388ff" opacity="0.4" />

  <!-- Extra images -->
  ${extraSection}
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
