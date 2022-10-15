export enum FeatureType {
  Flag = 0,
  Limit = 1,
}

export type Feature = {
  id: string
  key: string
  name: string
  type: FeatureType
  value_flag: boolean | null
  value_limit: number | null
}
