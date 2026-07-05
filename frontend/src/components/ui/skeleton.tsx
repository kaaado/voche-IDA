import { cn } from "../../lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-zinc-200/80 dark:bg-zinc-800/40 border-0 shadow-none", className)}
      {...props}
    />
  )
}

export { Skeleton }
