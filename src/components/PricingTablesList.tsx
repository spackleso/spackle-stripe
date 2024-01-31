import { Box, Button, Icon } from '@stripe/ui-extension-sdk/ui'
import { useMutation } from '@tanstack/react-query'
import useNavigation from '../contexts/NavigationContext'
import { usePricingTableForm } from '../contexts/PricingTableFormContext'
import useApi from '../hooks/useApi'
import useStripeContext from '../hooks/useStripeContext'
import { queryClient } from '../query'
import {
  PricingTable,
  PricingTableCreateData,
  PricingTableUpdateData,
} from '../types'
import NavItem from './NavItem'
import PricingTableForm from './PricingTableForm'

interface Props {
  pricingTables: PricingTable[]
}

const PricingTablesList = ({ pricingTables }: Props) => {
  const { post } = useApi()
  const { navigate } = useNavigation()
  const { environment, userContext } = useStripeContext()
  const { setIsShowingPricingTableForm } = usePricingTableForm()

  const savePricingTable = useMutation({
    mutationFn: async (
      data: PricingTableCreateData | PricingTableUpdateData,
    ) => {
      const response = await post(`/stripe/create_pricing_table`, data)
      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }
      queryClient.invalidateQueries({
        queryKey: ['pricingTables', userContext.account.id],
      })
      setIsShowingPricingTableForm(false)
    },
  })

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
      <PricingTableForm
        pricingTable={{
          id: '',
          name: '',
          mode: environment.mode === 'live' ? 0 : 1,
          monthly_enabled: false,
          annual_enabled: false,
        }}
        pricingTableProducts={[]}
        savePricingTable={savePricingTable}
      />
    </Box>
  )
}

export default PricingTablesList
