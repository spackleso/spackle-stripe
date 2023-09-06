import {
  ContextView,
  Box,
  Spinner,
  Link,
  Icon,
  Inline,
} from '@stripe/ui-extension-sdk/ui'
import useAccountState from '../hooks/useAccountState'
import useProductFeatures from '../hooks/useProductFeatures'
import useProductState from '../hooks/useProductState'
import useApi from '../hooks/useApi'
import { useState, useEffect } from 'react'
import BrandIcon from '../views/icon.svg'
import FeaturesForm from '../components/FeaturesForm'
import FeatureList from '../components/FeatureList'
import { queryClient } from '../query'
import useStripeContext from '../hooks/useStripeContext'
import { NewOverride, Override } from '../types'
import { useMutation } from '@tanstack/react-query'
import { useEntitlements } from '../hooks/useEntitlements'
import EntitlementsPaywall from './EntitlementsPaywall'

const ProductView = () => {
  const { post } = useApi()
  const { environment, userContext } = useStripeContext()
  const entitlements = useEntitlements(userContext.account.id)
  const accountState = useAccountState(userContext.account.id)

  const productId = environment.objectContext?.id
  const productFeatures = useProductFeatures(productId, environment.mode)
  const productState = useProductState(productId, environment.mode)

  const [isShowingFeaturesForm, setIsShowingFeaturesForm] = useState(false)

  const saveOverrides = useMutation(
    async (overrides: Override[] | NewOverride[]) => {
      const response = await post(`/stripe/update_product_features`, {
        product_id: productId,
        product_features: overrides,
        mode: environment.mode,
      })
      queryClient.invalidateQueries(['productFeatures', productId])
      queryClient.invalidateQueries(['productState', productId])
      return response
    },
  )

  const isLoading =
    accountState.isLoading ||
    entitlements.isLoading ||
    productFeatures.isLoading ||
    productState.isLoading

  const entitled =
    entitlements.data?.flag('entitlements') || environment.mode === 'test'

  useEffect(() => {
    const track = async () => {
      await post('/stripe/identify', {
        path: `/products/${productId}`,
      })
      await post('/stripe/track', {
        event: '$pageview',
        properties: {
          $current_url: `https://stripe.spackle.so/products/${productId}`,
        },
      })
    }
    track()
  }, [])

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
      <Box css={{ marginTop: 'medium' }}>
        {accountState.data.length ? (
          <FeatureList
            features={accountState}
            overrides={productFeatures}
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
            {/* TODO: add a link to documentation/getting started */}
          </Box>
        )}
        <FeaturesForm
          shown={isShowingFeaturesForm}
          setShown={setIsShowingFeaturesForm}
        />
      </Box>
    )
  } else {
    return <EntitlementsPaywall />
  }
}

export default ProductView
