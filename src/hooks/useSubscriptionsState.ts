import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const useSubscriptionsState = (
  context: ExtensionContextValue,
  customerId: string | undefined,
) => {
  const { post } = useApi(context)
  return useQuery(
    ['subscriptionsState', customerId],
    async () => {
      const response = await (
        await post(`api/stripe/get_subscriptions_state`, {
          customer_id: customerId,
          mode: context.environment.mode,
        })
      ).json()
      return response.data
    },
    { enabled: !!customerId },
  )
}

export default useSubscriptionsState
