"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export interface DailyPoint {
  date: string;
  transactions: number;
  revenue: number;
}

export function AdminChart({ data }: { data: DailyPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#6C63FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="date" stroke="#9CA0C0" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9CA0C0" fontSize={12} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            contentStyle={{ background: "#14162A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
            labelStyle={{ color: "#F1F1F8" }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#6C63FF" strokeWidth={2} fill="url(#revenueGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
