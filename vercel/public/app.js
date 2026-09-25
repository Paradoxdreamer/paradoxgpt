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
    status === "open"
      ? "Online"
      : status === "connecting"
        ? "Connecting…"
        : status === "error"
          ? "Unreachable"
          : "Offline";
  statusDetail.textContent = detail || "";
}

async function refreshStatus() {
  try {
    const res = await fetch("/api/status", { cache: "no-store" });
    const data = await res.json();

    if (!res.ok) {
      setStatus("error", data.error || "Bot host rejected request");
      return;
    }

    if (data.status === "open" || data.registered) {
      setStatus(
        "open",
        data.user?.id ? `Linked as ${data.user.id}` : "WhatsApp session active"
      );
      pairSection.classList.add("hidden");
      codeBox.classList.add("hidden");
    } else if (data.pairingCode) {
      setStatus("connecting", "Enter this code in WhatsApp…");
      codeBox.classList.remove("hidden");
      pairingCodeEl.textContent = data.pairingCode;
      pairSection.classList.add("hidden");
    } else {
      setStatus(data.status || "disconnected", "Ready — generate a pairing code");
      pairSection.classList.remove("hidden");
    }
  } catch (err) {
    setStatus("error", "Cannot reach bot host. Is the server running?");
    pairSection.classList.add("hidden");
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
      body: JSON.stringify({ phone: phoneInput.value.trim().replace(/\D/g, "") }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Request failed");

    if (data.alreadyConnected) {
      setStatus("open", "Already linked");
      pairSection.classList.add("hidden");
      return;
    }

    if (data.code || data.pairingCode) {
      const code = data.code || data.pairingCode;
      codeBox.classList.remove("hidden");
      pairingCodeEl.textContent = code;
      setStatus("connecting", "Enter the code in WhatsApp now");
      pairSection.classList.add("hidden");
    } else {
      throw new Error("No pairing code returned");
    }
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  } finally {
    pairBtn.disabled = false;
    pairBtn.textContent = "Generate code";
  }
});

refreshStatus();
setInterval(refreshStatus, 5000);
