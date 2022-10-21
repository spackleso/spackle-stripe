import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { QueryClientProvider } from '@tanstack/react-query'
import ProductView from '../components/ProductView'
import { queryClient } from '../query'

const View = (context: ExtensionContextValue) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductView context={context} />
    </QueryClientProvider>
  )
}

export default View
