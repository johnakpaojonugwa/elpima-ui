// src/pages/super-admin/components/super-admin-revenue-chart.tsx
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type {
  QuoteTrendDataPoint,
  DashboardTimePeriod,
} from "../dashboard/types";
import { SUPER_ADMIN_QUOTE_VOLUME_BY_PERIOD } from "../dashboard/constants";

interface SuperAdminRevenueChartProps {
  data?: QuoteTrendDataPoint[];
  dataByPeriod?: Record<DashboardTimePeriod, QuoteTrendDataPoint[]>;
  initialPeriod?: DashboardTimePeriod;
  onPeriodChange?: (selectedPeriod: DashboardTimePeriod) => void;
}

const AVAILABLE_PERIODS: DashboardTimePeriod[] = [
  "Weekly",
  "Monthly",
  "Yearly",
];

export const SuperAdminRevenueChart: React.FC<SuperAdminRevenueChartProps> = ({
  data,
  dataByPeriod = SUPER_ADMIN_QUOTE_VOLUME_BY_PERIOD,
  initialPeriod = "Weekly",
  onPeriodChange,
}) => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<DashboardTimePeriod>(initialPeriod);

  const activeData: QuoteTrendDataPoint[] =
    dataByPeriod[selectedPeriod] ??
    (selectedPeriod === "Monthly" && data
      ? data
      : SUPER_ADMIN_QUOTE_VOLUME_BY_PERIOD[selectedPeriod]);

  const totalPeriodQuotes = activeData.reduce(
    (accumulator, currentDataPoint) => accumulator + currentDataPoint.quotes,
    0,
  );

  const handlePeriodSelect = (periodOption: DashboardTimePeriod) => {
    setSelectedPeriod(periodOption);
    onPeriodChange?.(periodOption);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-2xs flex flex-col justify-between h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Hospital RFQ Quote Volume
          </h3>
          <span className="text-xs font-semibold text-[#2e7d5b] bg-[#eef7f2] border border-[#2e7d5b]/20 px-2.5 py-0.5 rounded-full">
            Total: {totalPeriodQuotes.toLocaleString()} RFQs
          </span>
        </div>

        <div className="flex items-center bg-[#f3f4f6] p-1 rounded-xl text-xs font-semibold text-stone-600 self-start sm:self-auto">
          {AVAILABLE_PERIODS.map((periodOption) => (
            <button
              key={periodOption}
              type="button"
              onClick={() => handlePeriodSelect(periodOption)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                selectedPeriod === periodOption
                  ? "bg-white text-stone-900 shadow-xs font-bold"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              {periodOption}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={activeData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="periodLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 500 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const count = Number(payload[0].value ?? 0);
                return (
                  <div className="bg-stone-900 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg space-y-0.5">
                    <p className="text-[10px] text-stone-400 font-normal">
                      {selectedPeriod} Period: {label}
                    </p>
                    <p className="text-[#34d399] font-bold text-sm">
                      {count.toLocaleString()} Quote Inquiries
                    </p>
                  </div>
                );
              }}
            />
            <Line
              type="natural"
              dataKey="quotes"
              stroke="#2E7D5B"
              strokeWidth={3.5}
              dot={{ r: 3, fill: "#2E7D5B" }}
              activeDot={{
                r: 6,
                fill: "#2E7D5B",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SuperAdminRevenueChart;

