"use client"

import type React from "react"
import { logout } from "@/lib/actions/auth-actions"
import { useEffect, useState } from "react"
import { getUserProfile } from "@/lib/actions/game-actions"
import Link from "next/link"

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2"></path>
    <path d="M12 20v2"></path>
    <path d="m4.93 4.93 1.41 1.41"></path>
    <path d="m17.66 17.66 1.41 1.41"></path>
    <path d="M2 12h2"></path>
    <path d="M20 12h2"></path>
    <path d="m6.34 17.66-1.41 1.41"></path>
    <path d="m19.07 4.93-1.41 1.41"></path>
  </svg>
)
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
  </svg>
)

const LogOutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
)

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

interface HeaderProps {
  onToggleTheme: () => void
  currentTheme: string
}

export const Header: React.FC<HeaderProps> = ({ onToggleTheme, currentTheme }) => {
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const profile = await getUserProfile()
        if (profile?.name) {
          setUserName(profile.name)
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error)
      }
    }
    fetchUserName()
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="w-full max-w-2xl mx-auto px-3 py-2 sm:p-4 absolute top-0 left-1/2 -translate-x-1/2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="text-xl sm:text-2xl font-serif hover:opacity-80 transition-opacity">
            Observation
          </Link>
          {userName && <span className="text-xs sm:text-sm text-muted-foreground hidden xs:inline">{userName}</span>}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/profile"
            className="p-2 sm:p-2 rounded-full text-muted-foreground hover:bg-secondary transition-colors touch-manipulation"
            aria-label="Profile"
          >
            <UserIcon />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 sm:p-2 rounded-full text-muted-foreground hover:bg-secondary transition-colors touch-manipulation"
            aria-label="Log out"
          >
            <LogOutIcon />
          </button>
          <button
            onClick={onToggleTheme}
            className="p-2 sm:p-2 rounded-full text-muted-foreground hover:bg-secondary transition-colors touch-manipulation"
            aria-label="Toggle theme"
          >
            {currentTheme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
