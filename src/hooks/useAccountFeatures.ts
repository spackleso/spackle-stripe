import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const useProductFeatures = (
  context: ExtensionContextValue,
  accountId: string,
) => {
  const { post } = useApi(context)
  return useQuery(['accountFeatures', accountId], async () => {
    const response = await (
      await post(`api/stripe/get_account_features`, {})
    ).json()
    return response.data
  })
}

export default useProductFeatures
