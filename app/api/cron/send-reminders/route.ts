import { NextResponse } from "next"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

// This route is protected by Vercel Cron's authorization header
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Create Supabase admin client (bypasses RLS)
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get today's date in YYYY-MM-DD format
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Find all observations due today or earlier that haven't been answered
    const { data: dueObservations, error: obsError } = await supabase
      .from("observations")
      .select("user_id, question, ask_date")
      .lte("ask_date", today.toISOString())
      .is("answer", null)

    if (obsError) throw obsError

    if (!dueObservations || dueObservations.length === 0) {
      return NextResponse.json({ message: "No reminders to send", count: 0 })
    }

    // Group by user_id to count questions per user
    const userQuestions = dueObservations.reduce(
      (acc, obs) => {
        if (!acc[obs.user_id]) {
          acc[obs.user_id] = []
        }
        acc[obs.user_id].push(obs.question)
        return acc
      },
      {} as Record<string, string[]>,
    )

    const userIds = Object.keys(userQuestions)

    // Get user profiles (names and emails)
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, email")
      .in("id", userIds)

    if (profileError) throw profileError

    // Send emails using Resend
    const emailsSent = []

    for (const profile of profiles || []) {
      const questions = userQuestions[profile.id]
      const questionCount = questions.length

      try {
        // If RESEND_API_KEY is not set, log instead
        if (process.env.RESEND_API_KEY) {
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: process.env.EMAIL_FROM || "Observation Game <noreply@observationgame.com>",
              to: profile.email,
              subject: `You have ${questionCount} question${questionCount > 1 ? "s" : ""} waiting!`,
              html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <style>
                      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
                      .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                      .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
                      .questions { background: white; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea; }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="header">
                        <h1>Time to Test Your Memory!</h1>
                      </div>
                      <div class="content">
                        <p>Hi ${profile.name || "there"},</p>
                        <p>You have <strong>${questionCount} observation${questionCount > 1 ? "s" : ""}</strong> due for answering today!</p>
                        <div class="questions">
                          ${questions
                            .slice(0, 3)
                            .map((q) => `<p>• ${q}</p>`)
                            .join("")}
                          ${questionCount > 3 ? `<p><em>...and ${questionCount - 3} more</em></p>` : ""}
                        </div>
                        <p>Testing your recall now will help strengthen these memories and build your observation skills.</p>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://your-app-url.vercel.app"}" class="button">Answer Now</a>
                        <p style="margin-top: 30px; font-size: 12px; color: #666;">
                          Regular practice enhances memory retention and cognitive function. Keep up the great work!
                        </p>
                      </div>
                    </div>
                  </body>
                </html>
              `,
            }),
          })

          if (response.ok) {
            emailsSent.push(profile.email)
          } else {
            console.error(`Failed to send email to ${profile.email}:`, await response.text())
          }
        } else {
          // Log that email would be sent (for development/testing without Resend)
          console.log(`[Would send email to ${profile.email}]: ${questionCount} questions due`)
          emailsSent.push(profile.email)
        }
      } catch (error) {
        console.error(`Error sending email to ${profile.email}:`, error)
      }
    }

    return NextResponse.json({
      message: "Reminders sent successfully",
      userCount: profiles?.length || 0,
      emailsSent: emailsSent.length,
      dueQuestions: dueObservations.length,
    })
  } catch (error) {
    console.error("Error in send-reminders cron:", error)
    return NextResponse.json(
      { error: "Failed to send reminders", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
