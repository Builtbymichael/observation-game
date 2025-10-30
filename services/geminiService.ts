const API_KEY = process.env.API_KEY

export const getSuggestedQuestion = async (): Promise<string> => {
  try {
    const response = await fetch("/api/suggest-question")
    const data = await response.json()
    return data.question
  } catch (error) {
    console.error("Error fetching question from API:", error)
    return "What was the most unexpected thing that happened today?"
  }
}
