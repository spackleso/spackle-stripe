import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const useToken = (accountId: string) => {
  const { post } = useApi()
  return useQuery({
    queryKey: ['token', accountId],
    queryFn: async () => {
      return await (await post(`/stripe/get_token`, {})).json()
    },
  })
}

export default useToken
