export interface Header {
  field: string;
  value: string;
}

export const header = (field: string, value: string): Header => ({
  field,
  value,
});

/**
 * Parse response headers into an array of tuples
 */
export function parseHeaders(text: string): Header[] {
  const makeHeader = ([field, value]: string[]) => header(field, (value || '').trim());
  return text
    .split('\r\n')
    .filter(s => s)
    .map(s => s.split(':'))
    .map(makeHeader);
}

export function convertHeaderObject(headers: unknown): Header[] {
  const createHeader = (o: { [k: string]: any }) => (key: string) => header(key, String(o[key]));
  return typeof headers === 'object' && headers !== null
    ? Object.keys(headers).map(createHeader(headers))
    : [];
}
