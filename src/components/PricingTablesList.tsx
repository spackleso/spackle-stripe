import { Box, Button, Icon } from '@stripe/ui-extension-sdk/ui'
import useNavigation from '../contexts/NavigationContext'
import { PricingTable } from '../types'
import NavItem from './NavItem'

interface Props {
  pricingTables: PricingTable[]
}

const PricingTablesList = ({ pricingTables }: Props) => {
  const { navigate } = useNavigation()
  return (
    <Box css={{ stack: 'y', gapY: 'large' }}>
      <Box css={{ stack: 'x', distribute: 'space-between', alignY: 'center' }}>
        <Box css={{ font: 'heading' }}>Pricing Tables</Box>
        <Button
          type="primary"
          size="small"
          onPress={() => setIsShowingPricingTableForm(true)}
        >
          <Box css={{ stack: 'x', gapX: 'xsmall', alignY: 'center' }}>
            <Icon name="add" />
            Create
          </Box>
        </Button>
      </Box>
      <Box css={{ stack: 'y', gapY: 'large' }}>
        {pricingTables.map((pt) => (
          <NavItem
            key={pt.id}
            label={pt.name}
            onPress={() => navigate({ key: 'pricingTable', param: pt.id })}
          />
        ))}
      </Box>
    </Box>
  )
}

export default PricingTablesList
