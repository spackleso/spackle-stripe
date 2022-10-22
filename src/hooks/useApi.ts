import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import fetchStripeSignature from '@stripe/ui-extension-sdk/signature'
import { useContext, createContext } from 'react'

interface Api {
  post: (endpoint: string, requestData: any) => Promise<any>
}

export const ApiContext = createContext<Api | undefined>(undefined)

export const createApi = ({ userContext }: ExtensionContextValue) => ({
  post: async (endpoint: string, requestData: any) => {
    const body = JSON.stringify({
      ...requestData,
      user_id: userContext.id,
      account_id: userContext.account.id,
    })

    return fetch(`https://www.spackle.so/${endpoint}`, {
      method: 'POST',
      headers: {
        'Stripe-Signature': await fetchStripeSignature(requestData),
        'Content-Type': 'application/json',
      },
      body: body,
    })
  },
})

export const useApi = () => {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error('useApi must be used within a ')
  }
  return context
}

export default useApi
