import { Box, TabPanel } from '@stripe/ui-extension-sdk/ui'
import PricingTablesView from './PricingTablesView'

const PricingTableTab = ({ tabKey }: { tabKey: string }) => {
  return (
    <TabPanel tabKey={tabKey}>
      <Box key={tabKey}>
        <PricingTablesView />
      </Box>
    </TabPanel>
  )
}

export default PricingTableTab
