"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/admin/chart-card";
import {
  DAILY_TREND,
  SUPPORT_REQUESTED,
  VISITS_BY_ZONE,
  VISIT_TYPE_SPLIT,
  type NameValue,
} from "@/data/adminMock";

const BRAND = "#B71C1C";
const PALETTE = ["#B71C1C", "#E05252", "#F0A0A0", "#911616", "#6E1010"];

export function AdminCharts() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Visits by Zone">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={VISITS_BY_ZONE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: "#FDECEC" }} />
            <Bar dataKey="value" fill={BRAND} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Visit Type Split">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={VISIT_TYPE_SPLIT}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
            >
              {VISIT_TYPE_SPLIT.map((_: NameValue, i: number) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Daily Visit Trend">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DAILY_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
            <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="visits" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top Support Requested">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SUPPORT_REQUESTED} layout="vertical" margin={{ left: 12 }}>
            <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              fontSize={12}
              width={80}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip cursor={{ fill: "#FDECEC" }} />
            <Bar dataKey="value" fill={BRAND} radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
