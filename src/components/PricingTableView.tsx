import { Box, Spinner } from '@stripe/ui-extension-sdk/ui'
import usePricingTable from '../hooks/usePricingTable'
import PricingTable from './PricingTable'

interface Props {
  pricingTableId: string
}

const PricingTableView = ({ pricingTableId }: Props) => {
  const {
    data: pricingTable,
    isLoading,
    isRefetching,
  } = usePricingTable(pricingTableId)

  if (isLoading || isRefetching || !pricingTable) {
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

  return <PricingTable pricingTable={pricingTable} />
}

export default PricingTableView
