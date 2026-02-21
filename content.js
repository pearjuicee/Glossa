const ALLOWED_ORIGINS = ["http://localhost:5173"];

window.addEventListener("message", async (event) => {
  if (!ALLOWED_ORIGINS.includes(event.origin)) return;
  const msg = event.data || {};
  if (msg.source !== "GLOSSA_WEB") return;

  try {
    const response = await chrome.runtime.sendMessage({
      type: msg.type,
      payload: msg.payload,
    });
    window.postMessage(
      {
        source: "GLOSSA_EXTENSION",
        requestId: msg.requestId,
        ok: response?.ok ?? null,
        result: response?.data ?? null,
        error: response?.error || null,
      },
      event.origin
    );
  } catch (error) {
    window.postMessage(
      {
        source: "GLOSSA_EXTENSION",
        requestId: msg.requestId,
        success: false,
        error: error?.message || String(error),
      },
      event.origin
    );
  }
});
