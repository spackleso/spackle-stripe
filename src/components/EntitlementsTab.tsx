import { TabPanel } from '@stripe/ui-extension-sdk/ui'
import EntitlementsView from './EntitlementsView'

const EntitlementsTab = ({ tabKey }: { tabKey: string }) => {
  return (
    <TabPanel tabKey={tabKey}>
      <EntitlementsView />
    </TabPanel>
  )
}

export default EntitlementsTab
