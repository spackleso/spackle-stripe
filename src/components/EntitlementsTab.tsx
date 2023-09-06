import { TabPanel } from '@stripe/ui-extension-sdk/ui'
import EntitlementsView from './EntitlementsView'
import useStripeContext from '../hooks/useStripeContext'
import CustomerView from './CustomerView'
import ProductView from './ProductView'

const EntitlementsTab = ({ tabKey }: { tabKey: string }) => {
  const { environment } = useStripeContext()

  return (
    <TabPanel tabKey={tabKey}>
      {environment.objectContext?.object === 'customer' ? (
        <CustomerView />
      ) : environment.objectContext?.object === 'product' ? (
        <ProductView />
      ) : (
        <EntitlementsView />
      )}
    </TabPanel>
  )
}

export default EntitlementsTab
