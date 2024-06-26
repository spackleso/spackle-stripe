import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const useProductState = (
  productId: string | undefined,
  mode: 'live' | 'test',
) => {
  const { post } = useApi()
  return useQuery({
    queryKey: ['productState', productId],
    queryFn: async () => {
      const response = await (
        await post(`/stripe/get_product_state`, {
          product_id: productId,
          mode,
        })
      ).json()
      return response.data
    },
    enabled: !!productId,
  })
}

export default useProductState
