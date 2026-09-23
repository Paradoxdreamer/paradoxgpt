const statusBadge = document.getElementById("statusBadge");
const statusDetail = document.getElementById("statusDetail");
const pairForm = document.getElementById("pairForm");
const phoneInput = document.getElementById("phone");
const pairBtn = document.getElementById("pairBtn");
const codeBox = document.getElementById("codeBox");
const pairingCodeEl = document.getElementById("pairingCode");
const errorBox = document.getElementById("errorBox");
const pairSection = document.getElementById("pairSection");

function setStatus(status, detail) {
  statusBadge.className = "badge " + status;
  statusBadge.textContent =
    status === "open" ? "Connected" :
    status === "connecting" ? "Connecting…" :
    "Disconnected";
  statusDetail.textContent = detail || "";
}

async function refreshStatus() {
  try {
    const res = await fetch("/api/status");
    const data = await res.json();

    if (data.status === "open" || data.registered) {
      setStatus("open", data.user ? `Linked as ${data.user.id}` : "Bot is online");
      pairSection.classList.add("hidden");
    } else if (data.pairingCode) {
      setStatus("connecting", "Waiting for you to enter the code in WhatsApp…");
      codeBox.classList.remove("hidden");
      pairingCodeEl.textContent = data.pairingCode;
    } else {
      setStatus(data.status || "disconnected", "Ready to generate a pairing code");
      pairSection.classList.remove("hidden");
    }
  } catch (err) {
    setStatus("disconnected", "Cannot reach backend");
  }
}

pairForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.classList.add("hidden");
  pairBtn.disabled = true;
  pairBtn.textContent = "Generating…";

  try {
    const res = await fetch("/api/pair", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneInput.value.trim() }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }

    if (data.alreadyConnected) {
      setStatus("open", data.message);
      pairSection.classList.add("hidden");
    } else if (data.code) {
      pairingCodeEl.textContent = data.code;
      codeBox.classList.remove("hidden");
      setStatus("connecting", "Enter the code on your phone now");
    }
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  } finally {
    pairBtn.disabled = false;
    pairBtn.textContent = "Generate Code";
  }
});

refreshStatus();
setInterval(refreshStatus, 3000);
