// Template definitions for .NET image generator

export const TEMPLATES = {
  'blog-post': {
    id: 'blog-post',
    name: 'Blog Post Thumbnail',
    description: 'Blog post header with title, pill badge, logos, and decorative shapes',
    width: 1920,
    height: 1080,
    fields: [
      { id: 'pill', label: 'Pill / Badge', type: 'text', placeholder: 'April 2026', defaultValue: 'April 2026' },
      { id: 'title', label: 'Title', type: 'text', placeholder: '.NET 10.0.7 Update', defaultValue: '.NET 10.0.7 Update' },
      { id: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Out of Band Security Update', defaultValue: 'Out of Band Security Update' },
      { id: 'variant', label: 'Style', type: 'select', options: [
        { value: 'light', label: 'Light (pink/white)' },
        { value: 'dark', label: 'Dark (purple gradient)' },
      ], defaultValue: 'light' },
      { id: 'gradientStart', label: 'Gradient / Background Start', type: 'color', defaultValue: '#f5e6f0' },
      { id: 'gradientEnd', label: 'Gradient / Background End', type: 'color', defaultValue: '#fce4ec' },
      { id: 'logoImage', label: 'Logo Image', type: 'image', defaultValue: 'dotnet-bot.png' },
      { id: 'extraImages', label: 'Additional Images', type: 'imageList', defaultValue: [] },
    ],
  },
  'sourcebuild-email': {
    id: 'sourcebuild-email',
    name: 'Source Build Email Header',
    description: 'Email banner for .NET source build updates',
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
      { id: 'botImage', label: 'Bot / Mascot Image', type: 'image', defaultValue: 'dotnet-bot.png' },
      { id: 'extraImages', label: 'Additional Images', type: 'imageList', defaultValue: [] },
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
