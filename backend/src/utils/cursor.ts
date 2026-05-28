export type DiscoveryCursor = {
  postCursor?: string
  reelCursor?: string
  timestamp: string
}

export function encodeCursor(cursor: DiscoveryCursor): string {
  return Buffer.from(JSON.stringify(cursor)).toString('base64')
}

export function decodeCursor(cursor: string): DiscoveryCursor {
  return JSON.parse(Buffer.from(cursor, 'base64').toString())
}
