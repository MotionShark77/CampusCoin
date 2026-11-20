import clsx from 'clsx'

const variants = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger:  'badge-danger',
  info:    'badge-info',
  neutral: 'badge-neutral',
}
const dotColors = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-indigo-500',
  neutral: 'bg-gray-400',
}

export default function Badge({ variant = 'neutral', children, dot = false, className }) {
  return (
    <span className={clsx('badge', variants[variant], className)}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  )
}
