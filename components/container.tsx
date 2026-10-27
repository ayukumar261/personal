import { cn } from "@/lib/utils"

// The page column shared by the homepage and posts, nudged left of center on wide screens.
export function Container({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      className={cn(
        "mx-auto max-w-[44rem] px-6 py-10 sm:px-12 sm:py-16 lg:relative lg:-left-28 xl:-left-36",
        className
      )}
      {...props}
    />
  )
}
