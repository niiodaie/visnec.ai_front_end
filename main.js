document.addEventListener("DOMContentLoaded", () => {
  const promptInput = document.getElementById("prompt");
  const generateBtn = document.getElementById("generateBtn");
  const ideasList = document.getElementById("ideasList");
  const resultsSection = document.getElementById("results");
  const sendBtn = document.getElementById("sendBtn");
  const emailInput = document.getElementById("email");
  const sendStatus = document.getElementById("sendStatus");

  let currentIdeas = [];

  generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return alert("Please enter a topic.");

    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";

    try {
      const res = await fetch("/api/get-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      currentIdeas = data.ideas || [];

      ideasList.innerHTML = "";
      currentIdeas.forEach((idea) => {
        const li = document.createElement("li");
        li.textContent = idea;
        ideasList.appendChild(li);
      });

      resultsSection.classList.remove("hidden");
    } catch (err) {
      alert("Error generating ideas.");
    }

    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Ideas";
  });

  sendBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    if (!email || currentIdeas.length === 0) {
      return alert("Enter your email and generate ideas first.");
    }

    sendBtn.disabled = true;
    sendStatus.textContent = "Sending...";

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ideas: currentIdeas,
        }),
      });

      const data = await res.json();
      sendStatus.textContent = data.success
        ? "✅ Ideas sent to your inbox!"
        : "❌ Failed to send email.";
    } catch (err) {
      sendStatus.textContent = "❌ Error sending email.";
    }

    sendBtn.disabled = false;
  });
});
