import clsx from 'clsx'

const paddings = { sm: 'p-3', md: 'p-4', lg: 'p-6' }

export default function Card({ children, className, padding = 'md', hoverable = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={clsx('card', paddings[padding], hoverable && 'card-hover', className)}
    >
      {children}
    </div>
  )
}
