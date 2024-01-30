import { useContext, createContext } from 'react'
import { NavState } from '../types'

interface NavigationContextValue {
  navState: NavState
  navigate: (state: NavState) => void
}

export const NavigationContext = createContext<
  NavigationContextValue | undefined
>(undefined)

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error(
      'useNavigation must be used within a NavigationContext.Provider',
    )
  }
  return context
}

export default useNavigation
