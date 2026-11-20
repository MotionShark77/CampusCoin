import clsx from 'clsx'

const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }
const fills   = {
  primary: 'bg-indigo-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
}

export default function ProgressBar({ value = 0, variant = 'primary', size = 'md', showLabel = false, label }) {
  const pct = Math.min(100, Math.max(0, value))
  const auto = pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : 'success'
  const fillClass = fills[variant === 'primary' ? auto : variant]
  return (
    <div className="flex flex-col gap-1">
      {(showLabel || label) && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className={clsx('pbar-track', heights[size])}>
        <div
          className={clsx('pbar-fill', fillClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
