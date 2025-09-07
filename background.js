const ANKI_URL = "http://127.0.0.1:8765";

async function pingAnki() {
  const body = { action: "version", version: 6 };
  const response = await fetch(ANKI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`AnkiConnect request failed: ${response.statusText}`);
  }
  const json = await response.json();
  return { apiVersion: json.result };
}

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  (async () => {
    try {
      if (request?.type === "PING_ANKI") {
        const result = await pingAnki();
        sendResponse({ ok: true, data: result });
      }
    } catch (error) {
      sendResponse({
        onkeydown: false,
        error: error?.message || String(error),
      });
    }
  })();
  return true;
});
