
import { useCallback, useEffect, useState } from 'react'
import {
  BookOpen, CalendarDays, ChevronLeft, ChevronRight,
  FileText, Folder, GraduationCap, LayoutDashboard,
  LogOut, Pin, Plus, Search, Sparkles, Trash2,
  Pencil, Eye, EyeOff, RefreshCw, X,
} from 'lucide-react'

import {
  authAPI,
  aiAPI,
  categoriesAPI,
  clearTokens,
  notesAPI,
  saveTokens,
  subjectsAPI,
} from './services/api'

const EMPTY_NOTE = {
  title: '',
  content: '',
  subject: '',
  category: '',
}

const COLORS = [
  'bg-[#FFE0D2] text-[#A83D22]',
  'bg-[#FFF1AE] text-[#795900]',
  'bg-[#CFF5E7] text-[#126B50]',
  'bg-[#CDEEFF] text-[#155D8B]',
  'bg-[#FFD5E8] text-[#A52E65]',
  'bg-[#DDF3B5] text-[#466B19]',
  'bg-[#BDECEB] text-[#176B69]',
]

const NOTE_COLORS = [
  {
    card: 'bg-[#FFF1AE] border-[#E8C94F]',
    icon: 'bg-[#FFE08A] text-[#795900]',
    title: 'text-[#493A12]',
    text: 'text-[#695A2D]',
    muted: 'text-[#806F3C]',
    tag: 'bg-[#FFE08A] text-[#795900]',
    action: 'text-[#795900] hover:bg-[#FFE08A]',
    summary: 'bg-[#FFF7D5] border-[#E8C94F]',
    summaryTitle: 'text-[#795900]',
  },
  {
    card: 'bg-[#CFF5E7] border-[#80D7B7]',
    icon: 'bg-[#A8EBD1] text-[#126B50]',
    title: 'text-[#164B3C]',
    text: 'text-[#356C5A]',
    muted: 'text-[#56806F]',
    tag: 'bg-[#A8EBD1] text-[#126B50]',
    action: 'text-[#126B50] hover:bg-[#A8EBD1]',
    summary: 'bg-[#E5FAF1] border-[#80D7B7]',
    summaryTitle: 'text-[#126B50]',
  },
  {
    card: 'bg-[#CDEEFF] border-[#8ACFEB]',
    icon: 'bg-[#A9DFF8] text-[#155D8B]',
    title: 'text-[#174565]',
    text: 'text-[#416C86]',
    muted: 'text-[#60849B]',
    tag: 'bg-[#A9DFF8] text-[#155D8B]',
    action: 'text-[#155D8B] hover:bg-[#A9DFF8]',
    summary: 'bg-[#E7F7FF] border-[#8ACFEB]',
    summaryTitle: 'text-[#155D8B]',
  },
  {
    card: 'bg-[#FFD5E8] border-[#F1A6C8]',
    icon: 'bg-[#FFB9D7] text-[#A52E65]',
    title: 'text-[#702344]',
    text: 'text-[#89516B]',
    muted: 'text-[#A06B83]',
    tag: 'bg-[#FFB9D7] text-[#A52E65]',
    action: 'text-[#A52E65] hover:bg-[#FFB9D7]',
    summary: 'bg-[#FFEAF3] border-[#F1A6C8]',
    summaryTitle: 'text-[#A52E65]',
  },
  {
    card: 'bg-[#FFE0D2] border-[#F2B29A]',
    icon: 'bg-[#FFC3A9] text-[#A83D22]',
    title: 'text-[#71321F]',
    text: 'text-[#895340]',
    muted: 'text-[#A06F5C]',
    tag: 'bg-[#FFC3A9] text-[#A83D22]',
    action: 'text-[#A83D22] hover:bg-[#FFC3A9]',
    summary: 'bg-[#FFF0E9] border-[#F2B29A]',
    summaryTitle: 'text-[#A83D22]',
  },
  {
    card: 'bg-[#DDF3B5] border-[#B6D982]',
    icon: 'bg-[#C6E89A] text-[#466B19]',
    title: 'text-[#344D1B]',
    text: 'text-[#5B713D]',
    muted: 'text-[#748C55]',
    tag: 'bg-[#C6E89A] text-[#466B19]',
    action: 'text-[#466B19] hover:bg-[#C6E89A]',
    summary: 'bg-[#EFF9DF] border-[#B6D982]',
    summaryTitle: 'text-[#466B19]',
  },
  {
    card: 'bg-[#BDECEB] border-[#80D0CE]',
    icon: 'bg-[#9ADDDC] text-[#176B69]',
    title: 'text-[#164F4E]',
    text: 'text-[#356C6B]',
    muted: 'text-[#568382]',
    tag: 'bg-[#9ADDDC] text-[#176B69]',
    action: 'text-[#176B69] hover:bg-[#9ADDDC]',
    summary: 'bg-[#E2F8F7] border-[#80D0CE]',
    summaryTitle: 'text-[#176B69]',
  },
]

const DARK_PANEL =
  'border border-white/10 bg-[#202329] shadow-lg shadow-black/10'

