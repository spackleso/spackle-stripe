import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'
import { PricingTableProduct } from '../types'

const usePricingTableProducts = (pricingTableId: string) => {
  const { post } = useApi()
  return useQuery({
    queryKey: ['pricingTableProducts', pricingTableId],
    queryFn: async () => {
      return (await (
        await post(`/stripe/get_pricing_table_products`, {
          pricing_table_id: pricingTableId,
        })
      ).json()) as PricingTableProduct[]
    },
  })
}

export default usePricingTableProducts
