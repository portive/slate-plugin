const { PORTIVE_API_KEY } = process.env

if (PORTIVE_API_KEY === undefined) {
  throw new Error(`Expected process.env.PORTIVE_API_KEY to be defined`)
}

export const env = { PORTIVE_API_KEY }
