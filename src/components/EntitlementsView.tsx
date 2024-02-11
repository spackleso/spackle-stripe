import EntitlementsPlaceholderView from './EntitlementsPlaceholderView'
import useStripeContext from '../hooks/useStripeContext'
import CustomerEntitlementsView from './CustomerEntitlementsView'
import ProductEntitlementsView from './ProductEntitlementsView'

const EntitlementsView = () => {
  const { environment } = useStripeContext()

  if (environment.objectContext?.object === 'customer') {
    return <CustomerEntitlementsView />
  } else if (environment.objectContext?.object === 'product') {
    return <ProductEntitlementsView />
  } else {
    return <EntitlementsPlaceholderView />
  }
}

export default EntitlementsView
