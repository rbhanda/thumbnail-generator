// Generates SVG for the .NET Updates Email Header template
// White background, blue date, purple title, decorative shapes on right

export function generateEmailHeaderSvg(values, width = 1920, height = 640) {
  const {
    month = 'April',
    year = '2025',
    title = '.NET Updates',
    extraImages = [],
  } = values

  const scale = width / 1920
  const scaleH = height / 640
  const r = (v) => Math.round(v * scale)
  const rh = (v) => Math.round(v * scaleH)

  const dateText = `${month} ${year}`

  // .NET badge (dark blue rounded rect with ".NET" text)
  const badgeW = r(90)
  const badgeH = r(52)
  const badgeX = width - r(380)
  const badgeY = height - rh(160)
  const badgeSection = `
    <rect x="${badgeX}" y="${badgeY}" width="${badgeW}" height="${badgeH}" rx="${r(8)}" fill="#512bd4" />
    <text x="${badgeX + badgeW / 2}" y="${badgeY + badgeH / 2 + r(6)}" font-family="'Segoe UI', sans-serif" font-size="${r(18)}" font-weight="700" fill="#ffffff" text-anchor="middle">.NET</text>
  `

  // Extra uploaded images on far right
  const extraSection = extraImages.map((img, i) =>
    `<image href="${img}" x="${width - r(220) + i * r(120)}" y="${height - rh(200)}" width="${r(100)}" height="${r(100)}" preserveAspectRatio="xMidYMid meet" />`
  ).join('\n  ')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="magenta-sphere" cx="45%" cy="40%">
      <stop offset="0%" stop-color="#ff6ec7" />
      <stop offset="100%" stop-color="#d500f9" />
    </radialGradient>
    <radialGradient id="purple-sphere" cx="45%" cy="35%">
      <stop offset="0%" stop-color="#b388ff" />
      <stop offset="100%" stop-color="#7c4dff" />
    </radialGradient>
  </defs>

  <!-- White background -->
  <rect width="${width}" height="${height}" fill="#ffffff" />

  <!-- Date text (blue) -->
  <text x="${r(80)}" y="${rh(120)}" font-family="'Segoe UI', system-ui, sans-serif" font-size="${r(36)}" font-weight="600" fill="#2563eb">
    ${escapeXml(dateText)}
  </text>

  <!-- Title (purple) -->
  <text x="${r(80)}" y="${rh(240)}" font-family="'Segoe UI', system-ui, sans-serif" font-size="${r(96)}" font-weight="700" fill="#512bd4" letter-spacing="-1">
    ${escapeXml(title)}
  </text>

  <!-- Decorative shapes (right side) -->

  <!-- Pink/magenta blob top-right -->
  <ellipse cx="${width - r(180)}" cy="${rh(60)}" rx="${r(35)}" ry="${r(25)}" fill="#e91e90" opacity="0.7" transform="rotate(-30, ${width - r(180)}, ${rh(60)})" />

  <!-- Small pink circle top -->
  <circle cx="${width - r(320)}" cy="${rh(40)}" r="${r(12)}" fill="#ff80ab" opacity="0.6" />

  <!-- Purple capsule -->
  <rect x="${width - r(240)}" y="${rh(100)}" width="${r(60)}" height="${r(30)}" rx="${r(15)}" fill="#9c27b0" opacity="0.7" transform="rotate(-20, ${width - r(210)}, ${rh(115)})" />

  <!-- Blue checkmark / arrow shape -->
  <g transform="translate(${width - r(300)}, ${rh(200)}) scale(${scale}) rotate(-5)">
    <path d="M0,30 L25,55 L65,0 L55,0 L25,42 L10,27 Z" fill="#2196f3" opacity="0.9" />
  </g>

  <!-- Tilted purple square (outlined) -->
  <rect x="${width - r(180)}" y="${rh(280)}" width="${r(100)}" height="${r(100)}" rx="${r(10)}" fill="none" stroke="#7c4dff" stroke-width="${r(6)}" opacity="0.5" transform="rotate(15, ${width - r(130)}, ${rh(330)})" />

  <!-- .NET badge -->
  ${badgeSection}

  <!-- Large magenta sphere bottom-right -->
  <circle cx="${width - r(240)}" cy="${height - rh(100)}" r="${r(65)}" fill="url(#magenta-sphere)" opacity="0.9" />

  <!-- Small purple sphere -->
  <circle cx="${width - r(450)}" cy="${rh(150)}" r="${r(28)}" fill="url(#purple-sphere)" opacity="0.7" />

  <!-- Tiny accent dots -->
  <circle cx="${width - r(500)}" cy="${rh(70)}" r="${r(6)}" fill="#e91e90" opacity="0.5" />
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
