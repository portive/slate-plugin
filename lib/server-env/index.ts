const { PORTIVE_AUTH_TOKEN } = process.env

if (PORTIVE_AUTH_TOKEN === undefined) {
  throw new Error(`Expected process.env.PORTIVE_AUTH_TOKEN to be defined`)
}

export const env = { PORTIVE_AUTH_TOKEN }
