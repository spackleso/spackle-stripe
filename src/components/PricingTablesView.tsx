import { Box, Spinner } from '@stripe/ui-extension-sdk/ui'
import usePricingTables from '../hooks/usePricingTables'
import useStripeContext from '../hooks/useStripeContext'
import { useEntitlements } from '../hooks/useEntitlements'
import PricingTablesPaywall from './PricingTablesPaywall'
import PricingTablesList from './PricingTablesList'

const PricingTablesView = () => {
  const { environment, userContext } = useStripeContext()
  const entitlements = useEntitlements(userContext.account.id)
  const { data: pricingTables, isLoading } = usePricingTables(
    userContext.account.id,
  )
  const entitled =
    entitlements.data?.flag('pricing_tables') || environment.mode === 'test'

  if (isLoading) {
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
          marginTop: 'medium',
        }}
      >
        <Box css={{ stack: 'y', gapY: 'small' }}>
          {pricingTables ? (
            <PricingTablesList pricingTables={pricingTables} />
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
