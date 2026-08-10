const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export async function solveDoubt(question, subject = "General") {
  try {
    const response = await fetch(`${BACKEND_URL}/api/solve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        subject,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to get answer");
    }

    return data.answer;
  } catch (error) {
    console.error("Backend Error:", error);
    return "Error: " + error.message;
  }
}