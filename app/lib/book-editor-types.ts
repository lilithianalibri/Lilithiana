export type EditorChapter = {
  id?: string;
  clientId: string;
  slug?: string;
  title: string;
  durationSeconds: number;
  audioUrl: string;
  audioStorageKey: string | null;
  fileName?: string;
};

export type EditableBook = {
  id?: string;
  slug: string;
  title: string;
  author: string;
  translator: string;
  narrator: string;
  category: string;
  description: string;
  copyrightNotice: string;
  coverFrom: string;
  coverVia: string;
  coverTo: string;
  vibe: string;
  isPublished: boolean;
  chapters: EditorChapter[];
};

export type BookEditorListItem = {
  id: string;
  slug: string;
  title: string;
  author: string;
  narrator: string;
  isPublished: boolean;
  chapterCount: number;
  totalDurationSeconds: number;
  updatedAtLabel: string;
};

export type UploadTargetRequest = {
  bookSlug: string;
  chapters: Array<{
    clientId: string;
    chapterIndex: number;
    title: string;
    fileName: string;
    contentType: string;
    size: number;
  }>;
};

export type UploadTarget = {
  clientId: string;
  uploadUrl: string;
  publicUrl: string;
  storageKey: string;
  contentType: string;
};

export type SaveBookInput = {
  bookId?: string;
  publish: boolean;
  book: Omit<EditableBook, "id" | "isPublished" | "chapters">;
  chapters: EditorChapter[];
};

export type BookEditorActionResult = {
  ok: boolean;
  message: string;
  bookId?: string;
};
