export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type PublicEnums = Database["public"]["Enums"];
type PublicTables = Database["public"]["Tables"];

export type TableRow<TableName extends keyof PublicTables> =
  PublicTables[TableName]["Row"];
export type TableInsert<TableName extends keyof PublicTables> =
  PublicTables[TableName]["Insert"];
export type TableUpdate<TableName extends keyof PublicTables> =
  PublicTables[TableName]["Update"];

export type PublishStatus = PublicEnums["publish_status"];
export type InquiryStatus = PublicEnums["inquiry_status"];
export type UserRole = PublicEnums["user_role"];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          name: string | null;
          role: UserRole;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id: string;
          name?: string | null;
          role?: UserRole;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string | null;
          role?: UserRole;
          updated_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          content: string;
          created_at: string;
          excerpt: string | null;
          id: string;
          published_at: string | null;
          seo: Json | null;
          slug: string;
          status: PublishStatus;
          thumbnail_path: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          published_at?: string | null;
          seo?: Json | null;
          slug: string;
          status?: PublishStatus;
          thumbnail_path?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          published_at?: string | null;
          seo?: Json | null;
          slug?: string;
          status?: PublishStatus;
          thumbnail_path?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      portfolio_items: {
        Row: {
          client_name: string | null;
          content: string;
          created_at: string;
          id: string;
          image_path: string | null;
          published_at: string | null;
          seo: Json | null;
          slug: string;
          status: PublishStatus;
          summary: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          client_name?: string | null;
          content: string;
          created_at?: string;
          id?: string;
          image_path?: string | null;
          published_at?: string | null;
          seo?: Json | null;
          slug: string;
          status?: PublishStatus;
          summary?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          client_name?: string | null;
          content?: string;
          created_at?: string;
          id?: string;
          image_path?: string | null;
          published_at?: string | null;
          seo?: Json | null;
          slug?: string;
          status?: PublishStatus;
          summary?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          sort_order: number;
          status: PublishStatus;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          sort_order?: number;
          status?: PublishStatus;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          sort_order?: number;
          status?: PublishStatus;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          answer: string;
          category: string | null;
          created_at: string;
          id: string;
          question: string;
          sort_order: number;
          status: PublishStatus;
          updated_at: string;
        };
        Insert: {
          answer: string;
          category?: string | null;
          created_at?: string;
          id?: string;
          question: string;
          sort_order?: number;
          status?: PublishStatus;
          updated_at?: string;
        };
        Update: {
          answer?: string;
          category?: string | null;
          created_at?: string;
          id?: string;
          question?: string;
          sort_order?: number;
          status?: PublishStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          budget: string | null;
          company: string | null;
          content: string;
          created_at: string;
          email: string;
          id: string;
          name: string;
          phone: string | null;
          status: InquiryStatus;
          title: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          budget?: string | null;
          company?: string | null;
          content: string;
          created_at?: string;
          email: string;
          id?: string;
          name: string;
          phone?: string | null;
          status?: InquiryStatus;
          title: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          budget?: string | null;
          company?: string | null;
          content?: string;
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          phone?: string | null;
          status?: InquiryStatus;
          title?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      inquiry_attachments: {
        Row: {
          bucket: string;
          created_at: string;
          file_name: string;
          id: string;
          inquiry_id: string;
          path: string;
        };
        Insert: {
          bucket: string;
          created_at?: string;
          file_name: string;
          id?: string;
          inquiry_id: string;
          path: string;
        };
        Update: {
          bucket?: string;
          created_at?: string;
          file_name?: string;
          id?: string;
          inquiry_id?: string;
          path?: string;
        };
        Relationships: [
          {
            columns: ["inquiry_id"];
            foreignKeyName: "inquiry_attachments_inquiry_id_fkey";
            referencedColumns: ["id"];
            referencedRelation: "inquiries";
          },
        ];
      };
      site_settings: {
        Row: {
          created_at: string;
          is_public: boolean;
          key: string;
          updated_at: string;
          value: Json;
        };
        Insert: {
          created_at?: string;
          is_public?: boolean;
          key: string;
          updated_at?: string;
          value: Json;
        };
        Update: {
          created_at?: string;
          is_public?: boolean;
          key?: string;
          updated_at?: string;
          value?: Json;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      inquiry_status: "new" | "reviewing" | "answered" | "closed";
      publish_status: "draft" | "published" | "archived";
      user_role: "user" | "admin";
    };
    CompositeTypes: Record<string, never>;
  };
};
