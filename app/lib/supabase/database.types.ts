export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      audiobooks: {
        Row: {
          id: string;
          slug: string;
          title: string;
          author: string;
          translator: string | null;
          narrator: string;
          category: string;
          description: string;
          copyright_notice: string | null;
          total_duration_seconds: number;
          cover_from: string;
          cover_via: string;
          cover_to: string;
          vibe: string;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          author: string;
          translator?: string | null;
          narrator: string;
          category: string;
          description: string;
          copyright_notice?: string | null;
          total_duration_seconds?: number;
          cover_from: string;
          cover_via: string;
          cover_to: string;
          vibe: string;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          author?: string;
          translator?: string | null;
          narrator?: string;
          category?: string;
          description?: string;
          copyright_notice?: string | null;
          total_duration_seconds?: number;
          cover_from?: string;
          cover_via?: string;
          cover_to?: string;
          vibe?: string;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chapters: {
        Row: {
          id: string;
          book_id: string;
          slug: string;
          chapter_index: number;
          title: string;
          duration_seconds: number;
          audio_url: string;
          audio_storage_key: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          slug: string;
          chapter_index: number;
          title: string;
          duration_seconds: number;
          audio_url: string;
          audio_storage_key?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          book_id?: string;
          slug?: string;
          chapter_index?: number;
          title?: string;
          duration_seconds?: number;
          audio_url?: string;
          audio_storage_key?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "audiobooks";
            referencedColumns: ["id"];
          },
        ];
      };
      listening_progress: {
        Row: {
          user_id: string;
          book_id: string;
          chapter_id: string | null;
          position_seconds: number;
          completed_seconds: number;
          completed: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          book_id: string;
          chapter_id?: string | null;
          position_seconds?: number;
          completed_seconds?: number;
          completed?: boolean;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          book_id?: string;
          chapter_id?: string | null;
          position_seconds?: number;
          completed_seconds?: number;
          completed?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "listening_progress_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "audiobooks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listening_progress_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
        ];
      };
      chapter_bookmarks: {
        Row: {
          id: string;
          user_id: string;
          chapter_id: string;
          position_seconds: number;
          label: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          chapter_id: string;
          position_seconds: number;
          label?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          chapter_id?: string;
          position_seconds?: number;
          label?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chapter_bookmarks_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
