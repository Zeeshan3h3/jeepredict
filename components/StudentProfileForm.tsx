'use client'

import { useState } from 'react'

interface StudentProfileFormProps {
  initialData: {
    name: string
    email: string | null
    marks: number | null
    category: string | null
    gender: string | null
  }
  onSave: (data: {
    name: string
    email: string | null
    marks: number | null
    category: string | null
    gender: string | null
  }) => Promise<void>
  isSaving: boolean
}

const inputClass =
  'w-full border border-[#E2E8F4] rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition bg-white'

export default function StudentProfileForm({
  initialData,
  onSave,
  isSaving,
}: StudentProfileFormProps) {
  const [name, setName] = useState(initialData.name ?? '')
  const [email, setEmail] = useState(initialData.email ?? '')
  const [marks, setMarks] = useState(initialData.marks?.toString() ?? '')
  const [category, setCategory] = useState(initialData.category ?? '')
  const [gender, setGender] = useState(initialData.gender ?? '')
  const [saved, setSaved] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSave() {
    if (!name.trim()) {
      setFormError('Name is required')
      return
    }
    setFormError(null)
    await onSave({
      name: name.trim(),
      email: email.trim() || null,
      marks: marks ? Number(marks) : null,
      category: category || null,
      gender: gender || null,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-[#0F1B4C] mb-1">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Arjun Sharma"
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#0F1B4C] mb-1">
          Email{' '}
          <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full">
            Optional
          </span>
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@gmail.com"
          className={inputClass}
        />
      </div>

      {/* Marks */}
      <div>
        <label className="block text-sm font-medium text-[#0F1B4C] mb-1">JEE Marks</label>
        <input
          type="number"
          min={0}
          max={360}
          value={marks}
          onChange={e => setMarks(e.target.value)}
          placeholder="e.g. 185"
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-[#0F1B4C] mb-1">Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={inputClass + ' appearance-none cursor-pointer'}
        >
          <option value="">Select Category</option>
          <option value="GEN">General (GEN)</option>
          <option value="OBC-NCL">OBC-NCL</option>
          <option value="EWS">EWS</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
        </select>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-[#0F1B4C] mb-2">Gender</label>
        <div className="flex gap-3">
          {[
            { label: 'Gender Neutral', value: 'gender-neutral' },
            { label: 'Female', value: 'female-only' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setGender(opt.value)}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition border ${
                gender === opt.value
                  ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                  : 'bg-white text-gray-600 border-[#E2E8F4]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {formError && <p className="text-red-500 text-xs">{formError}</p>}

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-green-700 text-sm font-medium">Profile updated ✓</p>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </button>
    </div>
  )
}
