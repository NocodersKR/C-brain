type SupabaseErrorLike = {
  message: string;
};

export function unwrapSupabaseData<T>(
  data: T | null,
  error: SupabaseErrorLike | null,
): T {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error("Supabase returned no data.");
  return data;
}

export function assertSupabaseSuccess(error: SupabaseErrorLike | null) {
  if (error) throw new Error(error.message);
}
