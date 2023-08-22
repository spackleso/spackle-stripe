import { Box, Spinner } from '@stripe/ui-extension-sdk/ui'
import usePricingTables from '../hooks/usePricingTables'
import useStripeContext from '../hooks/useStripeContext'
import PricingTable from './PricingTable'

const PricingTablesView = () => {
  const { userContext } = useStripeContext()
  const {
    data: pricingTables,
    isLoading,
    isRefetching,
  } = usePricingTables(userContext.account.id)

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

  return (
    <Box
      css={{
        stack: 'y',
        gapY: 'large',
        marginTop: 'large',
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
}

export default PricingTablesView
