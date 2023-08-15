import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const useAccountFeatures = (accountId: string) => {
  const { post } = useApi()
  return useQuery(['accountFeatures', accountId], async () => {
    const response = await (
      await post(`/stripe/get_account_features`, {})
    ).json()
    return response.data
  })
}

export default useAccountFeatures
