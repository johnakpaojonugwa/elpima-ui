import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ControlAdminStockPoint } from "../dashboard/types";

interface ControlAdminStockStatsChartProps {
  data: ControlAdminStockPoint[];
}

export function ControlAdminStockStatsChart({
  data,
}: ControlAdminStockStatsChartProps) {
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
            Catalog Inventory by Category
          </h3>
          <p className="text-xs text-slate-500">
            In-stock vs. low-stock medical equipment SKUs across top categories
          </p>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="category"
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
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar
              dataKey="inStock"
              name="In Stock"
              fill="#0071BC"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="lowStock"
              name="Low Stock"
              fill="#f59e0b"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

