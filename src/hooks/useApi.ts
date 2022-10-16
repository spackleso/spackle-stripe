import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import fetchStripeSignature from '@stripe/ui-extension-sdk/signature'
import { useCallback } from 'react'

const useApi = ({ userContext }: ExtensionContextValue) => {
  const post = useCallback(
    async (endpoint, requestData) => {
      const body = JSON.stringify({
        ...requestData,
        user_id: userContext.id,
        account_id: userContext.account.id,
      })

      return fetch(`http://localhost:3001/${endpoint}`, {
        method: 'POST',
        headers: {
          'Stripe-Signature': await fetchStripeSignature(requestData),
          'Content-Type': 'application/json',
        },
        body: body,
      })
    },
    [userContext],
  )

  return { post }
}

export default useApi
