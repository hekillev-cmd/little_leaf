export type PublishDraft = { title: string; price: string; category: string; cover: File | null; download: File | null };

export const validatePublishDraft = (draft: PublishDraft) => {
  const missing: string[] = [];
  if (!draft.title.trim()) missing.push("title");
  if (!draft.price || Number(draft.price) <= 0) missing.push("price");
  if (!draft.category) missing.push("category");
  if (!draft.cover) missing.push("cover");
  if (!draft.download) missing.push("download");
  return { valid: missing.length === 0, missing };
};

export const toggleGateway = (enabled: string[], gateway: string) => enabled.includes(gateway) ? enabled.filter((item) => item !== gateway) : [...enabled, gateway];
