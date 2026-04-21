import { useState, useCallback, useRef } from 'react'
import { TEMPLATES, getTemplate, getDefaultValues, getTemplateIds } from './templates'
import { generateEmailHeaderSvg } from './generators/emailHeader'
import { generateSocialSvg } from './generators/social'

const BASE = import.meta.env.BASE_URL

// Resolve default image filenames (like "dotnet-bot.png") to full URLs
function resolveImageValues(values, fields) {
  const resolved = { ...values }
  for (const field of fields) {
    if (field.type === 'image' && resolved[field.id] && !resolved[field.id].startsWith('data:') && !resolved[field.id].startsWith('http') && !resolved[field.id].startsWith('/')) {
      resolved[field.id] = `${BASE}${resolved[field.id]}`
    }
  }
  return resolved
}

const PLATFORM_MAP = {
  'twitter': 'Twitter / X',
  'facebook': 'Facebook',
  'youtube': 'YouTube',
  'bluesky': 'Bluesky',
}

function getSvg(templateId, values) {
  const tmpl = getTemplate(templateId)
  if (!tmpl) return ''
  const resolved = resolveImageValues(values, tmpl.fields)
  if (templateId === 'email-header') {
    return generateEmailHeaderSvg(resolved, tmpl.width, tmpl.height)
  }
  return generateSocialSvg(resolved, tmpl.width, tmpl.height, PLATFORM_MAP[templateId] || '')
}

