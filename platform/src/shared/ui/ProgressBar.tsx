export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  tone?: "accent" | "success";
}

export function ProgressBar({ value, max = 100, label, tone = "accent" }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;
  const fill = tone === "success" || percent === 100 ? "bg-success" : "bg-accent";

  return (
    <div className="flex flex-col gap-2">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={label}
        className="h-1.5 overflow-hidden rounded-full bg-line"
      >
        <div
          className={"h-full rounded-full transition-[width] duration-slow " + fill}
          style={{ width: percent + "%" }}
        />
      </div>
      {label ? <span className="text-sm text-fg-muted">{label}</span> : null}
    </div>
  );
}
