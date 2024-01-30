import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { StripeContext } from '../hooks/useStripeContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { ApiContext, createApi } from '../hooks/useApi'
import AccountWrapper from '../components/AccountWrapper'
import { queryClient } from '../query'
import AppView from '../components/AppView'
import { NavigationContext } from '../hooks/useNavigation'
import { useState } from 'react'
import { NavState } from '../types'

const App = (context: ExtensionContextValue) => {
  const [navState, setNavState] = useState<NavState>({
    key: 'home',
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

export default App
