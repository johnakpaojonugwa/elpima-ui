// src/pages/super-admin/components/super-admin-stat-cards.tsx
import React from "react";
import {
  Package,
  FileSpreadsheet,
  AlertTriangle,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type { SuperAdminStatCard } from "../dashboard/types";

interface SuperAdminStatCardsProps {
  cards: SuperAdminStatCard[];
  isLoading?: boolean;
}

const ICON_MAP = {
  Package,
  FileSpreadsheet,
  AlertTriangle,
  UserCheck,
};

export const SuperAdminStatCards: React.FC<SuperAdminStatCardsProps> = ({
  cards,
  isLoading = false,
}) => {
  if (isLoading || cards.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[135px] border border-stone-200/80 animate-pulse"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-3 flex-1">
                <div className="h-3.5 w-28 rounded bg-stone-200" />
                <div className="h-7 w-16 rounded-lg bg-stone-200" />
              </div>
              <div className="w-11 h-11 rounded-full bg-stone-100 shrink-0" />
            </div>

            <div className="mt-3">
              <div className="h-3.5 w-24 rounded bg-stone-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = ICON_MAP[card.iconName] ?? Package;
        const isUp = card.trend === "up";

        return (
          <div
            key={card.id}
            className={`${card.bgClass} rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between min-h-[135px] border border-black/5`}
          >
            {/* Top row: Title and Round White Icon Badge */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs sm:text-sm font-medium text-stone-700 leading-tight">
                  {card.title}
                </p>
                <h3 className="text-2xl sm:text-[28px] font-extrabold text-stone-900 mt-2 tracking-tight">
                  {card.value}
                </h3>
              </div>

              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-stone-800 shadow-xs shrink-0">
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            {/* Bottom trend row */}
            <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold">
              {isUp ? (
                <span className="inline-flex items-center text-emerald-700 gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{card.change}</span>
                </span>
              ) : (
                <span className="inline-flex items-center text-rose-600 gap-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>{card.change}</span>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SuperAdminStatCards;

