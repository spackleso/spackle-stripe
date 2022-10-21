import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const useAccountState = (context: ExtensionContextValue, accountId: string) => {
  const { post } = useApi(context)
  return useQuery(['accountState', accountId], async () => {
    const response = await (
      await post(`api/stripe/get_account_state`, {})
    ).json()
    return response.data
  })
}

export default useAccountState
