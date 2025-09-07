const ANKI_URL = "http://127.0.0.1:8765";

async function callAnki(action, version, params = {}) {
  const body = { action, version, params };
  const res = await fetch(ANKI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`AnkiConnect request failed: ${res.statusText}`);
  const json = await res.json();
  if (json && json.error) throw new Error(String(json.error));
  return json.result;
}

async function pingAnki() {
  const response = await callAnki("version", 6);
  return { apiVersion: response };
}

async function saveNote(note) {
  note.options = note.options || {
    allowDuplicate: true,
    duplicateScope: "deck",
  };
  const noteId = await callAnki("addNote", 6, { note });

  return noteId;
}

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  (async () => {
    try {
      if (request?.type === "PING_ANKI") {
        const result = await pingAnki();
        sendResponse({ ok: true, data: result });
      } else if (request?.type === "SAVE_ANKI_NOTE") {
        const { note } = request.payload ?? {};
        const noteId = await saveNote(note);
        sendResponse({ ok: true, data: { noteId } });
      } else {
        sendResponse({ ok: false, error: "Unknown request type" });
      }
    } catch (error) {
      sendResponse({
        ok: false,
        error: error?.message || String(error),
      });
    }
  })();
  return true;
});
