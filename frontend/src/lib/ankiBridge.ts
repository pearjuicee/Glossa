export type AnkiNote = {
  deckName: string;
  modelName: string;
  fields: Record<string, string>;
  tags?: string[];
  options?: {
    allowDuplicate?: boolean;
    duplicateScope?: "deck" | "deck-root" | "collection";
  };
};

export function checkAnkiConnection(
  timeoutMs = 5000
): Promise<{ apiVersion: number }> {
  const requestId = crypto.randomUUID();
  return new Promise((resolve, reject) => {
    const onMessage = (ev: MessageEvent) => {
      const data = ev.data ?? {};
      if (data.source !== "GLOSSA_EXTENSION" || data.requestId !== requestId)
        return;
      window.removeEventListener("message", onMessage);
      if (data.ok) resolve(data.result as { apiVersion: number });
      else reject(new Error(data.error || "Extension error"));
    };

    window.addEventListener("message", onMessage);
    window.postMessage(
      {
        source: "GLOSSA_WEB",
        type: "PING_ANKI",
        requestId,
        payload: {},
      },
      window.origin
    );
  });
}

export function saveNoteToAnki(
  note: AnkiNote,
  timeoutMs = 5000
): Promise<{ noteId: number | null }> {
  const requestId = crypto.randomUUID();
  return new Promise((resolve, reject) => {
    const onMessage = (ev: MessageEvent) => {
      const data = ev.data ?? {};
      if (data.source !== "GLOSSA_EXTENSION" || data.requestId !== requestId)
        return;
      window.removeEventListener("message", onMessage);
      if (data.ok) resolve(data.result as { noteId: number | null });
      else reject(new Error(data.error || "Extension error"));
    };

    window.addEventListener("message", onMessage);
    window.postMessage(
      {
        source: "GLOSSA_WEB",
        type: "SAVE_ANKI_NOTE",
        requestId,
        payload: { note },
      },
      window.origin
    );
  });
}
