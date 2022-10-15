export enum FeatureType {
  Flag = 0,
  Limit = 1,
}

export type Feature = {
  id: number
  key: string
  name: string
  type: FeatureType
  value_flag: boolean | null
  value_limit: number | null
}

export type NewFeature = {
  key: string
  name: string
  type: FeatureType
  value_flag: boolean | null
  value_limit: number | null
}
