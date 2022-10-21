import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const useAccount = (context: ExtensionContextValue, accountId: string) => {
  const { post } = useApi(context)
  return useQuery(['account', accountId], async () => {
    return await (await post(`api/stripe/get_account`, {})).json()
  })
}

export default useAccount
