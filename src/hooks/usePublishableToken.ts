import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const useToken = (accountId: string) => {
  const { post } = useApi()
  return useQuery(['publishableToken', accountId], async () => {
    return await (await post(`/stripe/get_publishable_token`, {})).json()
  })
}

export default useToken
