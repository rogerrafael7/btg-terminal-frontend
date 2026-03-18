export function toApiError(error: unknown) {
  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Unexpected API error." };
}
