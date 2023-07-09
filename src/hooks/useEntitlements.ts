import Stripe from 'stripe'
import useApi from './useApi'
import { useQuery } from '@tanstack/react-query'

type FeatureBase = {
  id: number
  name: string
  key: string
}

type FlagFeature = FeatureBase & {
  type: 0
  value_flag: boolean
  value_limit: null
}

type LimitFeature = FeatureBase & {
  type: 1
  value_flag: null
  value_limit: number
}

type Feature = FlagFeature | LimitFeature

export type Entitlements = {
  version: number
  features: Feature[]
  subscriptions: Stripe.Subscription[]
}

export const useEntitlements = (accountId: string) => {
  const { post } = useApi()
  return useQuery(['entitlements', accountId], async () => {
    const entitlements = await (
      await post(`/stripe/get_entitlements`, {})
    ).json()
    return {
      entitlements,
      flag: (key: string) => {
        for (const feature of entitlements?.features || []) {
          if (feature.type === 0 && feature.key === key) {
            return feature.value_flag
          }
        }
        return false
      },
      limit: (key: string) => {
        for (const feature of entitlements?.features || []) {
          if (feature.type === 1 && feature.key === key) {
            return feature.value_limit
          }
        }
        return 0
      },
    }
  })
}