const PRIMARY_BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF8A5B] px-4 py-3 text-sm font-bold text-[#292522] shadow-lg shadow-[#FF8A5B]/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFC15E] disabled:cursor-not-allowed disabled:opacity-50'

const SECONDARY_BUTTON =
  'rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/75 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white'

function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [activePage, setActivePage] = useState('Dashboard')

  const [notes, setNotes] = useState([])
  const [recentNotes, setRecentNotes] = useState([])
  const [categories, setCategories] = useState([])
  const [subjects, setSubjects] = useState([])

  const [stats, setStats] = useState({
    total_notes: 0,
    pinned_notes: 0,
    total_categories: 0,
  })

  const [search, setSearch] = useState('')
  const [ordering, setOrdering] = useState('-created_at')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showNoteModal, setShowNoteModal] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [noteForm, setNoteForm] = useState(EMPTY_NOTE)
  const [savingNote, setSavingNote] = useState(false)

  const [showItemModal, setShowItemModal] = useState(false)
  const [itemType, setItemType] = useState('category')
  const [editingItem, setEditingItem] = useState(null)
  const [itemName, setItemName] = useState('')
  const [savingItem, setSavingItem] = useState(false)

  const [confirmDialog, setConfirmDialog] = useState(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSubmitting, setAuthSubmitting] = useState(false)

  const getError = (err) => err?.message || 'Something went wrong.'

  const loadCategories = useCallback(async () => {
    const [categoryData, categoryStats] = await Promise.all([
      categoriesAPI.list(),
      categoriesAPI.stats(),
    ])

    const list = categoryData.results || categoryData

    setCategories(
      list.map((category) => ({
        ...category,
        note_count:
          categoryStats.find((item) => item.id === category.id)?.note_count || 0,
      }))
    )
  }, [])

  const loadSubjects = useCallback(async () => {
    const data = await subjectsAPI.list()
    setSubjects(data.results || data)
  }, [])

  const loadNotes = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(page),
      ordering,
    })

    if (search.trim()) {
      params.set('search', search.trim())
    }

    const data = await notesAPI.list(`?${params.toString()}`)

    setNotes(data.results || [])
    setTotalPages(Math.max(1, Math.ceil((data.count || 0) / 10)))
  }, [page, ordering, search])

  const loadDashboard = useCallback(async () => {
    const [statsData, recentData] = await Promise.all([
      notesAPI.stats(),
      notesAPI.recent(),
    ])

    setStats(statsData)
    setRecentNotes(recentData.results || recentData)
  }, [])

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      await Promise.all([
        loadCategories(),
        loadSubjects(),
        loadNotes(),
        loadDashboard(),
      ])
    } catch (err) {
      setError(getError(err))
    } finally {
      setLoading(false)
    }
  }, [loadCategories, loadSubjects, loadNotes, loadDashboard])

  useEffect(() => {
    const checkUser = async () => {
      if (!localStorage.getItem('access')) {
        setAuthLoading(false)
        return
      }

      try {
        const profile = await authAPI.me()
        setUser(profile)
      } catch {
        clearTokens()
      } finally {
        setAuthLoading(false)
      }
    }

    checkUser()
  }, [])

  useEffect(() => {
    if (user) loadAll()
  }, [user, loadAll])

  useEffect(() => {
    if (!user) return

    const timer = setTimeout(() => {
      loadNotes().catch((err) => setError(getError(err)))
    }, 350)

    return () => clearTimeout(timer)
  }, [search, page, ordering, user, loadNotes])

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => setSuccess(''), 3500)
    return () => clearTimeout(timer)
  }, [success])

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setAuthError('')
    setAuthSubmitting(true)

    try {
      if (authMode === 'register') {
        await authAPI.register(authForm)
        setAuthMode('login')
        setAuthForm((prev) => ({ ...prev, password: '' }))
        setSuccess('Account created. Please sign in.')
      } else {
        const data = await authAPI.login({
          username: authForm.username,
          password: authForm.password,
        })

        saveTokens(data.access, data.refresh)
        const profile = await authAPI.me()
        setUser(profile)
      }
    } catch (err) {
      setAuthError(getError(err))
    } finally {
      setAuthSubmitting(false)
    }
  }

  const handleLogout = async () => {
    const refresh = localStorage.getItem('refresh')

    try {
      if (refresh) await authAPI.logout(refresh)
    } catch {
      // Clear local tokens even if logout request fails.
    }

    clearTokens()
    setUser(null)
    setNotes([])
    setRecentNotes([])
    setCategories([])
    setSubjects([])
  }

  const openCreateNote = () => {
    setEditingNote(null)
    setNoteForm(EMPTY_NOTE)
    setShowNoteModal(true)
  }

  const openEditNote = (note) => {
    setEditingNote(note)
    setNoteForm({
      title: note.title || '',
      content: note.content || '',
      subject: note.subject ? String(note.subject) : '',
      category: note.category ? String(note.category) : '',
    })
    setShowNoteModal(true)
  }

  const handleSaveNote = async (event) => {
    event.preventDefault()
    setSavingNote(true)
    setError('')

    const payload = {
      title: noteForm.title.trim(),
      content: noteForm.content.trim(),
      subject: noteForm.subject ? Number(noteForm.subject) : null,
      category: noteForm.category ? Number(noteForm.category) : null,
    }

    try {
      if (editingNote) {
        await notesAPI.update(editingNote.id, payload)
        setSuccess('Note updated successfully.')
      } else {
        await notesAPI.create(payload)
        setSuccess('Note created successfully.')
      }

      setShowNoteModal(false)
      setEditingNote(null)
      setNoteForm(EMPTY_NOTE)
      await loadAll()
    } catch (err) {
      setError(getError(err))
    } finally {
      setSavingNote(false)
    }
  }

  const handleDeleteNote = (note) => {
    setConfirmDialog({
      title: 'Delete this note?',
      message: `Are you sure you want to delete "${note.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        await notesAPI.delete(note.id)
        setSuccess('Note deleted successfully.')
        await loadAll()
      },
    })
  }

  const handleTogglePin = async (note) => {
    try {
      await notesAPI.togglePin(note.id, !note.is_pinned)
      setSuccess(note.is_pinned ? 'Note unpinned.' : 'Note pinned.')
      await loadAll()
    } catch (err) {
      setError(getError(err))
    }
  }

  const openItemModal = (type, item = null) => {
    setItemType(type)
    setEditingItem(item)
    setItemName(item?.name || '')
    setShowItemModal(true)
  }

  const handleSaveItem = async (event) => {
    event.preventDefault()
    setSavingItem(true)

    try {
      const payload = { name: itemName.trim() }

      if (itemType === 'category') {
        if (editingItem) {
          await categoriesAPI.update(editingItem.id, payload)
        } else {
          await categoriesAPI.create(payload)
        }
      } else {
        if (editingItem) {
          await subjectsAPI.update(editingItem.id, payload)
        } else {
          await subjectsAPI.create(payload)
        }
      }

      setShowItemModal(false)
      setItemName('')
      setEditingItem(null)
      setSuccess(`${itemType} saved successfully.`)
      await loadAll()
    } catch (err) {
      setError(getError(err))
    } finally {
      setSavingItem(false)
    }
  }

  const handleDeleteItem = (type, item) => {
    const label = type === 'category' ? 'category' : 'subject'

    setConfirmDialog({
      title: `Delete this ${label}?`,
      message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        if (type === 'category') {
          await categoriesAPI.delete(item.id)
        } else {
          await subjectsAPI.delete(item.id)
        }

        setSuccess(`${type} deleted successfully.`)
        await loadAll()
      },
    })
  }

  const handleConfirmDelete = async () => {
    if (!confirmDialog || confirmingDelete) return

    setConfirmingDelete(true)
    setError('')

    try {
      await confirmDialog.onConfirm()
      setConfirmDialog(null)
    } catch (err) {
      setError(getError(err))
    } finally {
      setConfirmingDelete(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#17191E] text-[#FFC15E]">
        <RefreshCw className="animate-spin" size={28} />
      </div>
    )
  }

  if (!user) {
    return (
      <AuthPage
        mode={authMode}
        setMode={setAuthMode}
        form={authForm}
        setForm={setAuthForm}
        onSubmit={handleAuthSubmit}
        loading={authSubmitting}
        error={authError}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    )
  }

  const statCards = [
    {
      label: 'Total Notes',
      value: stats.total_notes,
      icon: FileText,
      accent: 'coral',
    },
    {
      label: 'Pinned Notes',
      value: stats.pinned_notes,
      icon: Pin,
      accent: 'pink',
    },
    {
      label: 'Categories',
      value: stats.total_categories,
      icon: Folder,
      accent: 'yellow',
    },
    {
      label: 'Subjects',
      value: subjects.length,
      icon: BookOpen,
      accent: 'mint',
    },
  ]

  return (
    <div className="min-h-screen bg-[#17191E] text-white md:flex">
      <Sidebar
        activePage={activePage}
        setActivePage={(value) => {
          setActivePage(value)
          setSearch('')
          setPage(1)
        }}
        user={user}
        onLogout={handleLogout}
      />

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <Header
          activePage={activePage}
          user={user}
          onNewNote={openCreateNote}
          onRefresh={loadAll}
        />

        {error && (
          <Alert message={error} type="error" onClose={() => setError('')} />
        )}

        {success && (
          <Alert message={success} type="success" onClose={() => setSuccess('')} />
        )}

        {activePage === 'Dashboard' && (
          <>
            <SearchBar
              search={search}
              setSearch={(value) => {
                setSearch(value)
                setPage(1)
              }}
            />

            <section className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((stat) => (
                <StatsCard key={stat.label} {...stat} />
              ))}
            </section>

            <RecentNotes
              notes={recentNotes}
              categories={categories}
              subjects={subjects}
              onTogglePin={handleTogglePin}
              onEdit={openEditNote}
              onDelete={handleDeleteNote}
              onViewAll={() => setActivePage('My Notes')}
            />
          </>
        )}

        {activePage === 'My Notes' && (
          <NotesPage
            notes={notes}
            categories={categories}
            subjects={subjects}
            search={search}
            setSearch={(value) => {
              setSearch(value)
              setPage(1)
            }}
            ordering={ordering}
            setOrdering={setOrdering}
            onNewNote={openCreateNote}
            onTogglePin={handleTogglePin}
            onEdit={openEditNote}
            onDelete={handleDeleteNote}
            loading={loading}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        )}

        {activePage === 'Categories' && (
          <CategoriesPage
            categories={categories}
            onAdd={() => openItemModal('category')}
            onEdit={(item) => openItemModal('category', item)}
            onDelete={(item) => handleDeleteItem('category', item)}
          />
        )}

        {activePage === 'Subjects' && (
          <SubjectsPage
            subjects={subjects}
            onAdd={() => openItemModal('subject')}
            onEdit={(item) => openItemModal('subject', item)}
            onDelete={(item) => handleDeleteItem('subject', item)}
          />
        )}
      </main>

      {showNoteModal && (
        <NoteModal
          noteForm={noteForm}
          setNoteForm={setNoteForm}
          categories={categories}
          subjects={subjects}
          editing={Boolean(editingNote)}
          onClose={() => setShowNoteModal(false)}
          onSubmit={handleSaveNote}
          saving={savingNote}
        />
      )}

      {showItemModal && (
        <ItemModal
          type={itemType}
          name={itemName}
          setName={setItemName}
          editing={Boolean(editingItem)}
          onClose={() => setShowItemModal(false)}
          onSubmit={handleSaveItem}
          saving={savingItem}
        />
      )}

      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          loading={confirmingDelete}
          onCancel={() => setConfirmDialog(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}

function AuthPage({
  mode, setMode, form, setForm, onSubmit,
  loading, error, showPassword, setShowPassword,
}) {
  const register = mode === 'register'

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#17191E] p-5 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#FF8A5B]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#65D6B0]/15 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-1/3 h-64 w-64 rounded-full bg-[#FFC15E]/10 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#202329] shadow-2xl shadow-black/40 md:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-[#34323A] via-[#283B3B] to-[#24252B] p-10 md:flex">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#FFC15E]/20" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full border border-[#FF8A5B]/20" />
          <div className="pointer-events-none absolute right-10 top-1/2 h-24 w-24 rounded-full bg-[#FF8A5B]/10 blur-2xl" />

          <div className="relative flex items-center gap-3">
            <div className="rounded-xl bg-[#FFC15E] p-2.5 text-[#292522]">
              <GraduationCap size={28} />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              NoteFlow<span className="text-[#FF8A5B]">.</span>
            </span>
          </div>

          <div className="relative">
            <div className="mb-6 inline-flex rounded-2xl bg-[#65D6B0]/15 p-4 text-[#65D6B0]">
              <Sparkles size={34} />
            </div>

            <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight text-white">
              Your ideas.
              <br />
              Your knowledge.
              <br />
              <span className="text-[#FFC15E]">Your space.</span>
            </h1>

            <p className="max-w-sm text-sm leading-7 text-white/65">
              Keep your study notes organized, capture your ideas, and make every learning session count.
            </p>

            <div className="mt-8 flex gap-2">
              <div className="h-1.5 w-10 rounded-full bg-[#FF8A5B]" />
              <div className="h-1.5 w-5 rounded-full bg-[#65D6B0]" />
              <div className="h-1.5 w-5 rounded-full bg-[#FFC15E]" />
              <div className="h-1.5 w-5 rounded-full bg-[#69C9F0]" />
              <div className="h-1.5 w-5 rounded-full bg-[#F28DB8]" />
            </div>
          </div>

          <p className="relative text-xs font-medium tracking-wide text-white/40">
            YOUR PERSONAL LEARNING SPACE · NOTEFLOW
          </p>
        </div>

        <div className="relative p-7 sm:p-10 md:p-12">
          <div className="mb-10 flex items-center gap-3 md:hidden">
            <div className="rounded-xl bg-[#FFC15E] p-2 text-[#292522]">
              <GraduationCap size={25} />
            </div>
            <span className="text-xl font-black tracking-tight">
              NoteFlow<span className="text-[#FF8A5B]">.</span>
            </span>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#FF8A5B]">
              {register ? 'GET STARTED' : 'WELCOME BACK'}
            </p>

            <h2 className="mb-3 text-3xl font-black tracking-tight text-white">
              {register ? 'Create account' : 'Sign in'}
            </h2>

            <p className="text-sm leading-6 text-white/55">
              {register
                ? 'Create your account and start organizing your notes.'
                : 'Sign in to continue to your personal learning space.'}
            </p>
          </div>

          {error && <Alert message={error} type="error" />}

          <form onSubmit={onSubmit} className="space-y-5">
            <Field label="Username">
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="field"
                placeholder="Enter username"
                required
              />
            </Field>

            {register && (
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="field"
                  placeholder="Enter email address"
                  required
                />
              </Field>
            )}

            <Field label="Password">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="field pr-12"
                  placeholder="Enter password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-white/45 transition-colors hover:bg-white/10 hover:text-[#FFC15E]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            <button type="submit" disabled={loading} className={`${PRIMARY_BUTTON} w-full py-3.5`}>
              {loading
                ? 'Please wait...'
                : register
                  ? 'Create Account'
                  : 'Sign In'}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="my-7 h-px bg-white/10" />

          <p className="text-center text-sm text-white/55">
            {register
              ? 'Already have an account?'
              : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setMode(register ? 'login' : 'register')}
              className="font-bold text-[#65D6B0] transition-colors hover:text-[#FFC15E]"
            >
              {register ? 'Sign in' : 'Create account'}
            </button>
          </p>

          <p className="mt-8 text-center text-[10px] font-medium tracking-[0.18em] text-white/25">
            MADE FOR YOUR LEARNING JOURNEY
          </p>
        </div>
      </div>
    </div>
  )
}

function Sidebar({ activePage, setActivePage, user, onLogout }) {
  const items = [
    { name: 'Dashboard', icon: LayoutDashboard, color: '#FFC15E' },
    { name: 'My Notes', icon: FileText, color: '#65D6B0' },
    { name: 'Categories', icon: Folder, color: '#69C9F0' },
    { name: 'Subjects', icon: BookOpen, color: '#F28DB8' },
  ]

  return (
    <aside className="relative flex w-full shrink-0 flex-col overflow-hidden border-b border-white/10 bg-[#202329] p-5 text-white shadow-xl md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-[#FFC15E]/10" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-[#65D6B0]/10" />

      <div className="relative mb-10 flex items-center gap-3">
        <div className="rounded-2xl bg-[#FFC15E] p-3 text-[#292522] shadow-lg shadow-black/20 transition duration-300 hover:rotate-6 hover:scale-110">
          <GraduationCap size={24} />
        </div>

        <div>
          <h1 className="text-xl font-black tracking-tight">
            NoteFlow<span className="text-[#FF8A5B]">.</span>
          </h1>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
            Your learning space
          </p>
        </div>
      </div>

      <div className="relative">
        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
          Workspace
        </p>

        <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {items.map(({ name, icon: Icon, color }) => {
            const isActive = activePage === name

            return (
              <button
                key={name}
                onClick={() => setActivePage(name)}
                className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'translate-x-1 bg-white/10 text-white shadow-lg shadow-black/15'
                    : 'text-white/60 hover:translate-x-1 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon
                  size={19}
                  style={{ color }}
                  className={`shrink-0 transition-transform duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:rotate-[-8deg] group-hover:scale-110'
                  }`}
                />

                <span>{name}</span>

                {isActive && (
                  <span
                    className="ml-auto h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="relative mt-9 hidden overflow-hidden rounded-2xl border border-white/10 bg-[#292D34] p-4 md:block">
        <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#FF8A5B]/10 blur-xl" />

        <div className="mb-3 flex items-center justify-between">
          <Sparkles size={20} className="text-[#FFC15E]" />
          <span className="rounded-full bg-[#65D6B0]/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#65D6B0]">
            Keep going
          </span>
        </div>

        <h3 className="mb-1 text-sm font-bold text-white">
          One page at a time.
        </h3>

        <p className="text-xs leading-5 text-white/50">
          Organize your knowledge and turn little notes into big ideas.
        </p>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 rounded-full bg-linear-to-r from-[#FF8A5B] via-[#FFC15E] to-[#65D6B0]" />
        </div>
      </div>

      <div className="relative mt-7 flex items-center gap-3 border-t border-white/10 pt-5 md:mt-auto">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#65D6B0] font-bold text-[#173D32]">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {user?.username}
          </p>
          <p className="truncate text-[11px] text-white/40">
            {user?.email}
          </p>
        </div>

        <button
          onClick={onLogout}
          title="Log out"
          className="rounded-xl p-2 text-white/50 transition-all duration-300 hover:rotate-[-8deg] hover:bg-[#FF8A5B]/10 hover:text-[#FF8A5B]"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  )
}

function Header({ activePage, user, onNewNote, onRefresh }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-white/50">
          <CalendarDays size={15} className="text-[#FFC15E]" />
          {today}
        </p>

        <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">
          {activePage === 'Dashboard'
            ? `Welcome back, ${user?.username}!`
            : activePage}
        </h2>

        <p className="mt-2 text-sm text-white/45">
          Here's what's happening with your learning space.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          title="Refresh"
          className="rounded-xl border border-white/10 bg-[#202329] p-3 text-[#69C9F0] transition-all duration-300 hover:border-[#69C9F0]/40 hover:bg-[#69C9F0]/10"
        >
          <RefreshCw size={18} />
        </button>

        <button onClick={onNewNote} className={PRIMARY_BUTTON}>
          <Plus size={18} />
          New Note
        </button>
      </div>
    </header>
  )
}

function StatsCard({ label, value, icon: Icon, accent }) {
  const accents = {
    coral: {
      iconBg: 'bg-[#FF8A5B]/15',
      iconColor: 'text-[#FF8A5B]',
      line: 'bg-[#FF8A5B]',
      number: 'text-[#FFAD8C]',
    },
    pink: {
      iconBg: 'bg-[#F28DB8]/15',
      iconColor: 'text-[#F28DB8]',
      line: 'bg-[#F28DB8]',
      number: 'text-[#F5A9C9]',
    },
    yellow: {
      iconBg: 'bg-[#FFC15E]/15',
      iconColor: 'text-[#FFC15E]',
      line: 'bg-[#FFC15E]',
      number: 'text-[#FFD68C]',
    },
    mint: {
      iconBg: 'bg-[#65D6B0]/15',
      iconColor: 'text-[#65D6B0]',
      line: 'bg-[#65D6B0]',
      number: 'text-[#8DE5C7]',
    },
  }

  const style = accents[accent] || accents.coral

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#202329] p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/5 transition-transform duration-500 group-hover:scale-125" />

      <div className="relative mb-6 flex items-center justify-between">
        <p className="text-sm font-medium text-white/60">{label}</p>

        <div className={`rounded-xl p-3 ${style.iconBg} ${style.iconColor} transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}>
          <Icon size={21} />
        </div>
      </div>

      <div className="relative flex items-end justify-between">
        <h3 className={`text-4xl font-black tracking-tight ${style.number}`}>
          {value ?? 0}
        </h3>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Noteflow
        </span>
      </div>

      <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full w-1/3 rounded-full ${style.line} transition-all duration-500 group-hover:w-full`} />
      </div>
    </div>
  )
}

function SearchBar({ search, setSearch }) {
  return (
    <div className="group mb-7 flex items-center gap-3 rounded-xl border border-white/10 bg-[#202329] px-4 py-3 transition-all duration-300 focus-within:border-[#69C9F0]/50 focus-within:shadow-lg focus-within:shadow-[#69C9F0]/5">
      <Search
        size={20}
        className="shrink-0 text-[#69C9F0] transition-transform duration-300 group-focus-within:scale-110"
      />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search notes by title or content..."
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
      />

      {search && (
        <button
          onClick={() => setSearch('')}
          title="Clear search"
          className="rounded-lg p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-[#FF8A5B]"
        >
          <X size={17} />
        </button>
      )}
    </div>
  )
}

function RecentNotes({
  notes, categories, subjects, onTogglePin, onEdit, onDelete, onViewAll,
}) {
  return (
    <section className={`${DARK_PANEL} rounded-2xl p-5`}>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-white">
            Recent Notes
          </h3>
          <p className="mt-1 text-sm text-white/45">
            Your recently updated notes
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="rounded-lg px-3 py-2 text-sm font-semibold text-[#FFC15E] transition-all duration-300 hover:bg-[#FFC15E]/10 hover:text-[#FF8A5B]"
        >
          View all →
        </button>
      </div>

      <div className="space-y-3">
        {notes.length ? (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              categories={categories}
              subjects={subjects}
              onTogglePin={onTogglePin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <EmptyState message="No recent notes yet. Create your first note!" />
        )}
      </div>
    </section>
  )
}

function NotesPage({
  notes, categories, subjects, search, setSearch,
  ordering, setOrdering, onNewNote, onTogglePin,
  onEdit, onDelete, loading, page, totalPages, setPage,
}) {
  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black tracking-tight text-white">
            My Notes
          </h3>
          <p className="mt-1 text-sm text-white/45">
            Manage all your study notes
          </p>
        </div>

        <button onClick={onNewNote} className={PRIMARY_BUTTON}>
          <Plus size={18} />
          Create Note
        </button>
      </div>

      <SearchBar search={search} setSearch={setSearch} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/45">
          {loading ? 'Loading notes...' : `${notes.length} notes on this page`}
        </p>

        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="rounded-xl border border-white/15 bg-[#202329] px-3 py-2 text-sm text-white outline-none transition-colors hover:border-white/30 focus:border-[#FFC15E]"
        >
          <option value="-created_at">Newest first</option>
          <option value="created_at">Oldest first</option>
          <option value="title">Title A–Z</option>
          <option value="-title">Title Z–A</option>
        </select>
      </div>

      <div className="space-y-3">
        {notes.length ? (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              categories={categories}
              subjects={subjects}
              onTogglePin={onTogglePin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <EmptyState
            message={
              search
                ? 'No matching notes found.'
                : 'You have no notes yet. Create your first note!'
            }
          />
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#202329] p-3">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white/75 transition-all hover:border-[#FF8A5B]/50 hover:bg-[#FF8A5B]/10 hover:text-[#FF8A5B] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={17} />
          Previous
        </button>

        <span className="text-sm font-medium text-white/55">
          Page <span className="text-[#FFC15E]">{page}</span> of{' '}
          <span className="text-[#FFC15E]">{totalPages}</span>
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white/75 transition-all hover:border-[#65D6B0]/50 hover:bg-[#65D6B0]/10 hover:text-[#65D6B0] disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next
          <ChevronRight size={17} />
        </button>
      </div>
    </section>
  )
}

function NoteCard({ note, categories, subjects, onTogglePin, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [summaries, setSummaries] = useState([])
  const [summarizing, setSummarizing] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [aiError, setAiError] = useState('')

  const [summaryToDelete, setSummaryToDelete] = useState(null)
  const [deletingSummary, setDeletingSummary] = useState(false)

  const latestSummary = summaries[0] || null
  const noteColor = NOTE_COLORS[note.id % NOTE_COLORS.length]

  useEffect(() => {
    let isActive = true

    const loadHistory = async () => {
      setHistoryLoading(true)
      setAiError('')

      try {
        const data = await aiAPI.getHistory(note.id)

        if (isActive) {
          setSummaries(data)
        }
      } catch (err) {
        if (isActive) {
          setAiError(err.message || 'Unable to load summary history.')
        }
      } finally {
        if (isActive) {
          setHistoryLoading(false)
        }
      }
    }

    loadHistory()

    return () => {
      isActive = false
    }
  }, [note.id])

  const categoryName = categories.find(
    (item) => item.id === note.category
  )?.name

  const subjectName = subjects.find(
    (item) => item.id === note.subject
  )?.name

  const date = note.updated_at
    ? new Date(note.updated_at).toLocaleDateString('en-IN')
    : 'Recently updated'

  const handleSummarize = async () => {
    setSummarizing(true)
    setAiError('')

    try {
      await aiAPI.summarize(note.id)
      const data = await aiAPI.getHistory(note.id)
      setSummaries(data)
    } catch (err) {
      setAiError(err.message || 'Unable to generate summary.')
    } finally {
      setSummarizing(false)
    }
  }

  const handleDeleteSummary = (summaryId) => {
    setSummaryToDelete(summaryId)
  }

  const confirmDeleteSummary = async () => {
    if (summaryToDelete === null || deletingSummary) return

    setDeletingSummary(true)
    setAiError('')

    try {
      await aiAPI.deleteSummary(summaryToDelete)

      setSummaries((previous) =>
        previous.filter((item) => item.id !== summaryToDelete)
      )

      setSummaryToDelete(null)
    } catch (err) {
      setAiError(err.message || 'Unable to delete summary.')
    } finally {
      setDeletingSummary(false)
    }
  }

  return (
    <article className={`group overflow-hidden rounded-2xl border p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${noteColor.card}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className={`shrink-0 rounded-xl p-3 transition-transform duration-300 group-hover:rotate-3 ${noteColor.icon}`}>
            <FileText size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h4 className={`wrap-break-word font-bold ${noteColor.title}`}>
                {note.title}
              </h4>

              {note.is_pinned && (
                <Pin size={14} className="shrink-0 text-[#C45B2C]" />
              )}
            </div>

            <div className={`mb-3 flex flex-wrap items-center gap-2 text-xs ${noteColor.muted}`}>
              {subjectName && <span>{subjectName}</span>}
              <span>Updated {date}</span>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              {categoryName && (
                <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${noteColor.tag}`}>
                  {categoryName}
                </span>
              )}

              {subjectName && (
                <span className="rounded-lg bg-white/60 px-2.5 py-1 text-xs font-semibold text-[#43515B]">
                  {subjectName}
                </span>
              )}
            </div>

            {note.content && (
              <>
                <p className={`whitespace-pre-wrap wrap-break-word text-sm leading-7 ${noteColor.text} ${expanded ? '' : 'line-clamp-2'}`}>
                  {note.content}
                </p>

                {note.content.length > 120 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className={`mt-2 text-xs font-bold underline decoration-current/30 underline-offset-4 transition-opacity hover:opacity-70 ${noteColor.title}`}
                  >
                    {expanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => onTogglePin(note)}
            title={note.is_pinned ? 'Unpin note' : 'Pin note'}
            className={`rounded-lg p-2 transition-all duration-200 ${noteColor.action}`}
          >
            <Pin size={18} />
          </button>

          <button
            onClick={() => onEdit(note)}
            title="Edit note"
            className={`rounded-lg p-2 transition-all duration-200 ${noteColor.action}`}
          >
            <Pencil size={17} />
          </button>

          <button
            onClick={() => onDelete(note)}
            title="Delete note"
            className="rounded-lg p-2 text-[#A83D3D] transition-all duration-200 hover:bg-red-500/15"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-5 border-t border-black/10 pt-4">
        <button
          onClick={handleSummarize}
          disabled={summarizing || !note.content?.trim()}
          className="flex items-center gap-2 rounded-xl border border-black/10 bg-white/55 px-4 py-2.5 text-sm font-bold text-[#34434C] transition-all duration-300 hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {summarizing ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Generating summary...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              {latestSummary ? 'Regenerate Summary' : 'Summarize with AI'}
            </>
          )}
        </button>

        {aiError && (
          <div className="mt-3 rounded-xl border border-red-500/20 bg-red-100/80 p-3 text-sm text-red-700">
            {aiError}
          </div>
        )}

        {historyLoading && (
          <p className={`mt-3 text-xs ${noteColor.muted}`}>
            Loading saved summaries...
          </p>
        )}

        {latestSummary && (
          <div className={`mt-4 rounded-xl border p-4 ${noteColor.summary}`}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h5 className={`flex items-center gap-2 text-sm font-bold ${noteColor.summaryTitle}`}>
                <Sparkles size={17} />
                AI Generated Summary
              </h5>

              <button
                onClick={() => handleDeleteSummary(latestSummary.id)}
                title="Delete summary permanently"
                className="rounded-lg p-1 text-black/40 transition-colors hover:bg-red-500/10 hover:text-red-600"
              >
                <X size={17} />
              </button>
            </div>

            <p className={`whitespace-pre-wrap wrap-break-word text-sm leading-7 ${noteColor.text}`}>
              {latestSummary.summary}
            </p>

            <p className={`mt-3 text-xs ${noteColor.muted}`}>
              Generated: {new Date(latestSummary.created_at).toLocaleString('en-IN')}
            </p>
          </div>
        )}

        {summaries.length > 1 && (
          <div className="mt-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`text-sm font-bold underline decoration-current/30 underline-offset-4 transition-opacity hover:opacity-70 ${noteColor.title}`}
            >
              {showHistory ? 'Hide' : 'View'} previous summaries ({summaries.length - 1})
            </button>

            {showHistory && (
              <div className="mt-3 space-y-3">
                {summaries.slice(1).map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-black/10 bg-white/50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className={`text-xs font-bold ${noteColor.muted}`}>
                        Previous version {index + 1}
                      </span>

                      <button
                        onClick={() => handleDeleteSummary(item.id)}
                        title="Delete this summary permanently"
                        className="rounded-lg p-1 text-black/35 transition-colors hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <p className={`whitespace-pre-wrap wrap-break-word text-sm leading-7 ${noteColor.text}`}>
                      {item.summary}
                    </p>

                    <p className={`mt-3 text-xs ${noteColor.muted}`}>
                      {new Date(item.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {summaryToDelete !== null && (
        <ConfirmDialog
          title="Delete this summary?"
          message="Are you sure you want to permanently delete this AI-generated summary?"
          loading={deletingSummary}
          onCancel={() => setSummaryToDelete(null)}
          onConfirm={confirmDeleteSummary}
        />
      )}
    </article>
  )
}

function CategoriesPage({ categories, onAdd, onEdit, onDelete }) {
  return (
    <section>
      <PageHeading
        title="Categories"
        description="Organize your notes by category"
        button="Add Category"
        onAdd={onAdd}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((item, index) => (
          <ItemCard
            key={item.id}
            item={item}
            icon={Folder}
            color={COLORS[index % COLORS.length]}
            subtitle={`${item.note_count ?? 0} notes in this category`}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {!categories.length && (
        <EmptyState message="No categories yet. Add your first category." />
      )}
    </section>
  )
}

function SubjectsPage({ subjects, onAdd, onEdit, onDelete }) {
  return (
    <section className="animate-[fade-up_0.4s_ease-out]">
      <PageHeading
        title="Subjects"
        description="Organize your learning journey, one subject at a time."
        button="Add Subject"
        onAdd={onAdd}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {subjects.map((item, index) => (
          <ItemCard
            key={item.id}
            item={item}
            icon={BookOpen}
            color={COLORS[(index + 1) % COLORS.length]}
            subtitle="Study subject"
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {!subjects.length && (
        <EmptyState message="No subjects yet. Add your first subject and start organizing your study notes." />
      )}
    </section>
  )
}

function PageHeading({ title, description, button, onAdd }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 className="text-xl font-black tracking-tight text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm text-white/45">
          {description}
        </p>
      </div>

      <button onClick={onAdd} className={PRIMARY_BUTTON}>
        <Plus size={18} />
        {button}
      </button>
    </div>
  )
}

function ItemCard({ item, icon: Icon, color, subtitle, onEdit, onDelete }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#202329] p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-white/5 transition-transform duration-500 group-hover:scale-125" />

      <div className="relative mb-5 inline-flex rounded-xl p-3 transition-transform duration-300 group-hover:rotate-6">
        <span className={`absolute inset-0 rounded-xl ${color}`} />
        <Icon size={23} className="relative" />
      </div>

      <h4 className="relative wrap-break-word text-lg font-bold text-white">
        {item.name}
      </h4>

      <p className="relative mt-2 text-xs text-white/45">
        {subtitle}
      </p>

      <div className="relative mt-5 flex gap-2 border-t border-white/10 pt-4">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 rounded-lg border border-[#FFC15E]/20 bg-[#FFC15E]/10 py-2.5 text-xs font-semibold text-[#FFC15E] transition-all duration-200 hover:border-[#FFC15E]/50 hover:bg-[#FFC15E]/20"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(item)}
          className="flex-1 rounded-lg border border-red-400/20 bg-red-500/10 py-2.5 text-xs font-semibold text-red-300 transition-all duration-200 hover:border-red-400/40 hover:bg-red-500/20"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

function NoteModal({
  noteForm, setNoteForm, categories, subjects,
  editing, onClose, onSubmit, saving,
}) {
  return (
    <Modal onClose={onClose}>
      <ModalHeading
        title={editing ? 'Edit Note' : 'Create New Note'}
        onClose={onClose}
      />

      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Note Title">
          <input
            value={noteForm.title}
            onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
            placeholder="Enter note title"
            minLength={3}
            maxLength={200}
            required
            className="field"
          />
        </Field>

        <Field label="Content">
          <textarea
            value={noteForm.content}
            onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
            placeholder="Write your note..."
            rows={7}
            required
            className="field resize-y"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Subject">
            <select
              value={noteForm.subject}
              onChange={(e) => setNoteForm({ ...noteForm, subject: e.target.value })}
              className="field"
            >
              <option value="">No subject</option>
              {subjects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Category">
            <select
              value={noteForm.category}
              onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
              className="field"
            >
              <option value="">No category</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <ModalActions
          onClose={onClose}
          saving={saving}
          submitText={editing ? 'Save Changes' : 'Create Note'}
        />
      </form>
    </Modal>
  )
}

function ItemModal({ type, name, setName, editing, onClose, onSubmit, saving }) {
  const label = type === 'category' ? 'Category' : 'Subject'

  return (
    <Modal onClose={onClose}>
      <ModalHeading
        title={editing ? `Edit ${label}` : `Add ${label}`}
        onClose={onClose}
      />

      <form onSubmit={onSubmit} className="space-y-5">
        <Field label={`${label} Name`}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()} name`}
            maxLength={100}
            required
            className="field"
          />
        </Field>

        <ModalActions
          onClose={onClose}
          saving={saving}
          submitText="Save"
        />
      </form>
    </Modal>
  )
}

