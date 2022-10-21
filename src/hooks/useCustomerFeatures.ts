import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const useCustomerFeatures = (
  context: ExtensionContextValue,
  customerId: string | undefined,
) => {
  const { post } = useApi(context)
  return useQuery(
    ['customerFeatures', customerId],
    async () => {
      if (customerId) {
        const response = await (
          await post(`api/stripe/get_customer_features`, {
            customer_id: customerId,
            mode: context.environment.mode,
          })
        ).json()
        return response.data
      }
    },
    { enabled: !!customerId },
  )
}

export default useCustomerFeatures
