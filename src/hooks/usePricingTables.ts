import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'
import useStripeContext from './useStripeContext'
import { PricingTable } from '../types'

const usePricingTables = (accountId: string) => {
  const { post } = useApi()
  const { environment } = useStripeContext()
  return useQuery({
    queryKey: ['pricingTables', accountId],
    queryFn: async () => {
      return (await (
        await post(`/stripe/get_pricing_tables`, {
          mode: environment.mode,
        })
      ).json()) as PricingTable[]
    },
  })
}

export default usePricingTables
