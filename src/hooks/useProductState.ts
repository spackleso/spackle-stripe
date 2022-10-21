import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'

const useProductState = (
  context: ExtensionContextValue,
  productId: string | undefined,
) => {
  const { post } = useApi(context)
  return useQuery(
    ['productState', productId],
    async () => {
      const response = await (
        await post(`api/stripe/get_product_state`, {
          product_id: productId,
          mode: context.environment.mode,
        })
      ).json()
      return response.data
    },
    { enabled: !!productId },
  )
}

export default useProductState
