import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { QueryClientProvider } from '@tanstack/react-query'
import AccountWrapper from '../components/AccountWrapper'
import ProductView from '../components/ProductView'
import { queryClient } from '../query'
import { ApiContext, createApi } from '../hooks/useApi'

const View = (context: ExtensionContextValue) => {
  return (
    <QueryClientProvider client={queryClient}>
      {context.userContext && (
        <ApiContext.Provider value={createApi(context)}>
          <AccountWrapper context={context}>
            <ProductView context={context} />
          </AccountWrapper>
        </ApiContext.Provider>
      )}
    </QueryClientProvider>
  )
}

export default View
