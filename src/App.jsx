import { useState, useCallback, useRef } from 'react'
import { TEMPLATES, getTemplate, getDefaultValues, getTemplateIds } from './templates'
import { generateEmailHeaderSvg } from './generators/emailHeader'
import { generateBlogPostSvg } from './generators/blogPost'

const BASE = import.meta.env.BASE_URL

// Sanitize a string for use in filenames
function sanitizeFilename(str) {
  return String(str).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100)
}

// Validate that an image URL is safe (data: URI or same-origin path)
function isSafeImageUrl(url) {
  if (!url) return false
  if (url.startsWith('data:image/')) return true
  if (url.startsWith('/') || url.startsWith('./')) return true
  try {
    const parsed = new URL(url, window.location.origin)
    return parsed.origin === window.location.origin
  } catch {
    return false
  }
}

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

function getSvg(templateId, values, exportWidth, exportHeight) {
  const tmpl = getTemplate(templateId)
  if (!tmpl) return ''
  const resolved = resolveImageValues(values, tmpl.fields)
  const w = exportWidth || tmpl.width
  const h = exportHeight || tmpl.height
  if (templateId === 'blog-post') {
    return generateBlogPostSvg(resolved, w, h)
  }
  return generateEmailHeaderSvg(resolved, w, h)
}

function App() {
  const [templateId, setTemplateId] = useState(getTemplateIds()[0])
  const [values, setValues] = useState(() => getDefaultValues(getTemplateIds()[0]))
  const [exportFormat, setExportFormat] = useState('jpg')
  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const template = getTemplate(templateId)
  const exportWidth = parseInt(customWidth, 10) || template?.width || 1920
  const exportHeight = parseInt(customHeight, 10) || template?.height || 1080
  const svgString = getSvg(templateId, values, exportWidth, exportHeight)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const handleTemplateChange = useCallback((newId) => {
    setTemplateId(newId)
    setValues(getDefaultValues(newId))
    setCustomWidth('')
    setCustomHeight('')
  }, [])

  const handleFieldChange = useCallback((fieldId, value) => {
    setValues(prev => ({ ...prev, [fieldId]: value }))
  }, [])

  const handleImageUpload = useCallback((fieldId, file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Only image files are allowed', 'error')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image must be under 10MB', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      handleFieldChange(fieldId, e.target.result)
    }
    reader.readAsDataURL(file)
  }, [handleFieldChange, showToast])

  const exportImage = useCallback(async (format) => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = exportWidth
      canvas.height = exportHeight
      const ctx = canvas.getContext('2d')

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      const img = new Image()

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = url
      })

      ctx.drawImage(img, 0, 0, exportWidth, exportHeight)
      URL.revokeObjectURL(url)

      const mimeMap = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }
      const mime = mimeMap[format] || 'image/jpeg'
      const dataUrl = canvas.toDataURL(mime, 0.95)

      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${sanitizeFilename(templateId)}-${sanitizeFilename(values.month || values.title || 'image')}-${exportWidth}x${exportHeight}.${format}`
      a.click()
      showToast(`Exported as ${format.toUpperCase()}`)
    } catch {
      showToast('Export failed', 'error')
    }
  }, [templateId, svgString, values, showToast, exportWidth, exportHeight])

  const exportSvg = useCallback(() => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sanitizeFilename(templateId)}-${sanitizeFilename(values.month || values.title || 'image')}.svg`
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
      return (
        <div key={field.id} className="control-group">
          <label>{field.label}</label>
          <div className="image-upload-group">
            <label className="upload-btn" htmlFor={`file-${field.id}`}>
              {value ? 'Replace' : 'Choose File'}
            </label>
            <input
              type="file"
              id={`file-${field.id}`}
              accept="image/*"
              onChange={(e) => handleImageUpload(field.id, e.target.files[0])}
            />
            {previewSrc && <img src={previewSrc} alt="Preview" className="image-preview" />}
            {value && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  onClick={() => handleFieldChange(field.id, null)}
                >
                  Remove
                </button>
                {field.defaultValue && value !== field.defaultValue && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                    onClick={() => handleFieldChange(field.id, field.defaultValue)}
                  >
                    Reset default
                  </button>
                )}
              </div>
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
                if (!file.type.startsWith('image/')) return
                if (file.size > 10 * 1024 * 1024) return
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
            {template && <small className="helper-text">{template.description}</small>}
          </div>

          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />

          {/* Template fields */}
          {template?.fields.map(f => renderField(f))}

          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />

          {/* Export */}
          <div className="control-group">
            <label>Export Size (px)</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="number"
                placeholder={String(template?.width || 1920)}
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                style={{ width: '90px' }}
                min="100"
                max="7680"
              />
              <span style={{ color: 'var(--color-text-muted)' }}>×</span>
              <input
                type="number"
                placeholder={String(template?.height || 1080)}
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                style={{ width: '90px' }}
                min="100"
                max="4320"
              />
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
              {[
                { label: '1920×1080', w: 1920, h: 1080 },
                { label: '1200×630', w: 1200, h: 630 },
                { label: '1280×720', w: 1280, h: 720 },
                { label: '800×418', w: 800, h: 418 },
                { label: '600×315', w: 600, h: 315 },
              ].map(p => (
                <button
                  key={p.label}
                  type="button"
                  style={{
                    padding: '2px 8px', fontSize: '0.75rem',
                    background: (exportWidth === p.w && exportHeight === p.h) ? 'var(--color-primary)' : 'var(--color-border)',
                    color: 'var(--color-text)', border: 'none', borderRadius: '4px', cursor: 'pointer',
                  }}
                  onClick={() => { setCustomWidth(String(p.w)); setCustomHeight(String(p.h)) }}
                >
                  {p.label}
                </button>
              ))}
              <button
                type="button"
                style={{
                  padding: '2px 8px', fontSize: '0.75rem',
                  background: (!customWidth && !customHeight) ? 'var(--color-primary)' : 'var(--color-border)',
                  color: 'var(--color-text)', border: 'none', borderRadius: '4px', cursor: 'pointer',
                }}
                onClick={() => { setCustomWidth(''); setCustomHeight('') }}
              >
                Default
              </button>
            </div>
            <small className="helper-text">Current: {exportWidth}×{exportHeight}</small>
          </div>

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
          {templateId === 'blog-post' ? (
            <>
              <div style={{ marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Light</div>
              <div className="preview-container" dangerouslySetInnerHTML={{ __html: getSvg(templateId, { ...values, variant: 'light' }, exportWidth, exportHeight) }} />
              <div style={{ margin: '16px 0 8px', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Dark</div>
              <div className="preview-container" dangerouslySetInnerHTML={{ __html: getSvg(templateId, { ...values, variant: 'dark' }, exportWidth, exportHeight) }} />
            </>
          ) : templateId === 'sourcebuild-email' ? (
            <>
              <div style={{ marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Dark</div>
              <div className="preview-container" dangerouslySetInnerHTML={{ __html: getSvg(templateId, { ...values, variant: 'dark' }, exportWidth, exportHeight) }} />
              <div style={{ margin: '16px 0 8px', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Light (Pink)</div>
              <div className="preview-container" dangerouslySetInnerHTML={{ __html: getSvg(templateId, { ...values, variant: 'light' }, exportWidth, exportHeight) }} />
              <div style={{ margin: '16px 0 8px', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>White</div>
              <div className="preview-container" dangerouslySetInnerHTML={{ __html: getSvg(templateId, { ...values, variant: 'white' }, exportWidth, exportHeight) }} />
            </>
          ) : (
            <div className="preview-container" dangerouslySetInnerHTML={{ __html: svgString }} />
          )}
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
