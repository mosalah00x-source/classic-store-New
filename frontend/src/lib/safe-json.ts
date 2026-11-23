/**
 * Read a JSON response without allowing empty or malformed bodies to leak a
 * SyntaxError into page rendering. Callers classify undefined as a request error.
 */
export async function readJsonResponse<T>(response: Response): Promise<T | undefined> {
  try {
    const body = await response.text();
    if (!body.trim()) return undefined;
    return JSON.parse(body) as T;
  } catch {
    return undefined;
  }
}
