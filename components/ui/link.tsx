import { cn } from "cn"
import Image from "next/image"

import { getFavicon } from "@/lib/favicon"

type LinkProps = React.ComponentProps<"a"> & {
  href: string
  iconClassName?: string
}

// A pill that leads with the linked site's own favicon.
async function Link({
  href,
  iconClassName,
  className,
  children,
  ...props
}: LinkProps) {
  const icon = await getFavicon(href)

  return (
    <a
      data-slot="link"
      href={href}
      className={cn(
        "inline-block rounded-md bg-foreground/10 px-[5px] py-px font-link text-[0.9375rem] leading-tight transition-colors hover:bg-foreground/15",
        className
      )}
      {...props}
    >
      <Image
        src={icon}
        alt=""
        width={16}
        height={16}
        unoptimized
        className={cn(
          "mr-[0.3em] inline-block size-[0.92em] align-[-0.1em]",
          iconClassName
        )}
      />
      {children}
    </a>
  )
}

export { Link }
