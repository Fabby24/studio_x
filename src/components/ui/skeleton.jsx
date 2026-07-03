import { cn } from '../../lib/utils'

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-white/5', className)}
      {...props}
    />
  )
}

export { Skeleton }