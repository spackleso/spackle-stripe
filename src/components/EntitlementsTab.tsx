import { Box, TabPanel } from '@stripe/ui-extension-sdk/ui'
import EntitlementsPlaceholderView from './EntitlementsPlaceholderView'
import useStripeContext from '../hooks/useStripeContext'
import CustomerEntitlementsView from './CustomerEntitlementsView'
import ProductEntitlementsView from './ProductEntitlementsView'

const EntitlementsTab = ({ tabKey }: { tabKey: string }) => {
  const { environment } = useStripeContext()

  return (
    <TabPanel tabKey={tabKey}>
      {environment.objectContext?.object === 'customer' ? (
        <Box key={tabKey}>
          <CustomerEntitlementsView />
        </Box>
      ) : environment.objectContext?.object === 'product' ? (
        <Box key={tabKey}>
          <ProductEntitlementsView />
        </Box>
      ) : (
        <Box key={tabKey}>
          <EntitlementsPlaceholderView />
        </Box>
      )}
    </TabPanel>
  )
}

export default EntitlementsTab
