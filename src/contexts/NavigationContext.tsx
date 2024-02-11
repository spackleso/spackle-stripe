import { useContext, createContext, useState, ReactNode } from 'react'
import { NavKey, NavState } from '../types'

interface NavigationContextProps {
  navState: NavState
  navigate: (state: NavState) => void
}

export const NavigationContext = createContext<
  NavigationContextProps | undefined
>(undefined)

interface NavigationProviderProps {
  defaultKey?: NavKey
  children?: ReactNode
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  defaultKey = 'home',
  children,
}: NavigationProviderProps) => {
  const [navState, setNavState] = useState<NavState>({
    key: defaultKey,
    param: '',
  })

  return (
    <NavigationContext.Provider
      value={{
        navState,
        navigate: (state: NavState) => setNavState(state),
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

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
