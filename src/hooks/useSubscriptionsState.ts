import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const useSubscriptionsState = (
  customerId: string | undefined,
  mode: 'live' | 'test',
) => {
  const { post } = useApi()
  return useQuery({
    queryKey: ['subscriptionsState', customerId],
    queryFn: async () => {
      const response = await (
        await post(`/stripe/get_subscriptions_state`, {
          customer_id: customerId,
          mode,
        })
      ).json()
      return response.data
    },
    enabled: !!customerId,
  })
}

export default useSubscriptionsState
