import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { QueryClientProvider } from '@tanstack/react-query'
import AccountWrapper from '../components/AccountWrapper'
import AppView from '../components/AppView'
import { queryClient } from '../query'
import { StripeContext } from '../hooks/useStripeContext'
import { ApiContext, createApi } from '../hooks/useApi'
import { useState } from 'react'
import { NavState } from '../types'
import { NavigationContext } from '../hooks/useNavigation'

const View = (context: ExtensionContextValue) => {
  // Default to entitlements on a product
  const [navState, setNavState] = useState<NavState>({
    key: 'entitlements',
    param: '',
  })

  return (
    <QueryClientProvider client={queryClient}>
      {context.userContext && (
        <StripeContext.Provider value={context}>
          <ApiContext.Provider value={createApi(context)}>
            <AccountWrapper>
              <NavigationContext.Provider
                value={{
                  navState,
                  navigate: (state: NavState) => setNavState(state),
                }}
              >
                <AppView />
              </NavigationContext.Provider>
            </AccountWrapper>
          </ApiContext.Provider>
        </StripeContext.Provider>
      )}
    </QueryClientProvider>
  )
}

export default View
