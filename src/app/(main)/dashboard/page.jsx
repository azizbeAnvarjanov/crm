"use client"
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Recharts for charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

// Mock local data (replace with a real fetch from your local API or Firebase)
const rawData = {
  branches: [
    { id: "B1", name: "Filial A" },
    { id: "B2", name: "Filial B" },
    { id: "B3", name: "Filial C" },
  ],
  // last 7 days lead counts per branch with statuses and sources
  daily: [
    // date, branch, status counts, source counts
    {
      date: "2025-11-30",
      branch: "Filial A",
      statuses: { yangi: 5, otkaz: 3, tugatilgan: 2 },
      sources: { telegram: 3, facebook: 4, instagram: 3 },
    },
    {
      date: "2025-12-01",
      branch: "Filial B",
      statuses: { yangi: 6, otkaz: 2, tugatilgan: 1 },
      sources: { telegram: 2, facebook: 5, instagram: 2 },
    },
    {
      date: "2025-12-02",
      branch: "Filial C",
      statuses: { yangi: 4, otkaz: 4, tugatilgan: 1 },
      sources: { telegram: 1, facebook: 4, instagram: 4 },
    },
    {
      date: "2025-12-03",
      branch: "Filial A",
      statuses: { yangi: 7, otkaz: 1, tugatilgan: 3 },
      sources: { telegram: 5, facebook: 3, instagram: 3 },
    },
    {
      date: "2025-12-04",
      branch: "Filial B",
      statuses: { yangi: 3, otkaz: 6, tugatilgan: 2 },
      sources: { telegram: 2, facebook: 5, instagram: 4 },
    },
    {
      date: "2025-12-05",
      branch: "Filial C",
      statuses: { yangi: 8, otkaz: 2, tugatilgan: 5 },
      sources: { telegram: 4, facebook: 6, instagram: 5 },
    },
    {
      date: "2025-12-06",
      branch: "Filial A",
      statuses: { yangi: 2, otkaz: 3, tugatilgan: 6 },
      sources: { telegram: 3, facebook: 3, instagram: 5 },
    },
  ],
};

const STATUS_COLORS = {
  yangi: "#06b6d4", // cyan-500
  otkaz: "#f59e0b", // amber-500
  tugatilgan: "#10b981", // emerald-500
};

const SOURCE_COLORS = ["#6366f1", "#ef4444", "#06b6d4"];

