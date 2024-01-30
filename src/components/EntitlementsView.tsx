import { Box } from '@stripe/ui-extension-sdk/ui'
import EntitlementsPlaceholderView from './EntitlementsPlaceholderView'
import useStripeContext from '../hooks/useStripeContext'
import CustomerEntitlementsView from './CustomerEntitlementsView'
import ProductEntitlementsView from './ProductEntitlementsView'

const EntitlementsView = () => {
  const { environment } = useStripeContext()

  if (environment.objectContext?.object === 'customer') {
    return (
      <Box>
        <CustomerEntitlementsView />
      </Box>
    )
  } else if (environment.objectContext?.object === 'product') {
    return (
      <Box>
        <ProductEntitlementsView />
      </Box>
    )
  } else {
    return <EntitlementsPlaceholderView />
  }
}

export default EntitlementsView
