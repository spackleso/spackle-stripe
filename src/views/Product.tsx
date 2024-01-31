import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { QueryClientProvider } from '@tanstack/react-query'
import AccountWrapper from '../components/AccountWrapper'
import AppView from '../components/AppView'
import { queryClient } from '../query'
import { StripeContext } from '../hooks/useStripeContext'
import { ApiContext, createApi } from '../hooks/useApi'
import { FeaturesFormProvider } from '../contexts/FeaturesFormContext'
import { NavigationProvider } from '../contexts/NavigationContext'

const View = (context: ExtensionContextValue) => {
  return (
    <QueryClientProvider client={queryClient}>
      {context.userContext && (
        <StripeContext.Provider value={context}>
          <ApiContext.Provider value={createApi(context)}>
            <AccountWrapper>
              <NavigationProvider defaultKey="entitlements">
                <FeaturesFormProvider>
                  <AppView />
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
