import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const useAccount = (accountId: string) => {
  const { post } = useApi()
  return useQuery({
    queryKey: ['account', accountId],
    queryFn: async () => {
      return await (await post(`/stripe/get_account`, {})).json()
    },
  })
}

export default useAccount
