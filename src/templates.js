// Template definitions for .NET image generator

export const FONT_OPTIONS = [
  { value: "'Segoe UI', system-ui, sans-serif", label: 'Segoe UI' },
  { value: "'Arial', Helvetica, sans-serif", label: 'Arial' },
  { value: "'Helvetica Neue', Helvetica, sans-serif", label: 'Helvetica Neue' },
  { value: "'Georgia', serif", label: 'Georgia' },
  { value: "'Times New Roman', Times, serif", label: 'Times New Roman' },
  { value: "'Verdana', Geneva, sans-serif", label: 'Verdana' },
  { value: "'Trebuchet MS', sans-serif", label: 'Trebuchet MS' },
  { value: "'Calibri', sans-serif", label: 'Calibri' },
  { value: "'Consolas', monospace", label: 'Consolas' },
]

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
      { id: 'fontFamily', label: 'Font', type: 'font', defaultValue: "'Segoe UI', system-ui, sans-serif" },
      { id: 'titleBold', label: 'Title Bold', type: 'toggle', defaultValue: true },
      { id: 'titleItalic', label: 'Title Italic', type: 'toggle', defaultValue: false },
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
      { id: 'variant', label: 'Style', type: 'select', options: [
        { value: 'dark', label: 'Dark (navy/purple gradient)' },
        { value: 'light', label: 'Light (pink)' },
        { value: 'white', label: 'White' },
      ], defaultValue: 'dark' },
      { id: 'month', label: 'Month', type: 'text', placeholder: 'April', defaultValue: 'April' },
      { id: 'year', label: 'Year', type: 'text', placeholder: '2025', defaultValue: '2025' },
      { id: 'title', label: 'Title Text', type: 'text', placeholder: '.NET Updates', defaultValue: '.NET Updates' },
      { id: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Out of Band Update', defaultValue: '' },
      { id: 'fontFamily', label: 'Font', type: 'font', defaultValue: "'Segoe UI', system-ui, sans-serif" },
      { id: 'titleBold', label: 'Title Bold', type: 'toggle', defaultValue: false },
      { id: 'titleItalic', label: 'Title Italic', type: 'toggle', defaultValue: true },
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
