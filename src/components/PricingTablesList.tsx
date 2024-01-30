import { Box } from '@stripe/ui-extension-sdk/ui'
import useNavigation from '../hooks/useNavigation'
import { PricingTable } from '../types'
import NavItem from './NavItem'

interface Props {
  pricingTables: PricingTable[]
}

const PricingTablesList = ({ pricingTables }: Props) => {
  const { navigate } = useNavigation()
  return (
    <Box css={{ stack: 'y', gapY: 'large' }}>
      {pricingTables.map((pt) => (
        <NavItem
          key={pt.id}
          label={pt.name}
          onPress={() => navigate({ key: 'pricingTable', param: pt.id })}
        />
      ))}
    </Box>
  )
}

export default PricingTablesList
