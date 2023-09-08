import { Box, Spinner } from '@stripe/ui-extension-sdk/ui'
import usePricingTables from '../hooks/usePricingTables'
import useStripeContext from '../hooks/useStripeContext'
import PricingTable from './PricingTable'
import { useEntitlements } from '../hooks/useEntitlements'
import PricingTablesPaywall from './PricingTablesPaywall'

const PricingTablesView = () => {
  const { environment, userContext } = useStripeContext()
  const entitlements = useEntitlements(userContext.account.id)
  const {
    data: pricingTables,
    isLoading,
    isRefetching,
  } = usePricingTables(userContext.account.id)
  const entitled =
    entitlements.data?.flag('pricing_tables') || environment.mode === 'test'

  if (isLoading || isRefetching) {
    return (
      <Box
        css={{
          stack: 'x',
          alignX: 'center',
          alignY: 'center',
          width: 'fill',
          height: 'fill',
          marginTop: 'xlarge',
        }}
      >
        <Spinner />
      </Box>
    )
  }

  if (entitled) {
    return (
      <Box
        css={{
          stack: 'y',
          gapY: 'large',
          marginTop: 'medium',
        }}
      >
        <Box css={{ stack: 'y', gapY: 'small' }}>
          {pricingTables ? (
            <PricingTable pricingTable={pricingTables[0]} />
          ) : (
            'Something went wrong'
          )}
        </Box>
      </Box>
    )
  } else {
    return <PricingTablesPaywall />
  }
}

export default PricingTablesView
