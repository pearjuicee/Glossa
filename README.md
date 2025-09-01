# Glossa

Language learning tool to make sentence mining easier and faster. Turn any sentence into an editable, context‑aware flashcard and sync it to Anki.

> Work‑in‑progress student project: React + TypeScript (frontend), Express/Node (backend), PostgreSQL (Prisma), Supabase Auth, Tailwind CSS, and optional Anki‑Connect integration.

---

## ✨ Features

* **Sentence → Flashcard**: Select a sentence, tokenize it (e.g., `Intl.Segmenter` / language‑specific segmenters), pick a word, and auto‑generate a definition using an LLM API (currently using DeepSeek API).
* **Context‑aware definitions**: Definitions can consider the full sentence rather than a single token in isolation.
* **Editable preview**: Edit front/back, add examples, pitch/reading, tags, etc. before saving. (coming soon)
* **Anki sync (local)**: Send cards to Anki via **Anki‑Connect** from the web UI or a Chrome extension.
* **Auth**: Supabase Auth for sign‑in.
---

## 🧱 Tech Stack

* **Frontend**: React + TypeScript, Tailwind CSS
* **Backend**: Express (Node), Prisma ORM, PostgreSQL
* **Auth**: Supabase Auth
* **Integrations**: Anki‑Connect (local), DeepSeek (definitions), Intl.Segmenter
* **Dev Tooling**: ESLint + Prettier, npm, Docker (optional)

---

## 💬 Notes

This is an educational project created to practice full‑stack development and to help language learners build durable vocab through context‑aware flashcards and optional Anki sync.

## 🧩 Setup
Setup instructions (and maybe deployment) coming soon!

