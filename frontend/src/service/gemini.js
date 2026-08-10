export async function solveDoubt(question, subject = "General") {
  try {
    const response = await fetch("https://smart-doubt-solver-backend.vercel.app/api/solve", {
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