import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationDropdown } from "@/components/notification-dropdown"

export function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="font-bold text-xl flex items-center mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 mr-2 text-emerald-600"
          >
            <path d="M8 6v6" />
            <path d="M15 6v6" />
            <path d="M2 12h19.6" />
            <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="15" cy="18" r="2" />
          </svg>
          Marrakech Transport
        </Link>
        <nav className="flex-1 ml-auto">
          <ul className="flex space-x-4 justify-end items-center">
            <li>
              <NotificationDropdown />
            </li>
            <li>
              <ModeToggle />
            </li>
            <li>
              <UserNav />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

