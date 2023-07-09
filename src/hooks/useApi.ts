import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import fetchStripeSignature from '@stripe/ui-extension-sdk/signature'
import { getDashboardUserEmail } from '@stripe/ui-extension-sdk/utils'
import { useContext, createContext } from 'react'

interface Api {
  post: (endpoint: string, requestData: any) => Promise<any>
}

export const ApiContext = createContext<Api | undefined>(undefined)

export const createApi = ({
  userContext,
  environment,
}: ExtensionContextValue) => ({
  post: async (endpoint: string, requestData: any) => {
    let email: string | undefined
    try {
      const response = await getDashboardUserEmail()
      email = response.email
    } catch (error) {
      console.error(error)
    }

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
    })

    const host = environment.constants?.API_HOST ?? ''
    return fetch(`${host}${endpoint}`, {
      method: 'POST',
      headers: {
        'Stripe-Signature': await fetchStripeSignature(data),
        'Content-Type': 'application/json',
      },
      body: body,
    })
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
