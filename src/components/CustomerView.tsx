import {
  ContextView,
  Box,
  Link,
  Icon,
  Spinner,
  Inline,
} from '@stripe/ui-extension-sdk/ui'
import { useState } from 'react'
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

const CustomerView = () => {
  const { environment } = useStripeContext()
  const customerId = environment.objectContext?.id
  const { post } = useApi()
  const { data: subscriptionsState } = useSubscriptionsState(
    customerId,
    environment.mode,
  )
  const { data: customerFeatures } = useCustomerFeatures(
    customerId,
    environment.mode,
  )
  const saveOverrides = useMutation(
    async (overrides: Override[] | NewOverride[]) => {
      const response = await post(`api/stripe/update_customer_features`, {
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

  return (
    <ContextView
      title="Customer Features"
      brandColor="#FFFFFF"
      brandIcon={BrandIcon}
      externalLink={{
        label: 'Documentation',
        href: 'https://www.spackle.so/docs',
      }}
      footerContent={
        <>
          <Box>
            <Link
              type="secondary"
              onPress={() => setIsShowingFeaturesForm(!isShowingFeaturesForm)}
            >
              <Icon name="settings" />
              Manage Features
            </Link>
          </Box>
        </>
      }
    >
      {subscriptionsState ? (
        <Box>
          {subscriptionsState.length ? (
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
      )}
    </ContextView>
  )
}

export default CustomerView
