import Button from './Button.jsx'

export default function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <span className="text-4xl">{icon}</span>
      {title && <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</p>}
      {description && <p className="text-xs text-gray-400 max-w-xs">{description}</p>}
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick} className="mt-1">
          {action.label}
        </Button>
      )}
    </div>
  )
}
