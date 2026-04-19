'use client'

import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Calculator } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MortgageCalculatorProps {
  defaultPrice?: number
  className?: string
}

function InputRow({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  prefix?: string
  suffix?: string
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-xs text-text-muted font-heading uppercase tracking-widest">{label}</label>
        <span className="text-xs text-gold font-heading font-semibold">
          {prefix}
          {typeof value === 'number' && value >= 1000 ? value.toLocaleString() : value}
          {suffix}
        </span>
      </div>
      <div className="relative h-1 bg-bg-border rounded mb-1">
        <div
          className="absolute h-1 bg-gold rounded"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-1"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gold border-2 border-bg-base rounded-full pointer-events-none shadow"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-text-muted font-heading">
        <span>{prefix}{typeof min === 'number' && min >= 1000 ? min.toLocaleString() : min}{suffix}</span>
        <span>{prefix}{typeof max === 'number' && max >= 1000 ? max.toLocaleString() : max}{suffix}</span>
      </div>
    </div>
  )
}

export function MortgageCalculator({ defaultPrice = 500000, className }: MortgageCalculatorProps) {
  const [price, setPrice] = useState(defaultPrice)
  const [downPct, setDownPct] = useState(20)
  const [rate, setRate] = useState(5.5)
  const [years, setYears] = useState(25)

  const { monthly, totalPaid, totalInterest, principal } = useMemo(() => {
    const principal = price * (1 - downPct / 100)
    const monthlyRate = rate / 100 / 12
    const n = years * 12
    let monthly: number
    if (monthlyRate === 0) {
      monthly = principal / n
    } else {
      monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
    }
    const totalPaid = monthly * n
    const totalInterest = totalPaid - principal
    return { monthly, totalPaid, totalInterest, principal }
  }, [price, downPct, rate, years])

  const downPayment = price * (downPct / 100)

  const pieData = [
    { name: 'Principal', value: Math.round(principal) },
    { name: 'Interest', value: Math.round(totalInterest) },
    { name: 'Down Payment', value: Math.round(downPayment) },
  ]

  const COLORS = ['#60A5FA', '#C9A84C', '#4ADE80']

  const fmt = (v: number) =>
    v >= 1000000
      ? `$${(v / 1000000).toFixed(2)}M`
      : `$${Math.round(v).toLocaleString()}`

  return (
    <div className={cn('bg-bg-card border border-bg-border p-6', className)}>
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-gold" />
        <h3 className="font-display text-xl font-medium text-white">Mortgage Calculator</h3>
      </div>

      <div className="space-y-5">
        <InputRow
          label="Home Price"
          value={price}
          onChange={setPrice}
          min={100000}
          max={2000000}
          step={25000}
          prefix="$"
        />
        <InputRow
          label="Down Payment"
          value={downPct}
          onChange={setDownPct}
          min={5}
          max={50}
          step={1}
          suffix="%"
        />
        <InputRow
          label="Interest Rate"
          value={rate}
          onChange={setRate}
          min={1}
          max={12}
          step={0.1}
          suffix="%"
        />
        <InputRow
          label="Amortization Period"
          value={years}
          onChange={setYears}
          min={5}
          max={30}
          step={5}
          suffix=" yrs"
        />
      </div>

      {/* Result */}
      <div className="mt-6 p-4 bg-bg-elevated border border-gold/20 text-center">
        <p className="text-text-muted text-xs font-heading uppercase tracking-widest mb-1">
          Estimated Monthly Payment
        </p>
        <p className="font-display text-4xl text-gold font-light">{fmt(monthly)}</p>
        <p className="text-text-muted text-xs mt-1">Based on {rate}% interest, {years}-year amortization</p>
      </div>

      {/* Chart */}
      <div className="mt-6 flex flex-col items-center">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#111118',
                border: '1px solid #2A2A38',
                borderRadius: 0,
                fontSize: 12,
                color: '#fff',
              }}
              formatter={(value: unknown) => fmt(Number(value))}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {pieData.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
              <span className="text-xs text-text-secondary">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="bg-bg-elevated p-3 text-center">
          <p className="text-[10px] text-text-muted font-heading uppercase tracking-widest mb-1">Down Payment</p>
          <p className="text-sm font-heading font-bold text-white">{fmt(downPayment)}</p>
        </div>
        <div className="bg-bg-elevated p-3 text-center">
          <p className="text-[10px] text-text-muted font-heading uppercase tracking-widest mb-1">Total Interest</p>
          <p className="text-sm font-heading font-bold text-gold">{fmt(totalInterest)}</p>
        </div>
        <div className="bg-bg-elevated p-3 text-center col-span-2">
          <p className="text-[10px] text-text-muted font-heading uppercase tracking-widest mb-1">Total Cost</p>
          <p className="text-sm font-heading font-bold text-white">{fmt(totalPaid + downPayment)}</p>
        </div>
      </div>

      <p className="mt-4 text-[10px] text-text-muted text-center leading-relaxed">
        * Estimate only. Consult a mortgage advisor for personalised advice.
      </p>
    </div>
  )
}
