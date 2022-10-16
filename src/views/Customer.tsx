import { ContextView, Box, Link, Icon } from '@stripe/ui-extension-sdk/ui'
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { useEffect, useState, useCallback } from 'react'
import BrandIcon from './brand_icon.svg'
import useApi from '../hooks/useApi'
import { CustomerFeature, Feature } from '../types'
import FeatureList from '../components/FeatureList'
import FeaturesForm from '../components/FeaturesForm'

const Customer = (context: ExtensionContextValue) => {
  const customerId = context.environment.objectContext?.id
  const { post } = useApi(context)
  const [subscriptionsState, setSubscriptionsState] = useState<Feature[]>([])
  const [customerFeatures, setCustomerFeatures] = useState<CustomerFeature[]>(
    [],
  )
  const [isShowingFeaturesForm, setIsShowingFeaturesForm] = useState(false)

  const fetch = useCallback(async () => {
    let data = await (
      await post(`api/stripe/get_subscriptions_state`, {
        customer_id: customerId,
      })
    ).json()
    setSubscriptionsState(data.data)

    data = await (
      await post(`api/stripe/get_customer_features`, {
        customer_id: customerId,
      })
    ).json()
    setCustomerFeatures(data.data)
  }, [customerId, post])

  useEffect(() => {
    fetch()
  }, [fetch])

  const saveOverrides = useCallback(
    async (overrides) => {
      await post(`api/stripe/update_customer_features`, {
        customer_id: customerId,
        customer_features: overrides,
      })
      await fetch()
    },
    [post, fetch, customerId],
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
      <FeatureList
        features={subscriptionsState}
        overrides={customerFeatures}
        saveOverrides={(overrides) => saveOverrides(overrides)}
      />

      <FeaturesForm
        context={context}
        shown={isShowingFeaturesForm}
        setShown={(val: boolean) => {
          setIsShowingFeaturesForm(val)
          fetch()
        }}
      />
    </ContextView>
  )
}

export default Customer
