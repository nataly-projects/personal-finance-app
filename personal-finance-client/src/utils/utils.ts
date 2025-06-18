export const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills"];

export function safeJSONParse<T>(value: string | null): T | null {
    try {
      return value && value !== 'undefined' ? JSON.parse(value) : null;
    } catch {
      console.warn('Invalid JSON:', value);
      return null;
    }
}

