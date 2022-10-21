import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { QueryClientProvider } from '@tanstack/react-query'
import AccountWrapper from '../components/AccountWrapper'
import ProductView from '../components/ProductView'
import { queryClient } from '../query'

const View = (context: ExtensionContextValue) => {
  return (
    <QueryClientProvider client={queryClient}>
      {context.userContext && (
        <AccountWrapper context={context}>
          <ProductView context={context} />
        </AccountWrapper>
      )}
    </QueryClientProvider>
  )
}

export default View
