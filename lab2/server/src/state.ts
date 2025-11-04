export type AppState = {
  xssEnabled: boolean
  bacEnabled: boolean
  messages: string[]
  logs: string[]
}

export const state: AppState = {
  xssEnabled: true,
  bacEnabled: true,
  messages: [],
  logs: []
}

export function log(msg: string) {
  const t = new Date().toISOString()
  state.logs.unshift(`[${t}] ${msg}`)
  state.logs = state.logs.slice(0, 100)
}
