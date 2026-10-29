import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ControlAdminStatCard } from "../dashboard/types";

interface ControlAdminStatCardsProps {
  cards: ControlAdminStatCard[];
}

export function ControlAdminStatCards({ cards }: ControlAdminStatCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isUp = card.direction === "up";

        return (
          <article
            key={card.id}
            className="flex flex-col justify-between rounded-[20px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-slate-500">{card.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px]">
                  {card.value}
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0071BC]/10 text-[#0071BC]">
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px]">
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold ${
                  isUp
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {isUp ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {card.change}
              </span>
              <span className="text-slate-400">{card.comparisonText}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

