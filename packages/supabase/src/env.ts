export type PublicSupabaseEnv = {
  publishableKey: string;
  url: string;
};

export type ServerSupabaseEnv = PublicSupabaseEnv & {
  secretKey: string;
};

function readRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getPublicSupabaseEnv(): PublicSupabaseEnv {
  return {
    publishableKey: readRequiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    url: readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
  };
}

export function getServerSupabaseEnv(): ServerSupabaseEnv {
  return {
    ...getPublicSupabaseEnv(),
    secretKey: readRequiredEnv("SUPABASE_SECRET_KEY"),
  };
}
