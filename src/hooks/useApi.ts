import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import fetchStripeSignature from '@stripe/ui-extension-sdk/signature'
import { getDashboardUserEmail } from '@stripe/ui-extension-sdk/utils'
import { useContext, createContext } from 'react'

const isDev = true

let HOST = 'https://api.spackle.so'
if (isDev) {
  HOST = 'http://localhost:3000'
}

interface Api {
  post: (endpoint: string, requestData: any) => Promise<any>
}

export const ApiContext = createContext<Api | undefined>(undefined)

export const createApi = ({ userContext }: ExtensionContextValue) => ({
  post: async (endpoint: string, requestData: any) => {
    let email: string | undefined;
    try {
      const response = await getDashboardUserEmail();
      email = response.email;
    } catch (error) {}

    const data = {
      ...requestData,
      account_name: userContext.account.name,
      user_email: email,
      user_name: userContext.name,
    }

    const body = JSON.stringify({
      ...data,
      user_id: userContext.id,
      account_id: userContext.account.id,
    });

    return fetch(`${HOST}${endpoint}`, {
      method: 'POST',
      headers: {
        'Stripe-Signature': await fetchStripeSignature(data),
        'Content-Type': 'application/json',
      },
      body: body,
    });
  },
})

export const useApi = () => {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error('useApi must be used within a ApiContext.Provider')
  }
  return context
}

export default useApi
