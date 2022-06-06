import { FakePromise } from "fake-promise"

export function resolve<T>(promise: Promise<T>) {
  const fakePromise = promise as FakePromise<T>
  fakePromise.resolve()
}