function ConfirmDialog({
  title,
  message,
  loading,
  onCancel,
  onConfirm,
}) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onCancel()
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#292D31] p-6 shadow-2xl shadow-black/40">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF8A5B]/15 text-[#FF8A5B]">
            <Trash2 size={23} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black text-white">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/55">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={SECONDARY_BUTTON}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF765F] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#FF765F]/15 transition-all hover:bg-[#FF5D4A] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={15} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#202329] p-6 shadow-2xl">
        {children}
      </div>
    </div>
  )
}

function ModalHeading({ title, onClose }) {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
      <div>
        <h2 className="text-xl font-black tracking-tight text-white">
          {title}
        </h2>
        <div className="mt-2 h-1 w-10 rounded-full bg-linear-to-r from-[#FF8A5B] to-[#FFC15E]" />
      </div>

      <button
        type="button"
        onClick={onClose}
        title="Close"
        className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/50 transition-all duration-200 hover:border-[#FF8A5B]/40 hover:bg-[#FF8A5B]/10 hover:text-[#FF8A5B]"
      >
        <X size={19} />
      </button>
    </div>
  )
}

function ModalActions({ onClose, saving, submitText }) {
  return (
    <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
      <button
        type="button"
        onClick={onClose}
        className={SECONDARY_BUTTON}
      >
        Cancel
      </button>

      <button disabled={saving} className={PRIMARY_BUTTON}>
        {saving ? 'Saving...' : submitText}
      </button>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-white/75">
        {label}
      </span>
      {children}
    </label>
  )
}

function Alert({ message, type = 'error', onClose }) {
  const style = type === 'error'
    ? 'border-red-400/20 bg-red-500/10 text-red-300'
    : 'border-[#65D6B0]/20 bg-[#65D6B0]/10 text-[#8DE5C7]'

  return (
    <div className={`mb-5 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${style}`}>
      <span>{message}</span>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          title="Dismiss alert"
          className="shrink-0 rounded-lg p-1 opacity-70 transition-opacity hover:bg-white/5 hover:opacity-100"
        >
          <X size={17} />
        </button>
      )}
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-[#202329]/60 px-5 py-14 text-center transition-colors duration-300 hover:border-[#FFC15E]/30">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFC15E]/10">
        <FileText size={27} className="text-[#FFC15E]" />
      </div>

      <p className="mx-auto max-w-sm text-sm leading-6 text-white/50">
        {message}
      </p>
    </div>
  )
}

export default App
