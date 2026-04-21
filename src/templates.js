// Template definitions for .NET image generator

export const TEMPLATES = {
  'email-header': {
    id: 'email-header',
    name: '.NET Updates Email Header',
    description: 'Email banner for .NET monthly updates',
    width: 1920,
    height: 640,
    fields: [
      { id: 'month', label: 'Month', type: 'text', placeholder: 'March', defaultValue: 'March' },
      { id: 'year', label: 'Year', type: 'text', placeholder: '2025', defaultValue: '2025' },
      { id: 'title', label: 'Title Text', type: 'text', placeholder: '.NET', defaultValue: '.NET' },
      { id: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Updates', defaultValue: 'Updates' },
      { id: 'gradientStart', label: 'Gradient Start', type: 'color', defaultValue: '#512bd4' },
      { id: 'gradientEnd', label: 'Gradient End', type: 'color', defaultValue: '#7b3ff2' },
      { id: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#ffffff' },
      { id: 'showBot', label: 'Show dotnet-bot', type: 'select', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ], defaultValue: 'yes' },
      { id: 'botImage', label: 'Bot / Mascot Image', type: 'image', defaultValue: null },
    ],
  },
  'twitter': {
    id: 'twitter',
    name: 'Twitter / X Post',
    description: 'Twitter post image (1200×675)',
    width: 1200,
    height: 675,
    fields: [
      { id: 'title', label: 'Title', type: 'text', placeholder: '.NET Updates', defaultValue: '.NET Updates' },
      { id: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'March 2025', defaultValue: 'March 2025' },
      { id: 'gradientStart', label: 'Gradient Start', type: 'color', defaultValue: '#512bd4' },
      { id: 'gradientEnd', label: 'Gradient End', type: 'color', defaultValue: '#7b3ff2' },
      { id: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#ffffff' },
      { id: 'logoImage', label: 'Logo Image', type: 'image', defaultValue: null },
    ],
  },
  'facebook': {
    id: 'facebook',
    name: 'Facebook Post',
    description: 'Facebook post image (1200×630)',
    width: 1200,
    height: 630,
    fields: [
      { id: 'title', label: 'Title', type: 'text', placeholder: '.NET Updates', defaultValue: '.NET Updates' },
      { id: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'March 2025', defaultValue: 'March 2025' },
      { id: 'gradientStart', label: 'Gradient Start', type: 'color', defaultValue: '#512bd4' },
      { id: 'gradientEnd', label: 'Gradient End', type: 'color', defaultValue: '#7b3ff2' },
      { id: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#ffffff' },
      { id: 'logoImage', label: 'Logo Image', type: 'image', defaultValue: null },
    ],
  },
  'youtube': {
    id: 'youtube',
    name: 'YouTube Thumbnail',
    description: 'YouTube thumbnail (1280×720)',
    width: 1280,
    height: 720,
    fields: [
      { id: 'title', label: 'Title', type: 'text', placeholder: '.NET Updates', defaultValue: '.NET Updates' },
      { id: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'March 2025', defaultValue: 'March 2025' },
      { id: 'gradientStart', label: 'Gradient Start', type: 'color', defaultValue: '#512bd4' },
      { id: 'gradientEnd', label: 'Gradient End', type: 'color', defaultValue: '#7b3ff2' },
      { id: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#ffffff' },
      { id: 'logoImage', label: 'Logo Image', type: 'image', defaultValue: null },
    ],
  },
  'bluesky': {
    id: 'bluesky',
    name: 'Bluesky Post',
    description: 'Bluesky post image (1200×675)',
    width: 1200,
    height: 675,
    fields: [
      { id: 'title', label: 'Title', type: 'text', placeholder: '.NET Updates', defaultValue: '.NET Updates' },
      { id: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'March 2025', defaultValue: 'March 2025' },
      { id: 'gradientStart', label: 'Gradient Start', type: 'color', defaultValue: '#512bd4' },
      { id: 'gradientEnd', label: 'Gradient End', type: 'color', defaultValue: '#7b3ff2' },
      { id: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#ffffff' },
      { id: 'logoImage', label: 'Logo Image', type: 'image', defaultValue: null },
    ],
  },
}

export function getTemplate(id) {
  return TEMPLATES[id] || null
}

export function getTemplateIds() {
  return Object.keys(TEMPLATES)
}

export function getDefaultValues(templateId) {
  const template = TEMPLATES[templateId]
  if (!template) return {}
  const values = {}
  template.fields.forEach(f => {
    values[f.id] = f.defaultValue
  })
  return values
}
