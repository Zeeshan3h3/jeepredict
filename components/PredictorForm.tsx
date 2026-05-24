'use client'

import { useState } from 'react'
import { Info, Lock } from 'lucide-react'

interface PredictorFormProps {
  onSubmit: (input: { totalMarks: number; category: string; gender: string }) => void
  isLoading: boolean
}

type Errors = { marks?: string; category?: string; gender?: string }
type Touched = { marks: boolean; category: boolean; gender: boolean }

export default function PredictorForm({ onSubmit, isLoading }: PredictorFormProps) {
  const [marks, setMarks] = useState('')
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Touched>({ marks: false, category: false, gender: false })

  function validate(m: string, c: string, g: string): Errors {
    const errs: Errors = {}
    const numMarks = Number(m)
    if (!m || isNaN(numMarks) || numMarks < 0 || numMarks > 360) {
      errs.marks = 'Please enter valid marks between 0 and 360'
    }
    if (!c) {
      errs.category = 'Please select your category'
    }
    if (!g) {
      errs.gender = 'Please select your gender'
    }
    return errs
  }

  function handleMarksChange(val: string) {
    setMarks(val)
    if (touched.marks) {
      const errs = validate(val, category, gender)
      setErrors(prev => ({ ...prev, marks: errs.marks }))
    }
  }

  function handleCategoryChange(val: string) {
    setCategory(val)
    if (touched.category) {
      const errs = validate(marks, val, gender)
      setErrors(prev => ({ ...prev, category: errs.category }))
    }
  }

  function handleGenderChange(val: string) {
    setGender(val)
    if (touched.gender) {
      const errs = validate(marks, category, val)
      setErrors(prev => ({ ...prev, gender: errs.gender }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ marks: true, category: true, gender: true })
    const errs = validate(marks, category, gender)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onSubmit({
      totalMarks: Number(marks),
      category,
      gender,
    })
  }

  const baseInput =
    'w-full border border-[#E2E8F4] rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition bg-white'
  const errorInput =
    'w-full border border-red-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition bg-white'

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#E2E8F4]"
      noValidate
    >
      {/* Exam Selector */}
      <div className="mb-6">
        <label className="block font-medium text-[#0F1B4C] text-sm mb-2">
          Which exam did you appear for?
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="flex-1 rounded-xl px-4 py-3 text-sm font-medium transition cursor-pointer border bg-[#FF6B35] text-white border-[#FF6B35]"
          >
            JEE Advanced ✓
          </button>
          <button
            type="button"
            disabled
            className="flex-1 rounded-xl px-4 py-3 text-sm font-medium transition border bg-gray-50 text-gray-400 border-gray-200 flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Lock size={14} />
            JEE Mains (Coming Soon)
          </button>
        </div>
      </div>

      {/* Field 1 — Marks */}
      <div className="mb-5">
        <label className="block font-medium text-[#0F1B4C] text-sm mb-0.5">
          Your JEE Advanced 2026 Marks
        </label>
        <p className="text-xs text-gray-400 mb-2">Total marks out of 360</p>
        <div className="relative">
          <input
            type="number"
            min={0}
            max={360}
            value={marks}
            placeholder="e.g. 185"
            onChange={e => handleMarksChange(e.target.value)}
            onBlur={() => {
              setTouched(prev => ({ ...prev, marks: true }))
              const errs = validate(marks, category, gender)
              setErrors(prev => ({ ...prev, marks: errs.marks }))
            }}
            className={
              (touched.marks && errors.marks ? errorInput : baseInput) + ' pr-20'
            }
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
            {marks || '0'} / 360
          </span>
        </div>
        {touched.marks && errors.marks && (
          <p className="text-red-500 text-xs mt-1">{errors.marks}</p>
        )}
      </div>

      {/* Field 2 — Category */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-2">
          <label className="font-medium text-[#0F1B4C] text-sm">
            Your Category
          </label>
          <div className="relative group">
            <Info size={14} className="text-gray-400 cursor-pointer" />
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-[#0F1B4C] text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 leading-relaxed">
              Select the category under which you appeared for JEE Advanced 2026
              <span className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-[#0F1B4C]" />
            </div>
          </div>
        </div>
        <select
          value={category}
          onChange={e => handleCategoryChange(e.target.value)}
          onBlur={() => {
            setTouched(prev => ({ ...prev, category: true }))
            const errs = validate(marks, category, gender)
            setErrors(prev => ({ ...prev, category: errs.category }))
          }}
          className={
            (touched.category && errors.category ? errorInput : baseInput) +
            ' appearance-none cursor-pointer ' +
            (category ? 'text-gray-900' : 'text-gray-400')
          }
        >
          <option value="">Select Category</option>
          <option value="GEN">General (GEN)</option>
          <option value="OBC-NCL">OBC-NCL</option>
          <option value="EWS">EWS</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
        </select>
        {touched.category && errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category}</p>
        )}
      </div>

      {/* Field 3 — Gender toggle pills */}
      <div className="mb-6">
        <label className="block font-medium text-[#0F1B4C] text-sm mb-2">
          Gender
        </label>
        <div className="flex gap-3">
          {[
            { label: 'Male / Gender Neutral', value: 'gender-neutral' },
            { label: 'Female', value: 'female-only' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleGenderChange(opt.value)}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition cursor-pointer border ${
                gender === opt.value
                  ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                  : 'bg-white text-gray-600 border-[#E2E8F4] hover:border-[#FF6B35]/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {touched.gender && errors.gender && (
          <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 rounded-xl text-base font-semibold transition-all duration-150 flex items-center justify-center gap-2 ${
          isLoading
            ? 'bg-[#FF6B35]/70 text-white cursor-not-allowed opacity-70'
            : 'bg-[#FF6B35] text-white hover:opacity-90 active:scale-95'
        }`}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Predicting...
          </>
        ) : (
          'Predict My Rank  →'
        )}
      </button>

      <p className="text-center text-xs text-gray-400 mt-3">
        🔒 Free forever. No account needed. Results in seconds.
      </p>
    </form>
  )
}
