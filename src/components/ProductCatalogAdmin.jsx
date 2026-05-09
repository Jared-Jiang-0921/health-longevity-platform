import { useCallback, useEffect, useMemo, useState } from 'react'
import { PRODUCT_CATEGORIES } from '../data/products'
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

export default function ProductCatalogAdmin({ getToken }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]?.id || 'supplement')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [origin, setOrigin] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('CNY')
  const [unit, setUnit] = useState('瓶')
  const [requiredLevel, setRequiredLevel] = useState('free')
  const [imageFile, setImageFile] = useState(null)

  const [editingId, setEditingId] = useState('')
  const [editCategory, setEditCategory] = useState('supplement')
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editOrigin, setEditOrigin] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editCurrency, setEditCurrency] = useState('CNY')
  const [editUnit, setEditUnit] = useState('瓶')
  const [editRequiredLevel, setEditRequiredLevel] = useState('free')
  const [editImageFile, setEditImageFile] = useState(null)

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
      const res = await fetch(`/api/product-catalog?ts=${Date.now()}`, {
        cache: 'no-store',
        headers: authHeaders(),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || '加载失败')
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch (e) {
      setError(e.message || '加载失败')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [authHeaders])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const categoryLabel = useMemo(() => {
    const m = Object.fromEntries(PRODUCT_CATEGORIES.map((c) => [c.id, c.label]))
    return (id) => m[id] || id
  }, [])

  const onCreate = async (e) => {
    e.preventDefault()
    setHint('')
    setError('')
    if (!imageFile) {
      setError('请选择商品主图')
      return
    }
    const p = Number(price)
    if (!title.trim() || !Number.isFinite(p) || p < 0) {
      setError('请填写标题与有效价格')
      return
    }
    setSubmitting(true)
    try {
      const imageBase64 = await fileToBase64(imageFile)
      const res = await fetch('/api/product-catalog', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          category,
          title: title.trim(),
          description: description.trim(),
          origin: origin.trim(),
          price: p,
          currency: currency.trim() || 'CNY',
          unit: unit.trim() || '件',
          requiredLevel,
          imageFileName: imageFile.name,
          imageMimeType: imageFile.type || 'image/jpeg',
          imageBase64,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || '上架失败')
      setHint('上架成功')
      setTitle('')
      setDescription('')
      setOrigin('')
      setPrice('')
      setUnit('瓶')
      setImageFile(null)
      await loadItems()
    } catch (err) {
      setError(err.message || '上架失败')
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (it) => {
    setEditingId(it.id)
    setEditCategory(it.category)
    setEditTitle(it.title || '')
    setEditDescription(it.description || '')
    setEditOrigin(it.origin || '')
    setEditPrice(String(it.price_amount ?? ''))
    setEditCurrency(it.currency || 'CNY')
    setEditUnit(it.unit || '件')
    setEditRequiredLevel(it.required_level || 'free')
    setEditImageFile(null)
    setError('')
    setHint('')
  }

  const cancelEdit = () => {
    setEditingId('')
    setEditImageFile(null)
  }

  const onSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingId) return
    const p = Number(editPrice)
    if (!editTitle.trim() || !Number.isFinite(p) || p < 0) {
      setError('请填写标题与有效价格')
      return
    }
    setSubmitting(true)
    setError('')
    setHint('')
    try {
      const payload = {
        id: editingId,
        category: editCategory,
        title: editTitle.trim(),
        description: editDescription.trim(),
        origin: editOrigin.trim(),
        price: p,
        currency: editCurrency.trim() || 'CNY',
        unit: editUnit.trim() || '件',
        requiredLevel: editRequiredLevel,
      }
      if (editImageFile) {
        payload.imageBase64 = await fileToBase64(editImageFile)
        payload.imageFileName = editImageFile.name
        payload.imageMimeType = editImageFile.type || 'image/jpeg'
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

  return (
    <section className="product-catalog-admin">
      <h4 className="product-catalog-admin-title">长寿产品证据库 · 商品上架（保健品/食品等）</h4>
      <p className="product-catalog-admin-note">
        用于维护列表与详情中的<strong>商品卡片</strong>：主图、介绍、产地、价格、计量单位与会员可见等级。证据类 PDF 仍使用下方「模块资料」上传。
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
          <label>
            <span>标题</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="商品名称" />
          </label>
          <label>
            <span>产地</span>
            <input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="如：新西兰 / 国产·某某省" />
          </label>
          <label>
            <span>价格</span>
            <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
          </label>
          <label>
            <span>币种</span>
            <input value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="CNY" />
          </label>
          <label>
            <span>单位</span>
            <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="瓶 / 盒 / 袋" />
          </label>
          <label>
            <span>会员可见</span>
            <select value={requiredLevel} onChange={(e) => setRequiredLevel(e.target.value)}>
              <option value="free">普通会员</option>
              <option value="standard">标准会员</option>
              <option value="premium">高级会员</option>
            </select>
          </label>
        </div>
        <label className="product-catalog-admin-full">
          <span>介绍（成分亮点、适用场景、合规提示摘要等）</span>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className="product-catalog-admin-full">
          <span>商品主图（必填，png/jpg/webp/gif，≤12MB）</span>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        </label>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? '提交中…' : '上架商品'}
        </button>
      </form>

      <div className="product-catalog-admin-list-wrap">
        <h5>已上架商品（{items.length}）</h5>
        <ul className="product-catalog-admin-list">
          {items.map((it) => (
            <li key={it.id} className="product-catalog-admin-row">
              {editingId === it.id ? (
                <form className="product-catalog-admin-edit" onSubmit={onSaveEdit}>
                  <div className="product-catalog-admin-grid">
                    <label>
                      <span>类目</span>
                      <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                        {PRODUCT_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </label>
                    <label className="product-catalog-admin-span2">
                      <span>标题</span>
                      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    </label>
                    <label>
                      <span>产地</span>
                      <input value={editOrigin} onChange={(e) => setEditOrigin(e.target.value)} />
                    </label>
                    <label>
                      <span>价格</span>
                      <input type="number" min="0" step="0.01" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                    </label>
                    <label>
                      <span>币种</span>
                      <input value={editCurrency} onChange={(e) => setEditCurrency(e.target.value)} />
                    </label>
                    <label>
                      <span>单位</span>
                      <input value={editUnit} onChange={(e) => setEditUnit(e.target.value)} />
                    </label>
                    <label>
                      <span>会员可见</span>
                      <select value={editRequiredLevel} onChange={(e) => setEditRequiredLevel(e.target.value)}>
                        <option value="free">普通会员</option>
                        <option value="standard">标准会员</option>
                        <option value="premium">高级会员</option>
                      </select>
                    </label>
                  </div>
                  <label className="product-catalog-admin-full">
                    <span>介绍</span>
                    <textarea rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                  </label>
                  <label className="product-catalog-admin-full">
                    <span>更换主图（可选）</span>
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => setEditImageFile(e.target.files?.[0] || null)} />
                  </label>
                  <div className="product-catalog-admin-actions">
                    <button type="submit" className="btn-primary" disabled={submitting}>保存</button>
                    <button type="button" className="btn-secondary" onClick={cancelEdit}>取消</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="product-catalog-admin-meta">
                    <strong>{it.title}</strong>
                    <span className="product-catalog-admin-pill">{categoryLabel(it.category)}</span>
                    <span className="product-catalog-admin-pill">{it.required_level}</span>
                    <span className="product-catalog-admin-pill">{it.currency} {it.price_amount} / {it.unit}</span>
                    {it.origin ? <span className="product-catalog-admin-pill">产地 {it.origin}</span> : null}
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