function App() {
  const [templateId, setTemplateId] = useState(getTemplateIds()[0])
  const [values, setValues] = useState(() => getDefaultValues(getTemplateIds()[0]))
  const [exportFormat, setExportFormat] = useState('jpg')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const template = getTemplate(templateId)
  const svgString = getSvg(templateId, values)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const handleTemplateChange = useCallback((newId) => {
    setTemplateId(newId)
    setValues(getDefaultValues(newId))
  }, [])

  const handleFieldChange = useCallback((fieldId, value) => {
    setValues(prev => ({ ...prev, [fieldId]: value }))
  }, [])

  const handleImageUpload = useCallback((fieldId, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      handleFieldChange(fieldId, e.target.result)
    }
    reader.readAsDataURL(file)
  }, [handleFieldChange])

  const exportImage = useCallback(async (format) => {
    try {
      const tmpl = getTemplate(templateId)
      const canvas = document.createElement('canvas')
      canvas.width = tmpl.width
      canvas.height = tmpl.height
      const ctx = canvas.getContext('2d')

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      const img = new Image()

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = url
      })

      ctx.drawImage(img, 0, 0, tmpl.width, tmpl.height)
      URL.revokeObjectURL(url)

      const mimeMap = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }
      const mime = mimeMap[format] || 'image/jpeg'
      const dataUrl = canvas.toDataURL(mime, 0.95)

      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${tmpl.id}-${values.month || values.title || 'image'}.${format}`
      a.click()
      showToast(`Exported as ${format.toUpperCase()}`)
    } catch {
      showToast('Export failed', 'error')
    }
  }, [templateId, svgString, values, showToast])

  const exportSvg = useCallback(() => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${templateId}-${values.month || values.title || 'image'}.svg`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Exported as SVG')
  }, [svgString, templateId, values, showToast])

  const renderField = (field) => {
    const value = values[field.id]

    if (field.type === 'color') {
      return (
        <div key={field.id} className="control-group">
          <label htmlFor={`field-${field.id}`}>{field.label}</label>
          <div className="color-row">
            <input
              type="color"
              id={`field-${field.id}`}
              value={value || '#512bd4'}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder="#512bd4"
            />
          </div>
        </div>
      )
    }

    if (field.type === 'select') {
      return (
        <div key={field.id} className="control-group">
          <label htmlFor={`field-${field.id}`}>{field.label}</label>
          <select
            id={`field-${field.id}`}
            value={value || field.defaultValue}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          >
            {field.options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )
    }

    if (field.type === 'image') {
      const previewSrc = value && (value.startsWith('data:') || value.startsWith('http') || value.startsWith('/'))
        ? value
        : value ? `${BASE}${value}` : null
      const isCustomUpload = value && value.startsWith('data:')
      return (
        <div key={field.id} className="control-group">
          <label>{field.label}</label>
          <div className="image-upload-group">
            <label className="upload-btn" htmlFor={`file-${field.id}`}>
              Choose File
            </label>
            <input
              type="file"
              id={`file-${field.id}`}
              accept="image/*"
              onChange={(e) => handleImageUpload(field.id, e.target.files[0])}
            />
            {previewSrc && <img src={previewSrc} alt="Preview" className="image-preview" />}
            {isCustomUpload && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: '4px', padding: '4px 10px', fontSize: '0.8rem' }}
                onClick={() => handleFieldChange(field.id, field.defaultValue || null)}
              >
                Reset to default
              </button>
            )}
          </div>
        </div>
      )
    }

    if (field.type === 'imageList') {
      const images = value || []
      return (
        <div key={field.id} className="control-group">
          <label>{field.label}</label>
          <div className="image-upload-group">
            <label className="upload-btn" htmlFor={`file-${field.id}`}>
              Add Image
            </label>
            <input
              type="file"
              id={`file-${field.id}`}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = (ev) => {
                  handleFieldChange(field.id, [...images, ev.target.result])
                }
                reader.readAsDataURL(file)
                e.target.value = ''
              }}
            />
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {images.map((img, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={img} alt={`Extra ${i + 1}`} className="image-preview" />
                    <button
                      type="button"
                      style={{
                        position: 'absolute', top: '-6px', right: '-6px',
                        background: '#d32f2f', color: '#fff', border: 'none',
                        borderRadius: '50%', width: '20px', height: '20px',
                        fontSize: '12px', cursor: 'pointer', lineHeight: '1',
                      }}
                      onClick={() => handleFieldChange(field.id, images.filter((_, idx) => idx !== i))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <small className="helper-text">Add logos, icons, or other images to the thumbnail</small>
          </div>
        </div>
      )
    }

    // Default: text
    return (
      <div key={field.id} className="control-group">
        <label htmlFor={`field-${field.id}`}>{field.label}</label>
        <input
          type="text"
          id={`field-${field.id}`}
          value={value || ''}
          onChange={(e) => handleFieldChange(field.id, e.target.value)}
          placeholder={field.placeholder}
        />
      </div>
    )
  }

  return (
    <div className="container">
      <header className="header">
        <h1>.NET Image Generator</h1>
        <p className="subtitle">Generate email headers and social media thumbnails</p>
      </header>

      <main className="editor">
        <section className="controls">
          {/* Template selector */}
          <div className="control-group">
            <label htmlFor="template-select">Template</label>
            <select
              id="template-select"
              value={templateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
            >
              {getTemplateIds().map(id => (
                <option key={id} value={id}>{TEMPLATES[id].name}</option>
              ))}
            </select>
            {template && <small className="helper-text">{template.description} ({template.width}×{template.height})</small>}
          </div>

          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />

          {/* Template fields */}
          {template?.fields.map(f => renderField(f))}

          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />

          {/* Export */}
          <div className="control-group">
            <label htmlFor="format-select">Export Format</label>
            <select
              id="format-select"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WEBP</option>
            </select>
          </div>

          <div className="export-actions">
            <button type="button" className="btn btn-primary" onClick={() => exportImage(exportFormat)}>
              Export as {exportFormat.toUpperCase()}
            </button>
            <button type="button" className="btn btn-secondary" onClick={exportSvg}>
              Export as SVG
            </button>
          </div>
        </section>

        <section className="preview-section">
          <div className="preview-container" dangerouslySetInnerHTML={{ __html: svgString }} />
        </section>
      </main>

      <footer className="footer">
        <p>
          .NET Image Generator •{' '}
          <a href="https://github.com/rbhanda/thumbnail-generator" target="_blank" rel="noreferrer">GitHub</a>
        </p>
      </footer>

      {toast && (
        <div className={`toast ${toast.type}`} role="alert">
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default App
