import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import fetchStripeSignature from '@stripe/ui-extension-sdk/signature'
import { NestableJSONValue } from '@stripe/ui-extension-sdk/types/util'
import { getDashboardUserEmail } from '@stripe/ui-extension-sdk/utils'
import { useContext, createContext } from 'react'

interface Api {
  post: (endpoint: string, requestData: NestableJSONValue) => Promise<Response>
}

export const ApiContext = createContext<Api | undefined>(undefined)

export const createApi = ({
  userContext,
  environment,
}: ExtensionContextValue) => ({
  post: async (endpoint: string, requestData: NestableJSONValue) => {
    let email: string | undefined
    try {
      const response = await getDashboardUserEmail()
      email = response.email
    } catch (error) {
      console.error(error)
    }

    const data = {
      ...requestData,
      account_name: userContext.account.name ?? null,
      user_email: email ?? null,
      user_name: userContext.name ?? null,
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
