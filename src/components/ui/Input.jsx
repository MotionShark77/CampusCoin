import clsx from 'clsx'

export default function Input({
  label, error, helper, icon, rightElement,
  className, id, ...rest
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-gray-400 text-sm pointer-events-none">{icon}</span>
        )}
        <input
          id={inputId}
          className={clsx(
            'input',
            icon && 'pl-9',
            rightElement && 'pr-10',
            error && 'input-error',
            className
          )}
          {...rest}
        />
        {rightElement && (
          <span className="absolute right-3 text-gray-400">{rightElement}</span>
        )}
      </div>
      {error  && <p className="text-xs text-red-500">{error}</p>}
      {helper && !error && <p className="text-xs text-gray-400">{helper}</p>}
    </div>
  )
}
