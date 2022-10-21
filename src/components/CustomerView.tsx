import {
  ContextView,
  Box,
  Link,
  Icon,
  Spinner,
} from '@stripe/ui-extension-sdk/ui'
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { useState, useCallback } from 'react'
import BrandIcon from '../views/brand_icon.svg'
import useApi from '../hooks/useApi'
import FeatureList from '../components/FeatureList'
import FeaturesForm from '../components/FeaturesForm'
import { queryClient } from '../query'
import useSubscriptionsState from '../hooks/useSubscriptionsState'
import useCustomerFeatures from '../hooks/useCustomerFeatures'

const CustomerView = ({ context }: { context: ExtensionContextValue }) => {
  const customerId = context.environment.objectContext?.id
  const { post } = useApi(context)
  const { data: subscriptionsState } = useSubscriptionsState(
    context,
    customerId,
  )
  const { data: customerFeatures } = useCustomerFeatures(context, customerId)
  const [isShowingFeaturesForm, setIsShowingFeaturesForm] = useState(false)

  const saveOverrides = useCallback(
    async (overrides) => {
      await post(`api/stripe/update_customer_features`, {
        customer_id: customerId,
        customer_features: overrides,
        mode: context.environment.mode,
      })
      queryClient.invalidateQueries(['subscriptionsState', customerId])
      queryClient.invalidateQueries(['customerFeatures', customerId])
    },
    [post, customerId, context.environment.mode],
  )

  return (
    <ContextView
      title="Customer Features"
      brandColor="#F6F8FA"
      brandIcon={BrandIcon}
      actions={
        <>
          <Box>
            <Link
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
          <FeatureList
            features={subscriptionsState}
            overrides={customerFeatures}
            saveOverrides={(overrides) => saveOverrides(overrides)}
          />

          <FeaturesForm
            context={context}
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
