import { useQuery } from '@tanstack/react-query'
import useApi from './useApi'
import useStripeContext from './useStripeContext'

const usePricingTables = (accountId: string) => {
  const { post } = useApi()
  const { environment } = useStripeContext()
  return useQuery(['pricingTables', accountId], async () => {
    const response = await (
      await post(`/stripe/get_pricing_tables`, {
        mode: environment.mode,
      })
    ).json()
    return response.data
  })
}

export default usePricingTables
