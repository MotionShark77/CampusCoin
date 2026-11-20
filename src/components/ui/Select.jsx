import clsx from 'clsx'

export default function Select({ label, options = [], error, className, id, ...rest }) {
  const selId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selId} className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          {label}
        </label>
      )}
      <select
        id={selId}
        className={clsx('input cursor-pointer', error && 'input-error', className)}
        {...rest}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
