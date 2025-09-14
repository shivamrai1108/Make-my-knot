import React, { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  placeholder?: string
  className?: string
  maxDate?: string
  minDate?: string
  required?: boolean
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className = '',
  maxDate,
  minDate,
  required = false
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(new Date())
  const [showYearPicker, setShowYearPicker] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Parse the current value
  const selectedDate = value ? new Date(value) : null
  
  // Set initial view date to selected date or today
  useEffect(() => {
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      setViewDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
    }
  }, [value])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowYearPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isDateDisabled = (date: Date) => {
    if (maxDate && date > new Date(maxDate)) return true
    if (minDate && date < new Date(minDate)) return true
    return false
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    if (!isDateDisabled(newDate)) {
      const dateString = newDate.toISOString().split('T')[0]
      onChange(dateString)
      setIsOpen(false)
    }
  }

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate)
    if (direction === 'prev') {
      newDate.setMonth(viewDate.getMonth() - 1)
    } else {
      newDate.setMonth(viewDate.getMonth() + 1)
    }
    setViewDate(newDate)
  }

  const handleYearChange = (year: number) => {
    const newDate = new Date(viewDate)
    newDate.setFullYear(year)
    setViewDate(newDate)
    setShowYearPicker(false)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(viewDate)
    const firstDay = getFirstDayOfMonth(viewDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
      const isSelected = selectedDate && 
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === viewDate.getMonth() &&
        selectedDate.getFullYear() === viewDate.getFullYear()
      const isDisabled = isDateDisabled(date)
      const isToday = new Date().toDateString() === date.toDateString()

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isDisabled}
          className={`
            w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
            ${isSelected
              ? 'bg-primary-600 text-white shadow-lg scale-105'
              : isToday
              ? 'bg-primary-100 text-primary-800 border-2 border-primary-300'
              : isDisabled
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
            }
            ${!isDisabled && !isSelected ? 'hover:scale-105' : ''}
          `}
        >
          {day}
        </button>
      )
    }

    return days
  }

  const renderYearPicker = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    const startYear = Math.max(1900, currentYear - 100)
    const endYear = currentYear + 10

    for (let year = endYear; year >= startYear; year--) {
      years.push(
        <button
          key={year}
          onClick={() => handleYearChange(year)}
          className={`
            p-2 text-sm rounded-lg transition-all duration-200
            ${viewDate.getFullYear() === year
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 hover:bg-primary-50'
            }
          `}
        >
          {year}
        </button>
      )
    }

    return years
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input Field */}
      <div
        className={`
          relative flex items-center w-full px-4 py-3 border border-gray-300 rounded-lg 
          focus-within:ring-2 focus-within:ring-primary-600 focus-within:border-transparent
          cursor-pointer transition-all duration-200 hover:border-primary-300
          ${className}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={selectedDate ? formatDisplayDate(selectedDate) : ''}
          placeholder={placeholder}
          readOnly
          required={required}
          className="flex-1 bg-transparent outline-none cursor-pointer text-gray-900 placeholder-gray-500"
        />
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4">
          {showYearPicker ? (
            <div>
              {/* Year Picker Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowYearPicker(false)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Back to Calendar
                </button>
              </div>

              {/* Year Grid */}
              <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {renderYearPicker()}
              </div>
            </div>
          ) : (
            <div>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => handleMonthChange('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <button
                  onClick={() => setShowYearPicker(true)}
                  className="flex-1 text-center font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                </button>

                <button
                  onClick={() => handleMonthChange('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="w-10 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => {
                const today = new Date()
                if (!isDateDisabled(today)) {
                  onChange(today.toISOString().split('T')[0])
                  setIsOpen(false)
                }
              }}
              className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => {
                onChange('')
                setIsOpen(false)
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