export default function LeadsDashboard() {
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [dateFilter, setDateFilter] = useState("Last 7 days");

  // Prepare aggregated stats based on mock data
  const branches = rawData.branches;

  const filteredDaily = useMemo(() => {
    // For this mock we simply return all daily entries or filter by branch
    return rawData.daily.filter(
      (d) => selectedBranch === "All" || d.branch === selectedBranch
    );
  }, [selectedBranch]);

  // Total leads per branch
  const totalsByBranch = useMemo(() => {
    const map = {};
    branches.forEach(
      (b) => (map[b.name] = { yangi: 0, otkaz: 0, tugatilgan: 0, total: 0 })
    );
    filteredDaily.forEach((row) => {
      const entry = map[row.branch];
      if (!entry) return;
      entry.yangi += row.statuses.yangi;
      entry.otkaz += row.statuses.otkaz;
      entry.tugatilgan += row.statuses.tugatilgan;
      entry.total +=
        row.statuses.yangi + row.statuses.otkaz + row.statuses.tugatilgan;
    });
    return map;
  }, [filteredDaily, branches]);

  const overallTotals = useMemo(() => {
    const t = { yangi: 0, otkaz: 0, tugatilgan: 0, total: 0 };
    Object.values(totalsByBranch).forEach((b) => {
      t.yangi += b.yangi;
      t.otkaz += b.otkaz;
      t.tugatilgan += b.tugatilgan;
      t.total += b.total;
    });
    return t;
  }, [totalsByBranch]);

  // Line chart data: aggregate by date
  const lineData = useMemo(() => {
    const grouped = {};
    filteredDaily.forEach((row) => {
      const key = row.date;
      if (!grouped[key])
        grouped[key] = { date: key, yangi: 0, otkaz: 0, tugatilgan: 0 };
      grouped[key].yangi += row.statuses.yangi;
      grouped[key].otkaz += row.statuses.otkaz;
      grouped[key].tugatilgan += row.statuses.tugatilgan;
    });
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredDaily]);

  // Sources pie data
  const pieData = useMemo(() => {
    const s = { telegram: 0, facebook: 0, instagram: 0 };
    filteredDaily.forEach((row) => {
      s.telegram += row.sources.telegram;
      s.facebook += row.sources.facebook;
      s.instagram += row.sources.instagram;
    });
    return [
      { name: "Telegram", value: s.telegram },
      { name: "Facebook", value: s.facebook },
      { name: "Instagram", value: s.instagram },
    ];
  }, [filteredDaily]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Leads Dashboard</h1>
        <div className="flex items-center gap-3">
          <Select onValueChange={(v) => setSelectedBranch(v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All branches</SelectItem>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.name}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder={dateFilter}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-56"
          />
          <Button>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Summary cards */}
        <Card>
          <CardHeader>
            <CardTitle>Jami lidlar</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{overallTotals.total}</p>
              <p className="text-sm text-muted-foreground">
                Tanlangan branch: {selectedBranch}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">Yangi: {overallTotals.yangi}</p>
              <p className="text-sm">Otkaz: {overallTotals.otkaz}</p>
              <p className="text-sm">Tugatilgan: {overallTotals.tugatilgan}</p>
            </div>
          </CardContent>
        </Card>

        {/* Branch breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Filiallar boyicha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {branches.map((b) => (
                <div key={b.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{b.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Total: {totalsByBranch[b.name]?.total ?? 0}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      Y: {totalsByBranch[b.name]?.yangi ?? 0}
                    </div>
                    <div className="text-sm">
                      O: {totalsByBranch[b.name]?.otkaz ?? 0}
                    </div>
                    <div className="text-sm">
                      T: {totalsByBranch[b.name]?.tugatilgan ?? 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sources pie */}
        <Card>
          <CardHeader>
            <CardTitle>Manba boyicha</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={70}
                  fill="#8884d8"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SOURCE_COLORS[index % SOURCE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line chart for daily statuses */}
        <Card className="h-96">
          <CardHeader>
            <CardTitle>Kundalik lidlar (status boyicha)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="yangi"
                  stroke={STATUS_COLORS.yangi}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="otkaz"
                  stroke={STATUS_COLORS.otkaz}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="tugatilgan"
                  stroke={STATUS_COLORS.tugatilgan}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar chart: statuses per branch */}
        <Card className="h-96">
          <CardHeader>
            <CardTitle>Statuslar boyicha (filiallar)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={branches.map((b) => ({
                  name: b.name,
                  yangi: totalsByBranch[b.name]?.yangi ?? 0,
                  otkaz: totalsByBranch[b.name]?.otkaz ?? 0,
                  tugatilgan: totalsByBranch[b.name]?.tugatilgan ?? 0,
                }))}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Bar dataKey="yangi" stackId="a" fill={STATUS_COLORS.yangi} />
                <Bar dataKey="otkaz" stackId="a" fill={STATUS_COLORS.otkaz} />
                <Bar
                  dataKey="tugatilgan"
                  stackId="a"
                  fill={STATUS_COLORS.tugatilgan}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Table / recent leads */}
      <Card>
        <CardHeader>
          <CardTitle>Songi lidlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Sana</th>
                  <th className="py-2">Filial</th>
                  <th className="py-2">Yangi</th>
                  <th className="py-2">Otkaz</th>
                  <th className="py-2">Tugatilgan</th>
                  <th className="py-2">Telegram</th>
                  <th className="py-2">Facebook</th>
                  <th className="py-2">Instagram</th>
                </tr>
              </thead>
              <tbody>
                {filteredDaily.map((r, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{r.date}</td>
                    <td className="py-2">{r.branch}</td>
                    <td className="py-2">{r.statuses.yangi}</td>
                    <td className="py-2">{r.statuses.otkaz}</td>
                    <td className="py-2">{r.statuses.tugatilgan}</td>
                    <td className="py-2">{r.sources.telegram}</td>
                    <td className="py-2">{r.sources.facebook}</td>
                    <td className="py-2">{r.sources.instagram}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="text-right text-xs text-muted-foreground">
        Mock data ishlatilgan — backendga ulash uchun fetch/Realtime qoshing.
      </div>
    </div>
  );
}
