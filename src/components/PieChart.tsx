"use client"
import React from "react"
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts"
const COLORS = ["#FF4D4D", "#FFD166", "#06D6A0", "#E568FF", "#66E3F4"]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PieGraph({ data, label, total }: any) {
  return (
    <ResponsiveContainer width={180} height={180}>
      <PieChart width={160} height={160}>
        <Pie
          className="outline-none"
          data={data}
          dataKey="count"
          nameKey="category"
          cx="50%"
          cy="50%"
          fill="#8884d8"
          innerRadius={65}
          outerRadius={80}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {data?.map((entry: any, index: any) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="none"
              className="outline-none"
            >
              {entry.category}
            </Cell>
          ))}
          <Label
            content={
              <CustomLabel labelText={label} value={total} total={total} />
            }
            className="outline-none"
            position="center"
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomLabel = ({ viewBox, total }: any) => {
  const { cx, cy } = viewBox
  return (
    <g>
      <text
        x={cx}
        y={cy - 6}
        className="text-3xl font-semibold text-white"
        textAnchor="middle"
        dominantBaseline="central"
        alignmentBaseline="middle"
        fill="#FFFFFF"
        fontSize="22"
        fontWeight="600"
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 20}
        className="text-base font-medium text-[#CCC]"
        textAnchor="middle"
        dominantBaseline="central"
        alignmentBaseline="middle"
        fill="#FFFFFF"
        fontSize="22"
        fontWeight="600"
      >
        Issues Found
      </text>
    </g>
  )
}
