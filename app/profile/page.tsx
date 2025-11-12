"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getUserProfile, updateUserProfile } from "@/lib/actions/game-actions"

export default function ProfilePage() {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile()
        if (profile) {
          setName(profile.name || "")
          setAge(profile.age?.toString() || "")
          setEmail(profile.email || "")
        }
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load profile" })
      } finally {
        setIsFetching(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (!name.trim()) {
      setMessage({ type: "error", text: "Name is required" })
      setIsLoading(false)
      return
    }

    try {
      await updateUserProfile({
        name: name.trim(),
        age: age ? Number.parseInt(age) : null,
      })
      setMessage({ type: "success", text: "Profile updated successfully" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAllData = () => {
    if (confirm("This will log you out and clear all local data. Continue?")) {
      localStorage.clear()
      sessionStorage.clear()
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })
      window.location.href = "/auth/login"
    }
  }

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
          ← Back to Game
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="age">Age (optional)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Your age"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                {message && (
                  <p className={`text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
                    {message.text}
                  </p>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-destructive hover:bg-destructive/10 bg-transparent"
                  onClick={handleClearAllData}
                >
                  Clear All Data (Testing)
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
