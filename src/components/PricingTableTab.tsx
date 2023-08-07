import { TabPanel } from '@stripe/ui-extension-sdk/ui'
import PricingTablesView from './PricingTablesView'

const PricingTableTab = ({ tabKey }: { tabKey: string }) => {
  return (
    <TabPanel tabKey={tabKey}>
      <PricingTablesView />
    </TabPanel>
  )
}

export default PricingTableTab
