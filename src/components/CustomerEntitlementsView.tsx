import { Box, Spinner, Inline, Button, Icon } from '@stripe/ui-extension-sdk/ui'
import { useEffect, useState } from 'react'
import useApi from '../hooks/useApi'
import EntitlementsForm from './EntitlementsForm'
import { queryClient } from '../query'
import useSubscriptionsState from '../hooks/useSubscriptionsState'
import useCustomerFeatures from '../hooks/useCustomerFeatures'
import useStripeContext from '../hooks/useStripeContext'
import { NewOverride, Override } from '../types'
import { useMutation } from '@tanstack/react-query'
import { useEntitlements } from '../hooks/useEntitlements'
import EntitlementsPaywall from './EntitlementsPaywall'
import { sortFeatures } from '../utils'
import EntitlementItem from './EntitlementItem'
import stripe from '../stripe'
import useCustomerState from '../hooks/useCustomerState'

const CustomerView = () => {
  const { environment, userContext } = useStripeContext()
  const customerId = environment.objectContext?.id
  const { post } = useApi()
  const entitlements = useEntitlements(userContext.account.id)
  const subscriptionsState = useSubscriptionsState(customerId, environment.mode)
  const customerState = useCustomerState(customerId, environment.mode)
  const customerFeatures = useCustomerFeatures(customerId, environment.mode)
  const [isShowingForm, setIsShowingForm] = useState(false)
  const [stripeCustomer, setStripeCustomer] = useState<any>(null)

  const saveOverrides = useMutation({
    mutationFn: async (overrides: Override[] | NewOverride[]) => {
      const response = await post(`/stripe/update_customer_features`, {
        customer_id: customerId,
        customer_features: overrides,
        mode: environment.mode,
      })
      queryClient.invalidateQueries({
        queryKey: ['subscriptionsState', customerId],
      })
      queryClient.invalidateQueries({
        queryKey: ['customerFeatures', customerId],
      })
      queryClient.invalidateQueries({ queryKey: ['customerState', customerId] })
      setIsShowingForm(false)
      return response
    },
  })

  const isLoading =
    entitlements.isLoading ||
    subscriptionsState.isLoading ||
    subscriptionsState.isRefetching ||
    customerFeatures.isLoading ||
    customerState.isLoading ||
    !stripeCustomer

  const entitled =
    entitlements.data?.flag('entitlements') || environment.mode === 'test'

  useEffect(() => {
    const track = async () => {
      await post('/stripe/identify', {
        path: `/customers/${customerId}`,
      })
      await post('/stripe/track', {
        event: '$pageview',
        properties: {
          $current_url: `https://stripe.spackle.so/customers/${customerId}`,
        },
      })
    }
    track()
  }, [])

  useEffect(() => {
    const fetchStripeCustomer = async () => {
      if (!customerId) return
      const response = await stripe.customers.retrieve(customerId)
      setStripeCustomer(response)
    }

    fetchStripeCustomer()
  }, [customerId])

  if (isLoading) {
    return (
      <Box
        css={{
          stack: 'x',
          alignX: 'center',
          alignY: 'center',
          width: 'fill',
          height: 'fill',
          marginTop: 'xlarge',
        }}
      >
        <Spinner />
      </Box>
    )
  } else if (entitled) {
    return (
      <Box css={{ stack: 'y', marginTop: 'medium', gapY: 'large' }}>
        <Box>
          <Box css={{ stack: 'x', gapX: 'small' }}>
            <Button
              type="secondary"
              size="small"
              onPress={() => setIsShowingForm(true)}
            >
              <Box
                css={{
                  width: 'fill',
                  stack: 'x',
                  gapX: 'small',
                  alignY: 'center',
                }}
              >
                <Icon name="edit"></Icon>
                Edit
              </Box>
            </Button>
          </Box>
        </Box>

        {customerState.data.features.length ? (
          <Box css={{ stack: 'y', gapY: 'small' }}>
            <Box
              css={{
                font: 'heading',
                fontWeight: 'bold',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              Entitlements{' '}
              {stripeCustomer?.name
                ? `for ${stripeCustomer.name}`
                : stripeCustomer?.email
                  ? `for ${stripeCustomer.email}`
                  : ''}
            </Box>
            {customerState.data.features.sort(sortFeatures).map((f: any) => (
              <EntitlementItem key={f.key} entitlement={f} />
            ))}
          </Box>
        ) : (
          <Box
            css={{
              keyline: 'neutral',
              padding: 'medium',
              font: 'caption',
              borderRadius: 'small',
              margin: 'medium',
              textAlign: 'center',
            }}
          >
            You don&apos;t have any features yet. Create a new feature by
            clicking{' '}
            <Inline css={{ fontWeight: 'bold' }}>
              &quot;Manage Features&quot;
            </Inline>{' '}
            above
          </Box>
        )}
        <EntitlementsForm
          name={stripeCustomer?.name || stripeCustomer?.email || ''}
          features={subscriptionsState}
          overrides={customerFeatures}
          saveOverrides={saveOverrides}
          shown={isShowingForm}
          setShown={setIsShowingForm}
        />
      </Box>
    )
  } else {
    return <EntitlementsPaywall />
  }
}

export default CustomerView
