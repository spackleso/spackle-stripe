import Stripe from 'stripe'

export type NavKey =
  | 'home'
  | 'pricingTables'
  | 'entitlements'
  | 'settings'
  | 'pricingTable'

export type NavState = {
  key: NavKey
  param: string
}

export enum FeatureType {
  Flag = 0,
  Limit = 1,
}

export type NewFeature = {
  key: string
  name: string
  type: FeatureType
  value_flag: boolean | null
  value_limit: number | null
}

export type Feature = NewFeature & {
  id: number
}

export type NewProductFeature = {
  feature_id: number
  value_flag: boolean | null
  value_limit: number | null
}

export type ProductFeature = NewProductFeature & {
  id: number
}

export type NewPriceFeature = {
  feature_id: number
  value_flag: boolean | null
  value_limit: number | null
}

export type PriceFeature = NewPriceFeature & {
  id: number
}

export type NewCustomerFeature = {
  feature_id: number
  value_flag: boolean | null
  value_limit: number | null
}

export type CustomerFeature = NewCustomerFeature & {
  id: number
}

export type NewOverride =
  | NewProductFeature
  | NewPriceFeature
  | NewCustomerFeature

export type Override = ProductFeature | PriceFeature | CustomerFeature

export type PricingTable = {
  id: string
  name: string
  mode: number
  monthly_enabled: boolean
  annual_enabled: boolean
}

export type NewPricingTableProduct = {
  name: string
  product_id: string
  monthly_stripe_price?: Stripe.Price
  annual_stripe_price?: Stripe.Price
}

export type PricingTableProduct = NewPricingTableProduct & {
  id: number
}
