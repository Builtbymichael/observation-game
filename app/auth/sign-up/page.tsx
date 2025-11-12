"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthPageLayout from "@/components/AuthPageLayout"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!name.trim()) {
      setError("Name is required")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}`,
          data: {
            name: name.trim(),
            age: age ? Number.parseInt(age) : null,
          },
        },
      })

      if (error) throw error

      if (data.session) {
        router.push("/")
        router.refresh()
      } else if (data.user && !data.session) {
        router.push("/auth/sign-up-success")
      }
    } catch (error: unknown) {
      console.error("[v0] Signup error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthPageLayout>
      <div className="flex min-h-svh w-full items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="space-y-1 sm:space-y-2">
                <CardTitle className="text-xl sm:text-2xl">Create Account</CardTitle>
                <CardDescription className="text-sm">Start your observation practice today</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp}>
                  <div className="flex flex-col gap-3 sm:gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-sm">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-base touch-manipulation min-h-[44px]"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="age" className="text-sm">
                        Age (optional)
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Your age"
                        min="1"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="text-base touch-manipulation min-h-[44px]"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-sm">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-base touch-manipulation min-h-[44px]"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password" className="text-sm">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-base touch-manipulation min-h-[44px]"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="repeat-password" className="text-sm">
                        Repeat Password
                      </Label>
                      <Input
                        id="repeat-password"
                        type="password"
                        required
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        className="text-base touch-manipulation min-h-[44px]"
                      />
                    </div>
                    {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}
                    <Button
                      type="submit"
                      className="w-full text-sm sm:text-base touch-manipulation min-h-[44px]"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Sign up"}
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-xs sm:text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="underline underline-offset-4">
                      Sign in
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthPageLayout>
  )
}
