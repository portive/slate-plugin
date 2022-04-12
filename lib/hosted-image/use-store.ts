import create from "zustand"

type FileLoadingEntity = {
  type: "loading"
  url: string
  viewSize: [number, number]
  sentBytes: number
  totalBytes: number
}

type FileUploadedEntity = {
  type: "uploaded"
  url: string
  size: [number, number]
}

export type Entity = FileLoadingEntity | FileUploadedEntity

type EntityState = {
  entities: Record<string, Entity>
  setImage: (id: string, entity: Entity) => void
}

export const createStore = (
  {
    entities = {},
  }: {
    entities: Record<string, Entity>
  } = { entities: {} }
) => {
  return create<EntityState>((set) => ({
    entities,
    setImage(id: string, entity: Entity) {
      set((state: EntityState) => ({
        entities: {
          ...state.entities,
          [id]: entity,
        },
      }))
    },
  }))
}

export const useStore = createStore()

export type UseStore = typeof useStore
