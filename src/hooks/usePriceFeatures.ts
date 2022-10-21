import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const usePriceFeatures = (
  context: ExtensionContextValue,
  priceId: string | undefined,
) => {
  const { post } = useApi(context)
  return useQuery(
    ['priceFeatures', priceId],
    async () => {
      if (priceId) {
        const response = await (
          await post(`api/stripe/get_price_features`, {
            price_id: priceId,
            mode: context.environment.mode,
          })
        ).json()
        return response.data
      }
    },
    { enabled: !!priceId },
  )
}

export default usePriceFeatures
