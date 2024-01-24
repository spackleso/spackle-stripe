import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client'
import Stripe from 'stripe'

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  // @ts-expect-error: This is the account's default api version. TODO: ugprade
  apiVersion: '2022-08-01',
})

export default stripe
