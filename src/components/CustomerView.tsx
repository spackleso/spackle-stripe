import {
  ContextView,
  Box,
  Link,
  Icon,
  Spinner,
  Inline,
} from '@stripe/ui-extension-sdk/ui'
import { useEffect, useState } from 'react'
import BrandIcon from '../views/icon.svg'
import useApi from '../hooks/useApi'
import FeatureList from '../components/FeatureList'
import FeaturesForm from '../components/FeaturesForm'
import { queryClient } from '../query'
import useSubscriptionsState from '../hooks/useSubscriptionsState'
import useCustomerFeatures from '../hooks/useCustomerFeatures'
import useStripeContext from '../hooks/useStripeContext'
import { NewOverride, Override } from '../types'
import { useMutation } from '@tanstack/react-query'
import { useEntitlements } from '../hooks/useEntitlements'
import EntitlementsPaywall from './EntitlementsPaywall'
import { getDashboardUserEmail } from '@stripe/ui-extension-sdk/utils'

const CustomerView = () => {
  const { environment, userContext } = useStripeContext()
  const customerId = environment.objectContext?.id
  const { post } = useApi()
  const entitlements = useEntitlements(userContext.account.id)
  const subscriptionsState = useSubscriptionsState(customerId, environment.mode)
  const customerFeatures = useCustomerFeatures(customerId, environment.mode)
  const saveOverrides = useMutation(
    async (overrides: Override[] | NewOverride[]) => {
      const response = await post(`/stripe/update_customer_features`, {
        customer_id: customerId,
        customer_features: overrides,
        mode: environment.mode,
      })
      queryClient.invalidateQueries(['subscriptionsState', customerId])
      queryClient.invalidateQueries(['customerFeatures', customerId])
      return response
    },
  )
  const [isShowingFeaturesForm, setIsShowingFeaturesForm] = useState(false)

  const isLoading =
    entitlements.isLoading ||
    subscriptionsState.isLoading ||
    customerFeatures.isLoading

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

  return (
    <ContextView
      title="Customer Features"
      brandColor="#FFFFFF"
      brandIcon={BrandIcon}
      externalLink={{
        label: 'Documentation',
        href: 'https://docs.spackle.so',
      }}
      footerContent={
        entitled && (
          <>
            <Box>
              <Link
                type="secondary"
                onPress={() => setIsShowingFeaturesForm(!isShowingFeaturesForm)}
              >
                <Box css={{ stack: 'x', gapX: 'xsmall', alignY: 'center' }}>
                  <Icon name="settings" />
                  Manage Features
                </Box>
              </Link>
            </Box>
          </>
        )
      }
    >
      {isLoading ? (
        <Box
          css={{
            stack: 'x',
            alignX: 'center',
            alignY: 'center',
            width: 'fill',
            height: 'fill',
          }}
        >
          <Spinner />
        </Box>
      ) : entitled ? (
        <Box>
          {subscriptionsState.data.length ? (
            <FeatureList
              features={subscriptionsState}
              overrides={customerFeatures}
              saveOverrides={saveOverrides}
            />
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
              below
            </Box>
          )}

          <FeaturesForm
            shown={isShowingFeaturesForm}
            setShown={setIsShowingFeaturesForm}
          />
        </Box>
      ) : (
        <EntitlementsPaywall />
      )}
    </ContextView>
  )
}

export default CustomerView
