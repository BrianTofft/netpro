'use client'

import { useState, useEffect, useCallback } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
}

interface Product {
  id: string
  asin: string
  title: string
  brand: string | null
  price: number | null
  original_price: number | null
  image_url: string | null
  amazon_url: string
  category_id: string | null
  description: string | null
  model: string | null
  is_featured: boolean
  is_new: boolean
  is_on_sale: boolean
  categories?: { name: string; slug: string } | null
}

const EMPTY_FORM = {
  asin: '',
  title: '',
  brand: 'Bosch Professional',
  model: '',
  price: '',
  original_price: '',
  image_url: '',
  description: '',
  category_id: '',
  is_featured: false,
  is_new: false,
  is_on_sale: false,
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [auth, setAuth] = useState<string | null>(null)
  const [authError, setAuthError] = useState('')

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState('')

  // Gendan session fra sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('netpro_admin_pw')
    if (saved) setAuth(saved)
  }, [])

  const fetchAll = useCallback(async (pw: string) => {
    setLoading(true)
    const headers = { 'x-admin-password': pw }
    const [pRes, cRes] = await Promise.all([
      fetch('/api/admin/products', { headers }),
      fetch('/api/admin/categories', { headers }),
    ])
    if (pRes.status === 401) {
      setAuth(null)
      sessionStorage.removeItem('netpro_admin_pw')
      setAuthError('Forkert adgangskode')
      setLoading(false)
      return
    }
    const [pData, cData] = await Promise.all([pRes.json(), cRes.json()])
    setProducts(Array.isArray(pData) ? pData : [])
    setCategories(Array.isArray(cData) ? cData : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (auth) fetchAll(auth)
  }, [auth, fetchAll])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    sessionStorage.setItem('netpro_admin_pw', password)
    setAuth(password)
  }

  function openAdd() {
    setEditProduct(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  function openEdit(p: Product) {
    setEditProduct(p)
    setForm({
      asin: p.asin,
      title: p.title,
      brand: p.brand ?? '',
      model: p.model ?? '',
      price: p.price?.toString() ?? '',
      original_price: p.original_price?.toString() ?? '',
      image_url: p.image_url ?? '',
      description: p.description ?? '',
      category_id: p.category_id ?? '',
      is_featured: p.is_featured,
      is_new: p.is_new,
      is_on_sale: p.is_on_sale,
    })
    setShowForm(true)
  }

  async function fetchFromAmazon() {
    if (!form.asin || form.asin.length < 10) return
    setFetching(true)
    setFetchError('')
    try {
      const res = await fetch(`/api/admin/amazon-lookup?asin=${form.asin.trim()}`, {
        headers: { 'x-admin-password': auth! },
      })
      const data = await res.json()
      if (!res.ok) {
        setFetchError(data.error ?? 'Ukendt fejl')
        return
      }
      setForm((f) => ({
        ...f,
        title: data.title || f.title,
        model: data.model || f.model,
        price: data.price?.toString() || f.price,
        original_price: data.original_price?.toString() || f.original_price,
        image_url: data.image_url || f.image_url,
        description: data.description || f.description,
      }))
    } catch {
      setFetchError('Netværksfejl — prøv igen')
    } finally {
      setFetching(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': auth!,
      },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setShowForm(false)
    fetchAll(auth!)
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Slet "${title}"?`)) return
    await fetch(`/api/admin/products?id=${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': auth! },
    })
    fetchAll(auth!)
  }

  async function toggleFlag(id: string, field: 'is_featured' | 'is_new' | 'is_on_sale', current: boolean) {
    await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': auth!,
      },
      body: JSON.stringify({ id, [field]: !current }),
    })
    fetchAll(auth!)
  }

  const filtered = products.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.asin.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand ?? '').toLowerCase().includes(search.toLowerCase())
  )

  // --- Login ---
  if (!auth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-[#1C3A6E] mb-1">Netpro</div>
            <div className="text-gray-500 text-sm">Admin — produktstyring</div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Adgangskode"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A6E]"
              autoFocus
            />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-[#1C3A6E] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#002d7a] transition-colors"
            >
              Log ind
            </button>
          </form>
        </div>
      </div>
    )
  }

  // --- Admin UI ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-xl font-bold text-[#1C3A6E]">Netpro Admin</span>
          <span className="ml-3 text-sm text-gray-500">Produktstyring</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-gray-500 hover:text-gray-700">← Til forsiden</a>
          <button
            onClick={() => { sessionStorage.removeItem('netpro_admin_pw'); setAuth(null) }}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Log ud
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Produkter i alt', value: products.length },
            { label: 'Nyheder', value: products.filter((p) => p.is_new).length },
            { label: 'Tilbud', value: products.filter((p) => p.is_on_sale).length },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-2xl font-bold text-[#1C3A6E]">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Søg titel, ASIN, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#1C3A6E]"
          />
          <button
            onClick={openAdd}
            className="bg-[#1C3A6E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002d7a] transition-colors"
          >
            + Tilføj produkt
          </button>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Indlæser...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Produkt</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">ASIN</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Kategori</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Pris</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Ny</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Tilbud</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Handlinger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                      Ingen produkter endnu — klik &quot;Tilføj produkt&quot; for at starte
                    </td>
                  </tr>
                )}
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <img src={p.image_url} alt="" className="w-10 h-10 object-contain rounded border border-gray-100" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded border border-gray-100 flex items-center justify-center text-gray-300 text-xs">
                            Intet
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900 max-w-xs truncate">{p.title}</div>
                          {p.brand && <div className="text-xs text-gray-400">{p.brand}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={p.amazon_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-[#1C3A6E] hover:underline"
                      >
                        {p.asin}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {p.categories?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {p.price != null ? (
                        <span className="font-medium text-gray-900">{p.price.toLocaleString('da-DK')} kr.</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    {(['is_new', 'is_on_sale'] as const).map((flag) => (
                      <td key={flag} className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleFlag(p.id, flag, p[flag])}
                          className={`w-6 h-6 rounded text-xs font-bold transition-colors ${
                            p[flag]
                              ? 'bg-[#1C3A6E] text-white'
                              : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          ✓
                        </button>
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-gray-400 hover:text-[#1C3A6E] mr-3 text-xs"
                      >
                        Rediger
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="text-gray-400 hover:text-red-500 text-xs"
                      >
                        Slet
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal — tilføj/rediger produkt */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editProduct ? 'Rediger produkt' : 'Tilføj produkt'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">ASIN *</label>
                  <input
                    required
                    value={form.asin}
                    onChange={(e) => setForm({ ...form, asin: e.target.value })}
                    placeholder="B09F3XR7QH"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A6E]"
                    disabled={!!editProduct}
                  />
                  <div className="flex items-center gap-2 mt-1">
                    {form.asin && (
                      <a
                        href={`https://www.amazon.de/dp/${form.asin}?tag=netpro0d-21`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#1C3A6E] hover:underline"
                      >
                        Åbn på Amazon.de →
                      </a>
                    )}
                    {!editProduct && (
                      <button
                        type="button"
                        onClick={fetchFromAmazon}
                        disabled={fetching || form.asin.length < 10}
                        className="ml-auto flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-800 px-3 py-1 rounded-md text-xs font-medium hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {fetching ? (
                          <>
                            <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Henter...
                          </>
                        ) : (
                          <>🔍 Hent fra Amazon</>
                        )}
                      </button>
                    )}
                  </div>
                  {fetchError && (
                    <p className="text-red-500 text-xs mt-1">{fetchError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Kategori</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A6E]"
                  >
                    <option value="">— Vælg kategori —</option>
                    {categories
                      .filter((c) => !c.parent_id)
                      .sort((a, b) => a.name.localeCompare(b.name, 'da'))
                      .map((parent) => {
                        const subs = categories.filter((c) => c.parent_id === parent.id)
                        return subs.length > 0 ? (
                          <optgroup key={parent.id} label={parent.name}>
                            {subs
                              .sort((a, b) => a.name.localeCompare(b.name, 'da'))
                              .map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                  {sub.name}
                                </option>
                              ))}
                          </optgroup>
                        ) : (
                          <option key={parent.id} value={parent.id}>
                            {parent.name}
                          </option>
                        )
                      })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Titel *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Bosch Professional GSR 18V-55 skruemaskine"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A6E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Brand</label>
                  <input
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="Bosch Professional"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A6E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Model</label>
                  <input
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    placeholder="GSR 18V-55"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A6E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Pris (DKK)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="1299"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A6E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Vejl. pris (DKK) — til rabatvisning</label>
                  <input
                    type="number"
                    value={form.original_price}
                    onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                    placeholder="1599"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A6E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Billede URL</label>
                <input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://m.media-amazon.com/images/I/..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A6E]"
                />
                <p className="text-xs text-gray-400 mt-1">Find billede-URL på Amazon produktsiden (højreklik → Kopiér billedadresse)</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Beskrivelse</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Kort produktbeskrivelse..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A6E] resize-none"
                />
              </div>

              <div className="flex gap-6">
                {[
                  { key: 'is_new' as const, label: 'Nyhed' },
                  { key: 'is_on_sale' as const, label: 'På tilbud' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                      className="w-4 h-4 accent-[#1C3A6E]"
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#1C3A6E] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#002d7a] disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Gemmer...' : editProduct ? 'Gem ændringer' : 'Tilføj produkt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
