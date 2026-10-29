// src/pages/super-admin/components/super-admin-user-growth-chart.tsx
import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type {
  CatalogFulfillmentDataPoint,
  DashboardTimePeriod,
} from "../dashboard/types";
import { CATALOG_FULFILLMENT_BY_PERIOD } from "../dashboard/constants";

interface SuperAdminUserGrowthChartProps {
  data?: CatalogFulfillmentDataPoint[];
  dataByPeriod?: Record<DashboardTimePeriod, CatalogFulfillmentDataPoint[]>;
  initialPeriod?: DashboardTimePeriod;
  onPeriodChange?: (selectedPeriod: DashboardTimePeriod) => void;
}

const AVAILABLE_GROWTH_PERIODS: DashboardTimePeriod[] = [
  "Weekly",
  "Monthly",
  "Yearly",
];

export const SuperAdminUserGrowthChart: React.FC<
  SuperAdminUserGrowthChartProps
> = ({
  data,
  dataByPeriod = CATALOG_FULFILLMENT_BY_PERIOD,
  initialPeriod = "Weekly",
  onPeriodChange,
}) => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<DashboardTimePeriod>(initialPeriod);

  const activeData: CatalogFulfillmentDataPoint[] =
    dataByPeriod[selectedPeriod] ??
    (selectedPeriod === "Weekly" && data
      ? data
      : CATALOG_FULFILLMENT_BY_PERIOD[selectedPeriod]);

  const totalInquiries = activeData.reduce(
    (accumulator, currentDataPoint) => accumulator + currentDataPoint.inquiries,
    0,
  );
  const totalFulfilled = activeData.reduce(
    (accumulator, currentDataPoint) => accumulator + currentDataPoint.fulfilled,
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
            Inquiries vs Fulfilled Quotes
          </h3>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-full">
            {totalFulfilled.toLocaleString()} Fulfilled
          </span>
        </div>

        <div className="flex items-center bg-[#f3f4f6] p-1 rounded-xl text-xs font-semibold text-stone-600 self-start sm:self-auto">
          {AVAILABLE_GROWTH_PERIODS.map((periodOption) => (
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

      <div className="w-full h-56 sm:h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={activeData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="inquiriesGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient
                id="fulfilledGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="periodLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const inquiriesCount = Number(
                  payload.find((p) => p.dataKey === "inquiries")?.value ?? 0,
                );
                const fulfilledCount = Number(
                  payload.find((p) => p.dataKey === "fulfilled")?.value ?? 0,
                );

                return (
                  <div className="bg-white/95 backdrop-blur-xs border border-stone-200 p-2.5 rounded-xl text-[11px] shadow-xl space-y-1">
                    <p className="font-bold text-stone-800">
                      {selectedPeriod}: {label}
                    </p>
                    <p className="text-indigo-600 font-medium">
                      Inquiries:{" "}
                      <span className="font-bold">
                        {inquiriesCount.toLocaleString()}
                      </span>
                    </p>
                    <p className="text-rose-500 font-medium">
                      Fulfilled:{" "}
                      <span className="font-bold">
                        {fulfilledCount.toLocaleString()}
                      </span>
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="inquiries"
              stroke="#818cf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#inquiriesGradient)"
              dot={{
                r: 3,
                fill: "#ffffff",
                stroke: "#818cf8",
                strokeWidth: 1.5,
              }}
            />
            <Area
              type="monotone"
              dataKey="fulfilled"
              stroke="#f87171"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#fulfilledGradient)"
              dot={{
                r: 3,
                fill: "#ffffff",
                stroke: "#f87171",
                strokeWidth: 1.5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-stone-100 gap-2">
        <div className="flex items-center gap-6 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-stone-700">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#818cf8] bg-white inline-block" />
            <span>
              Inquiries:{" "}
              <strong className="text-indigo-600">
                {totalInquiries.toLocaleString()}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-700">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#f87171] bg-white inline-block" />
            <span>
              Fulfilled:{" "}
              <strong className="text-rose-500">
                {totalFulfilled.toLocaleString()}
              </strong>
            </span>
          </div>
        </div>

        <p className="text-xs font-semibold text-stone-800">
          Conversion Rate:{" "}
          <span className="font-bold text-[#2e7d5b]">
            {totalInquiries > 0
              ? `${Math.round((totalFulfilled / totalInquiries) * 100)}%`
              : "0%"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SuperAdminUserGrowthChart;

