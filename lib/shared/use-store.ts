import create from "zustand"
import {
  ImageFileEntityProps,
  Entity,
  EntityState,
} from "../hosted-image/types"

export const createStore = <T>(
  {
    entities = {},
  }: {
    entities: Record<string, Entity<T>>
  } = { entities: {} }
) => {
  return create<EntityState<T>>((set, get) => ({
    entities,
    setEntity(id: string, entity: Entity<T>): void {
      set((state: EntityState<T>) => ({
        entities: {
          ...state.entities,
          [id]: entity,
        },
      }))
    },
    getEntity(id: string): Entity<T> {
      const entity = get().entities[id]
      if (entity === undefined) {
        throw new Error(`Expected entity with id "${id}" but could not find it`)
      }
      return entity
    },
  }))
}

/**
 * This is kind of terrible. When TypeScript 4.7 has been out there for longer
 * and more popular, we can use the ability for TypeScript 4.7 to extract
 * type generics from generic functions without having to actually
 * instantiate the store.
 *
 * https://stackoverflow.com/questions/62720954/typescript-how-to-create-a-generic-type-alias-for-a-generic-function
 */

export const useImageStore = createStore<ImageFileEntityProps>()
export type UseImageStore = typeof useImageStore
