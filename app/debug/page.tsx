import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DebugPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  // Fetch all data for this user
  const { data: observations, error: obsError } = await supabase
    .from("observations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: stats, error: statsError } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", user.id)
    .single()

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Database Debug View</h1>
          <p className="text-muted-foreground">User ID: {user.id}</p>
          <p className="text-muted-foreground">Email: {user.email}</p>
        </div>

        {/* Profile */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          {profileError ? (
            <p className="text-red-500">Error: {profileError.message}</p>
          ) : profile ? (
            <pre className="bg-muted p-4 rounded overflow-auto text-sm">{JSON.stringify(profile, null, 2)}</pre>
          ) : (
            <p className="text-muted-foreground">No profile found</p>
          )}
        </div>

        {/* Stats */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">User Stats</h2>
          {statsError ? (
            <p className="text-red-500">Error: {statsError.message}</p>
          ) : stats ? (
            <pre className="bg-muted p-4 rounded overflow-auto text-sm">{JSON.stringify(stats, null, 2)}</pre>
          ) : (
            <p className="text-muted-foreground">No stats found</p>
          )}
        </div>

        {/* Observations */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Observations ({observations?.length || 0})</h2>
          {obsError ? (
            <p className="text-red-500">Error: {obsError.message}</p>
          ) : observations && observations.length > 0 ? (
            <div className="space-y-4">
              {observations.map((obs) => (
                <div key={obs.id} className="bg-muted p-4 rounded">
                  <pre className="overflow-auto text-sm">{JSON.stringify(obs, null, 2)}</pre>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No observations found</p>
          )}
        </div>

        <div className="flex gap-4">
          <a href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Back to App
          </a>
        </div>
      </div>
    </div>
  )
}
