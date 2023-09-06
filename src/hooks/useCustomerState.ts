import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const useCustomerState = (
  customerId: string | undefined,
  mode: 'live' | 'test',
) => {
  const { post } = useApi()
  return useQuery(
    ['customerState', customerId],
    async () => {
      const response = await (
        await post(`/stripe/get_customer_state`, {
          customer_id: customerId,
          mode,
        })
      ).json()
      return response.data
    },
    { enabled: !!customerId },
  )
}

export default useCustomerState
