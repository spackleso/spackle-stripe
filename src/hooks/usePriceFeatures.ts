import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const usePriceFeatures = (
  priceId: string | undefined,
  mode: 'live' | 'test',
) => {
  const { post } = useApi()
  return useQuery({
    queryKey: ['priceFeatures', priceId],
    queryFn: async () => {
      if (priceId) {
        const response = await (
          await post(`/stripe/get_price_features`, {
            price_id: priceId,
            mode,
          })
        ).json()
        return response.data
      }
    },
    enabled: !!priceId,
  })
}

export default usePriceFeatures
