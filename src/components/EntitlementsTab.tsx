import { TabPanel } from '@stripe/ui-extension-sdk/ui'
import EntitlementsPlaceholderView from './EntitlementsPlaceholderView'
import useStripeContext from '../hooks/useStripeContext'
import CustomerEntitlementsView from './CustomerEntitlementsView'
import ProductEntitlementsView from './ProductEntitlementsView'

const EntitlementsTab = ({ tabKey }: { tabKey: string }) => {
  const { environment } = useStripeContext()

  return (
    <TabPanel tabKey={tabKey}>
      {environment.objectContext?.object === 'customer' ? (
        <CustomerEntitlementsView />
      ) : environment.objectContext?.object === 'product' ? (
        <ProductEntitlementsView />
      ) : (
        <EntitlementsPlaceholderView />
      )}
    </TabPanel>
  )
}

export default EntitlementsTab
