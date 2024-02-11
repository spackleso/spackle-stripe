import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { StripeContext } from '../hooks/useStripeContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { ApiContext, createApi } from '../hooks/useApi'
import AccountWrapper from '../components/AccountWrapper'
import { queryClient } from '../query'
import AppView from '../components/AppView'
import { FeaturesFormProvider } from '../contexts/FeaturesFormContext'
import { NavigationProvider } from '../contexts/NavigationContext'
import { PricingTableFormProvider } from '../contexts/PricingTableFormContext'

const App = (context: ExtensionContextValue) => {
  return (
    <QueryClientProvider client={queryClient}>
      {context.userContext && (
        <StripeContext.Provider value={context}>
          <ApiContext.Provider value={createApi(context)}>
            <AccountWrapper>
              <NavigationProvider>
                <FeaturesFormProvider>
                  <PricingTableFormProvider>
                    <AppView />
                  </PricingTableFormProvider>
                </FeaturesFormProvider>
              </NavigationProvider>
            </AccountWrapper>
          </ApiContext.Provider>
        </StripeContext.Provider>
      )}
    </QueryClientProvider>
  )
}

export default App
