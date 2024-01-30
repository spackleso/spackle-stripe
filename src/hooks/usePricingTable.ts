import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'
import useStripeContext from './useStripeContext'
import { PricingTable } from '../types'

const usePricingTables = (pricingTableId: string) => {
  const { post } = useApi()
  const { environment } = useStripeContext()
  return useQuery({
    queryKey: ['pricingTable', pricingTableId],
    queryFn: async () => {
      return (await (
        await post(`/stripe/get_pricing_table`, {
          mode: environment.mode,
          pricing_table_id: pricingTableId,
        })
      ).json()) as PricingTable
    },
  })
}

export default usePricingTables
