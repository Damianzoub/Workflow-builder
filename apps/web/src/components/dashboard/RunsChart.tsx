'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { mockStats } from '@/mock/stats'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const data = DAYS.map((day, i) => ({ day, runs: mockStats.runsPerDay[i] }))

export default function RunsChart() {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-5">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-500">Runs this week</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={24}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 11 }}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 6, color: '#f9fafb', fontSize: 12 }}
            cursor={{ fill: 'rgba(99,102,241,0.1)' }}
          />
          <Bar dataKey="runs" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
