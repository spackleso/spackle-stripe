import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const useAccountState = (accountId: string) => {
  const { post } = useApi()
  return useQuery({
    queryKey: ['accountState', accountId],
    queryFn: async () => {
      const response = await (
        await post(`/stripe/get_account_state`, {})
      ).json()
      return response.data
    },
  })
}

export default useAccountState
