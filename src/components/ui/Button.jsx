import clsx from 'clsx'

const variants = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
}
const sizes = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

export default function Button({
  variant = 'secondary', size = 'md', loading = false,
  icon, children, onClick, disabled, className, type = 'button', ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading
        ? <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        : icon && <span className="text-base leading-none">{icon}</span>
      }
      {children}
    </button>
  )
}
