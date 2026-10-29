import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ControlAdminQuotePoint } from "../dashboard/types";

interface ControlAdminQuoteVolumeChartProps {
  data: ControlAdminQuotePoint[];
}

export function ControlAdminQuoteVolumeChart({
  data,
}: ControlAdminQuoteVolumeChartProps) {
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
            Weekly Quote Inquiry Volume
          </h3>
          <p className="text-xs text-slate-500">
            Hospital & clinic B2B equipment quote requests handled this week
          </p>
        </div>
        <span className="rounded-full bg-[#0071BC]/10 px-3 py-1 text-[11px] font-semibold text-[#0071BC]">
          153 Total Inquiries
        </span>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="quoteVolumeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0071BC" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#0071BC" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0071BC"
              strokeWidth={2.5}
              fill="url(#quoteVolumeFill)"
              name="Inquiries"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

