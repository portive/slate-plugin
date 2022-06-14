const { PORTIVE_API_KEY, PORTIVE_AUTH_TOKEN } = process.env

if (PORTIVE_API_KEY === undefined) {
  throw new Error(`Expected process.env.PORTIVE_API_KEY to be defined`)
}

if (PORTIVE_AUTH_TOKEN === undefined) {
  throw new Error(`Expected process.env.PORTIVE_AUTH_TOKEN to be defined`)
}

export const env = { PORTIVE_API_KEY, PORTIVE_AUTH_TOKEN }
