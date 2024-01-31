import { createContext, ReactNode, useContext, useState } from 'react'

interface FeaturesFormContextProps {
  isShowingFeaturesForm: boolean
  setIsShowingFeaturesForm: (value: boolean) => void
}

export const FeaturesFormContext = createContext<
  FeaturesFormContextProps | undefined
>(undefined)

interface FeaturesFormProviderProps {
  children?: ReactNode
}

export const FeaturesFormProvider: React.FC = ({
  children,
}: FeaturesFormProviderProps) => {
  const [isShowingFeaturesForm, setIsShowingFeaturesForm] = useState(false)

  return (
    <FeaturesFormContext.Provider
      value={{ isShowingFeaturesForm, setIsShowingFeaturesForm }}
    >
      {children}
    </FeaturesFormContext.Provider>
  )
}

export const useFeaturesForm = () => {
  const context = useContext(FeaturesFormContext)
  if (!context) {
    throw new Error(
      'useFeaturesForm must be used within a FeaturesFormProvider',
    )
  }
  return context
}
