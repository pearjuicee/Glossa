export function checkAnkiConnection(): Promise<{ apiVersion: number }> {
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
