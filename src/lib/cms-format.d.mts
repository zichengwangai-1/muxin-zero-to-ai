export interface ManagedEntry {
  id: string; title: string; module: string; category: string; summary: string;
  prompt: string; body: string; tools: string; author: string; source: string; date: string;
  cover: string; video: string; result: string; prepare: string; steps: string; checks: string;
  tested: string; reference: string; visible: boolean; order: number;
  attachments: { label: string; file: string }[];
}
export const MODULE_IDS: string[];
export function safeUrl(value: unknown): string;
export function importDocument(text: string): Partial<ManagedEntry>;
export function normalizeEntry(raw: unknown): ManagedEntry;
export function parseDocument(text: string): ManagedEntry;
export function applyImport(current: ManagedEntry, markdown: string): ManagedEntry;
export function validateEntries(entries: ManagedEntry[]): ManagedEntry[];
export function validateUpload(file: { name: string; size: number }): void;
export function serializeDocument(data: ManagedEntry): string;
