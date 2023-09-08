import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { StripeContext } from '../hooks/useStripeContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { ApiContext, createApi } from '../hooks/useApi'
import AccountWrapper from '../components/AccountWrapper'
import { queryClient } from '../query'
import AppView from '../components/AppView'

const App = (context: ExtensionContextValue) => {
  return (
    <QueryClientProvider client={queryClient}>
      {context.userContext && (
        <StripeContext.Provider value={context}>
          <ApiContext.Provider value={createApi(context)}>
            <AccountWrapper>
              <AppView />
            </AccountWrapper>
          </ApiContext.Provider>
        </StripeContext.Provider>
      )}
    </QueryClientProvider>
  )
}

export default App
