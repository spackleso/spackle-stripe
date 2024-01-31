import { createContext, ReactNode, useContext, useState } from 'react'

interface PricingTableFormContextProps {
  isShowingPricingTableForm: boolean
  setIsShowingPricingTableForm: (value: boolean) => void
}

export const PricingTableFormContext = createContext<
  PricingTableFormContextProps | undefined
>(undefined)

interface PricingTableFormProviderProps {
  children?: ReactNode
}

export const PricingTableFormProvider: React.FC<
  PricingTableFormProviderProps
> = ({ children }: PricingTableFormProviderProps) => {
  const [isShowingPricingTableForm, setIsShowingPricingTableForm] =
    useState(false)

  return (
    <PricingTableFormContext.Provider
      value={{ isShowingPricingTableForm, setIsShowingPricingTableForm }}
    >
      {children}
    </PricingTableFormContext.Provider>
  )
}

export const usePricingTableForm = () => {
  const context = useContext(PricingTableFormContext)
  if (!context) {
    throw new Error(
      'usePricingTableForm must be used within a PricingTableFormProvider',
    )
  }
  return context
}
