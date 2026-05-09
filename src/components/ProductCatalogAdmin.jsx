import { useCallback, useEffect, useMemo, useState } from 'react'
import { PRODUCT_CATEGORIES } from '../data/products'
import ProductCatalogImage from './ProductCatalogImage'
import './ProductCatalogAdmin.css'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => {
      const s = String(r.result || '')
      const i = s.indexOf(',')
      resolve(i >= 0 ? s.slice(i + 1) : s)
    }
    r.onerror = () => reject(new Error('read failed'))
    r.readAsDataURL(file)
  })
}

const emptySku = () => ({ code: '', spec_zh: '', spec_en: '', price: '', currency: '' })

export default function ProductCatalogAdmin({ getToken }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]?.id || 'supplement')
  const [titleZh, setTitleZh] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [descriptionZh, setDescriptionZh] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [originZh, setOriginZh] = useState('')
  const [originEn, setOriginEn] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('CNY')
  const [unit, setUnit] = useState('瓶')
  const [galleryFiles, setGalleryFiles] = useState([])
  const [skus, setSkus] = useState([emptySku()])

  const [editingId, setEditingId] = useState('')
  const [editForm, setEditForm] = useState(null)
  const [editGalleryFiles, setEditGalleryFiles] = useState([])

  const authHeaders = useCallback(() => {
    const token = getToken?.()
    const h = { 'Content-Type': 'application/json' }
    if (token) h.Authorization = `Bearer ${token}`
    return h
  }, [getToken])

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/product-catalog?ts=${Date.now()}`, { cache: 'no-store' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || '加载失败')
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch (e) {
      setError(e.message || '加载失败')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const categoryLabel = useMemo(() => {
    const m = Object.fromEntries(PRODUCT_CATEGORIES.map((c) => [c.id, c.label]))
    return (id) => m[id] || id
  }, [])

  const filesToGalleryPayload = async (files) => {
    const out = []
    for (const f of files) {
      out.push({
        base64: await fileToBase64(f),
        fileName: f.name,
        mimeType: f.type || 'image/jpeg',
      })
    }
    return out
  }

  const normalizeSkusPayload = (rows) =>
    rows
      .filter((r) => String(r.code || '').trim() || String(r.spec_zh || '').trim() || String(r.spec_en || '').trim())
      .map((r) => ({
        code: String(r.code || '').trim(),
        spec_zh: String(r.spec_zh || '').trim(),
        spec_en: String(r.spec_en || '').trim(),
        price: r.price === '' || r.price == null ? null : Number(r.price),
        currency: String(r.currency || '').trim() || null,
      }))

  const onGalleryChange = (e) => {
    const list = Array.from(e.target.files || []).slice(0, 12)
    setGalleryFiles(list)
  }

  const onCreate = async (e) => {
    e.preventDefault()
    setHint('')
    setError('')
    if (!galleryFiles.length) {
      setError('请至少选择一张商品图片（可多选）')
      return
    }
    const p = Number(price)
    if (!titleZh.trim() || !Number.isFinite(p) || p < 0) {
      setError('请填写中文标题与有效基础价格')
      return
    }
    setSubmitting(true)
    try {
      const galleryImages = await filesToGalleryPayload(galleryFiles)
      const res = await fetch('/api/product-catalog', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          category,
          titleZh: titleZh.trim(),
          titleEn: titleEn.trim(),
          descriptionZh: descriptionZh.trim(),
          descriptionEn: descriptionEn.trim(),
          originZh: originZh.trim(),
          originEn: originEn.trim(),
          price: p,
          currency: currency.trim() || 'CNY',
          unit: unit.trim() || '件',
          galleryImages,
          skus: normalizeSkusPayload(skus),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || '上架失败')
      setHint('上架成功')
      setTitleZh('')
      setTitleEn('')
      setDescriptionZh('')
      setDescriptionEn('')
      setOriginZh('')
      setOriginEn('')
      setPrice('')
      setUnit('瓶')
      setGalleryFiles([])
      setSkus([emptySku()])
      await loadItems()
    } catch (err) {
      setError(err.message || '上架失败')
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (it) => {
    setEditingId(it.id)
    setEditGalleryFiles([])
    setEditForm({
      category: it.category,
      titleZh: it.title_zh || '',
      titleEn: it.title_en || '',
      descriptionZh: it.description_zh ?? '',
      descriptionEn: it.description_en ?? '',
      originZh: it.origin_zh ?? '',
      originEn: it.origin_en ?? '',
      price: String(it.price_amount ?? ''),
      currency: it.currency || 'CNY',
      unit: it.unit || '件',
      skus: it.skus?.length ? it.skus.map((s) => ({
        code: s.code || '',
        spec_zh: s.spec_zh || '',
        spec_en: s.spec_en || '',
        price: s.price != null ? String(s.price) : '',
        currency: s.currency || '',
      })) : [emptySku()],
    })
    setError('')
    setHint('')
  }

  const cancelEdit = () => {
    setEditingId('')
    setEditForm(null)
    setEditGalleryFiles([])
  }

  const onSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingId || !editForm) return
    const p = Number(editForm.price)
    if (!editForm.titleZh.trim() || !Number.isFinite(p) || p < 0) {
      setError('请填写中文标题与有效基础价格')
      return
    }
    setSubmitting(true)
    setError('')
    setHint('')
    try {
      const payload = {
        id: editingId,
        category: editForm.category,
        titleZh: editForm.titleZh.trim(),
        titleEn: editForm.titleEn.trim(),
        descriptionZh: editForm.descriptionZh.trim(),
        descriptionEn: editForm.descriptionEn.trim(),
        originZh: editForm.originZh.trim(),
        originEn: editForm.originEn.trim(),
        price: p,
        currency: editForm.currency.trim() || 'CNY',
        unit: editForm.unit.trim() || '件',
        skus: normalizeSkusPayload(editForm.skus),
      }
      if (editGalleryFiles.length) {
        payload.galleryImages = await filesToGalleryPayload(editGalleryFiles)
      }
      const res = await fetch('/api/product-catalog', {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || '保存失败')
      setHint('已保存')
      cancelEdit()
      await loadItems()
    } catch (err) {
      setError(err.message || '保存失败')
    } finally {
      setSubmitting(false)
    }
  }

  const onDelete = async (id) => {
    if (!window.confirm('确定删除该上架商品？')) return
    setError('')
    setHint('')
    try {
      const res = await fetch(`/api/product-catalog?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || '删除失败')
      setHint('已删除')
      if (editingId === id) cancelEdit()
      await loadItems()
    } catch (err) {
      setError(err.message || '删除失败')
    }
  }

  const rowTitle = (it) => it.title_zh || it.title_en || it.title || '—'

  return (
    <section className="product-catalog-admin">
      <h4 className="product-catalog-admin-title">长寿产品证据库 · 商品上架</h4>
      <p className="product-catalog-admin-note">
        支持<strong>多图</strong>、<strong>中英文标题/介绍/产地</strong>、<strong>规格 SKU</strong>（可选单价覆盖）。本模块商品对<strong>所有人可见</strong>（无需会员分级）。证据 PDF 仍用下方「模块资料」上传。
      </p>

      {loading ? <p className="product-catalog-admin-muted">加载中…</p> : null}
      {error ? <p className="product-catalog-admin-error">{error}</p> : null}
      {hint ? <p className="product-catalog-admin-hint">{hint}</p> : null}

      <form className="product-catalog-admin-form" onSubmit={onCreate}>
        <div className="product-catalog-admin-grid">
          <label>
            <span>类目</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>
          <label className="product-catalog-admin-span2">
            <span>标题（中文）*</span>
            <input value={titleZh} onChange={(e) => setTitleZh(e.target.value)} placeholder="必填" />
          </label>
          <label className="product-catalog-admin-span2">
            <span>标题（English）</span>
            <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
          </label>
          <label>
            <span>基础价格*</span>
            <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
          <label>
            <span>币种</span>
            <input value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </label>
          <label>
            <span>单位</span>
            <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="瓶 / 盒" />
          </label>
        </div>
        <label className="product-catalog-admin-full">
          <span>介绍（中文）</span>
          <textarea rows={3} value={descriptionZh} onChange={(e) => setDescriptionZh(e.target.value)} />
        </label>
        <label className="product-catalog-admin-full">
          <span>介绍（English）</span>
          <textarea rows={3} value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} />
        </label>
        <div className="product-catalog-admin-grid">
          <label>
            <span>产地（中文）</span>
            <input value={originZh} onChange={(e) => setOriginZh(e.target.value)} />
          </label>
          <label>
            <span>产地（English）</span>
            <input value={originEn} onChange={(e) => setOriginEn(e.target.value)} />
          </label>
        </div>
        <label className="product-catalog-admin-full">
          <span>商品图片（必填，可多选，≤12 张，每张 ≤12MB）</span>
          <input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" onChange={onGalleryChange} />
          {galleryFiles.length ? <span className="product-catalog-admin-muted">已选 {galleryFiles.length} 张</span> : null}
        </label>

        <div className="product-catalog-admin-skus">
          <div className="product-catalog-admin-skus-head">
            <strong>规格 SKU（可选）</strong>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setSkus((s) => [...s, emptySku()])}
            >
              添加一行
            </button>
          </div>
          {skus.map((row, idx) => (
            <div key={idx} className="product-catalog-admin-sku-row">
              <input placeholder="SKU 编码" value={row.code} onChange={(e) => {
                const next = [...skus]
                next[idx] = { ...next[idx], code: e.target.value }
                setSkus(next)
              }}
              />
              <input placeholder="规格（中文）" value={row.spec_zh} onChange={(e) => {
                const next = [...skus]
                next[idx] = { ...next[idx], spec_zh: e.target.value }
                setSkus(next)
              }}
              />
              <input placeholder="规格（EN）" value={row.spec_en} onChange={(e) => {
                const next = [...skus]
                next[idx] = { ...next[idx], spec_en: e.target.value }
                setSkus(next)
              }}
              />
              <input type="number" placeholder="单价覆盖" value={row.price} onChange={(e) => {
                const next = [...skus]
                next[idx] = { ...next[idx], price: e.target.value }
                setSkus(next)
              }}
              />
              <input placeholder="币种" value={row.currency} onChange={(e) => {
                const next = [...skus]
                next[idx] = { ...next[idx], currency: e.target.value }
                setSkus(next)
              }}
              />
              <button type="button" className="btn-secondary product-catalog-admin-danger" onClick={() => setSkus((s) => s.filter((_, i) => i !== idx))}>删</button>
            </div>
          ))}
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? '提交中…' : '上架商品'}
        </button>
      </form>

      <div className="product-catalog-admin-list-wrap">
        <h5>已上架商品（{items.length}）</h5>
        <ul className="product-catalog-admin-list">
          {items.map((it) => (
            <li key={it.id} className="product-catalog-admin-row">
              {editingId === it.id && editForm ? (
                <form className="product-catalog-admin-edit" onSubmit={onSaveEdit}>
                  <div className="product-catalog-admin-preview">
                    <ProductCatalogImage productId={it.id} galleryCount={it.gallery_count} slot={0} className="product-catalog-admin-thumb" alt="" />
                    <span className="product-catalog-admin-muted">共 {it.gallery_count || 0} 图 · 留空下方文件则不替换图库</span>
                  </div>
                  <div className="product-catalog-admin-grid">
                    <label>
                      <span>类目</span>
                      <select value={editForm.category} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}>
                        {PRODUCT_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </label>
                    <label className="product-catalog-admin-span2">
                      <span>标题（中文）</span>
                      <input value={editForm.titleZh} onChange={(e) => setEditForm((f) => ({ ...f, titleZh: e.target.value }))} />
                    </label>
                    <label className="product-catalog-admin-span2">
                      <span>标题（EN）</span>
                      <input value={editForm.titleEn} onChange={(e) => setEditForm((f) => ({ ...f, titleEn: e.target.value }))} />
                    </label>
                    <label>
                      <span>基础价格</span>
                      <input type="number" min="0" step="0.01" value={editForm.price} onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))} />
                    </label>
                    <label>
                      <span>币种</span>
                      <input value={editForm.currency} onChange={(e) => setEditForm((f) => ({ ...f, currency: e.target.value }))} />
                    </label>
                    <label>
                      <span>单位</span>
                      <input value={editForm.unit} onChange={(e) => setEditForm((f) => ({ ...f, unit: e.target.value }))} />
                    </label>
                  </div>
                  <label className="product-catalog-admin-full">
                    <span>介绍（中文）</span>
                    <textarea rows={2} value={editForm.descriptionZh} onChange={(e) => setEditForm((f) => ({ ...f, descriptionZh: e.target.value }))} />
                  </label>
                  <label className="product-catalog-admin-full">
                    <span>介绍（EN）</span>
                    <textarea rows={2} value={editForm.descriptionEn} onChange={(e) => setEditForm((f) => ({ ...f, descriptionEn: e.target.value }))} />
                  </label>
                  <div className="product-catalog-admin-grid">
                    <label>
                      <span>产地（中文）</span>
                      <input value={editForm.originZh} onChange={(e) => setEditForm((f) => ({ ...f, originZh: e.target.value }))} />
                    </label>
                    <label>
                      <span>产地（EN）</span>
                      <input value={editForm.originEn} onChange={(e) => setEditForm((f) => ({ ...f, originEn: e.target.value }))} />
                    </label>
                  </div>
                  <label className="product-catalog-admin-full">
                    <span>替换全部图片（多选则整体替换图库）</span>
                    <input
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={(e) => setEditGalleryFiles(Array.from(e.target.files || []).slice(0, 12))}
                    />
                    {editGalleryFiles.length ? <span className="product-catalog-admin-muted">将替换为 {editGalleryFiles.length} 张</span> : null}
                  </label>

                  <div className="product-catalog-admin-skus">
                    <div className="product-catalog-admin-skus-head">
                      <strong>SKU</strong>
                      <button type="button" className="btn-secondary" onClick={() => setEditForm((f) => ({ ...f, skus: [...f.skus, emptySku()] }))}>添加一行</button>
                    </div>
                    {editForm.skus.map((row, idx) => (
                      <div key={idx} className="product-catalog-admin-sku-row">
                        <input placeholder="SKU" value={row.code} onChange={(e) => {
                          const next = [...editForm.skus]
                          next[idx] = { ...next[idx], code: e.target.value }
                          setEditForm((f) => ({ ...f, skus: next }))
                        }}
                        />
                        <input placeholder="规格中文" value={row.spec_zh} onChange={(e) => {
                          const next = [...editForm.skus]
                          next[idx] = { ...next[idx], spec_zh: e.target.value }
                          setEditForm((f) => ({ ...f, skus: next }))
                        }}
                        />
                        <input placeholder="规格 EN" value={row.spec_en} onChange={(e) => {
                          const next = [...editForm.skus]
                          next[idx] = { ...next[idx], spec_en: e.target.value }
                          setEditForm((f) => ({ ...f, skus: next }))
                        }}
                        />
                        <input type="number" placeholder="单价" value={row.price} onChange={(e) => {
                          const next = [...editForm.skus]
                          next[idx] = { ...next[idx], price: e.target.value }
                          setEditForm((f) => ({ ...f, skus: next }))
                        }}
                        />
                        <input placeholder="币种" value={row.currency} onChange={(e) => {
                          const next = [...editForm.skus]
                          next[idx] = { ...next[idx], currency: e.target.value }
                          setEditForm((f) => ({ ...f, skus: next }))
                        }}
                        />
                        <button type="button" className="btn-secondary product-catalog-admin-danger" onClick={() => setEditForm((f) => ({ ...f, skus: f.skus.filter((_, i) => i !== idx) }))}>删</button>
                      </div>
                    ))}
                  </div>

                  <div className="product-catalog-admin-actions">
                    <button type="submit" className="btn-primary" disabled={submitting}>保存</button>
                    <button type="button" className="btn-secondary" onClick={cancelEdit}>取消</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="product-catalog-admin-meta">
                    <ProductCatalogImage productId={it.id} galleryCount={it.gallery_count} className="product-catalog-admin-thumb" alt="" />
                    <div className="product-catalog-admin-meta-text">
                      <strong>{rowTitle(it)}</strong>
                      <div className="product-catalog-admin-pills">
                        <span className="product-catalog-admin-pill">{categoryLabel(it.category)}</span>
                        <span className="product-catalog-admin-pill">{it.currency} {it.price_amount} / {it.unit}</span>
                        <span className="product-catalog-admin-pill">{it.gallery_count || 0} 图</span>
                        <span className="product-catalog-admin-pill">SKU {(it.skus || []).length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="product-catalog-admin-actions">
                    <button type="button" className="btn-secondary" onClick={() => startEdit(it)}>编辑</button>
                    <button type="button" className="btn-secondary product-catalog-admin-danger" onClick={() => onDelete(it.id)}>删除</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
