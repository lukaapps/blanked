// Price breakdown shown once a chef has picked dates.
// GST (10%) applies to the rate and cleaning fee. The damage deposit is
// refundable, so it is shown underneath and kept out of the total.

const GST_RATE = 0.1;

function money(n: number) {
  return `$${n.toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function BookingBreakdown({
  dailyRate,
  days,
  cleaningFee,
  damageDeposit,
}: {
  dailyRate: number;
  days: number;
  cleaningFee: number;
  damageDeposit: number;
}) {
  const rent = dailyRate * days;
  const taxable = rent + cleaningFee;
  const gst = Math.round(taxable * GST_RATE * 100) / 100;
  const total = taxable + gst;

  const row = "flex items-baseline justify-between gap-4 text-sm";
  const muted = "text-ink/60";

  return (
    <div className="border border-divider bg-white p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">
        Price breakdown
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <div className={row}>
          <span className={muted}>
            {money(dailyRate)} × {days} {days === 1 ? "day" : "days"}
          </span>
          <span>{money(rent)}</span>
        </div>

        {cleaningFee > 0 && (
          <div className={row}>
            <span className={muted}>Cleaning fee</span>
            <span>{money(cleaningFee)}</span>
          </div>
        )}

        <div className={row}>
          <span className={muted}>GST (10%)</span>
          <span>{money(gst)}</span>
        </div>

        <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-divider pt-3">
          <span className="text-sm font-bold">Total</span>
          <span className="text-lg font-bold tracking-tight">
            {money(total)}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-divider pt-4">
        <div className={row}>
          <span className={muted}>Damage deposit (refundable)</span>
          <span>{money(damageDeposit)}</span>
        </div>
        <p className="mt-1 text-xs text-ink/40">
          Not included in the total. Held by Blanked and returned after the
          booking.
        </p>
      </div>
    </div>
  );
}
