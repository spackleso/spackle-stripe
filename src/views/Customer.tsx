import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { QueryClientProvider } from '@tanstack/react-query'
import AccountWrapper from '../components/AccountWrapper'
import CustomerView from '../components/CustomerView'
import { ApiContext, createApi } from '../hooks/useApi'
import { queryClient } from '../query'

const View = (context: ExtensionContextValue) => {
  return (
    <QueryClientProvider client={queryClient}>
      {context.userContext && (
        <ApiContext.Provider value={createApi(context)}>
          <AccountWrapper context={context}>
            <CustomerView context={context} />
          </AccountWrapper>
        </ApiContext.Provider>
      )}
    </QueryClientProvider>
  )
}

export default View
