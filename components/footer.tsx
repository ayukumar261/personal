import { Link } from "@/components/ui/link"

// In a flex column page, mt-auto pushes it to the bottom; the top padding is the minimum gap.
export function Footer() {
  return (
    <footer className="mt-auto flex items-center justify-between gap-6 pt-24 font-link sm:pt-32">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Ayush Kumar
      </p>
      <nav aria-label="Elsewhere" className="flex gap-2">
        <Link href="https://github.com/ayukumar261" iconClassName="dark:invert">
          GitHub
        </Link>
        <Link href="https://www.linkedin.com/in/ayukumar261/">LinkedIn</Link>
      </nav>
    </footer>
  )
}
