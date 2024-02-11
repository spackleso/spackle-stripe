import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { QueryClientProvider } from '@tanstack/react-query'
import AccountWrapper from '../components/AccountWrapper'
import AppView from '../components/AppView'
import { FeaturesFormProvider } from '../contexts/FeaturesFormContext'
import { NavigationProvider } from '../contexts/NavigationContext'
import { PricingTableFormProvider } from '../contexts/PricingTableFormContext'
import { ApiContext, createApi } from '../hooks/useApi'
import { StripeContext } from '../hooks/useStripeContext'
import { queryClient } from '../query'

const View = (context: ExtensionContextValue) => {
  return (
    <QueryClientProvider client={queryClient}>
      {context.userContext && (
        <StripeContext.Provider value={context}>
          <ApiContext.Provider value={createApi(context)}>
            <AccountWrapper>
              <NavigationProvider defaultKey="entitlements">
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

export default View
