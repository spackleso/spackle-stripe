import {
  ContextView,
  Box,
  Accordion,
  Spinner,
  Link,
  Icon,
} from '@stripe/ui-extension-sdk/ui'
import useAccountState from '../hooks/useAccountState'
import useProductFeatures from '../hooks/useProductFeatures'
import useProductState from '../hooks/useProductState'
import useApi from '../hooks/useApi'
import { useState, useEffect, useCallback } from 'react'
import Stripe from 'stripe'
import stripe from '../stripe'
import BrandIcon from '../views/brand_icon.svg'
import FeaturesForm from '../components/FeaturesForm'
import FeatureList from '../components/FeatureList'
import PriceAccordianItem from '../components/PriceAccordianItem'
import { queryClient } from '../query'
import useStripeContext from '../hooks/useStripeContext'

const ProductView = () => {
  const { post } = useApi()
  const { environment, userContext } = useStripeContext()
  const { data: accountState } = useAccountState(userContext.account.id)

  const productId = environment.objectContext?.id
  const { data: productFeatures } = useProductFeatures(
    productId,
    environment.mode,
  )
  const { data: productState } = useProductState(productId, environment.mode)

  const [prices, setPrices] = useState<Stripe.Price[]>([])
  const [isShowingFeaturesForm, setIsShowingFeaturesForm] = useState(false)

  const fetch = useCallback(async () => {
    return stripe.prices.list({ product: productId }).then((p) => {
      setPrices(p.data)
    })
  }, [productId])

  const saveOverrides = useCallback(
    async (overrides) => {
      await post(`api/stripe/update_product_features`, {
        product_id: productId,
        product_features: overrides,
        mode: environment.mode,
      })
      queryClient.invalidateQueries(['productFeatures', productId])
      queryClient.invalidateQueries(['productState', productId])
    },
    [post, productId, environment.mode],
  )

  useEffect(() => {
    fetch()
  }, [fetch])

  return (
    <ContextView
      title="Product Features"
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
      {accountState && productFeatures && productState ? (
        <Box>
          <FeatureList
            features={accountState}
            overrides={productFeatures}
            saveOverrides={(overrides) => saveOverrides(overrides)}
          />

          <Box css={{ marginTop: 'xxlarge' }}>
            <Box css={{ font: 'heading' }}>Price Features</Box>
          </Box>

          <Accordion>
            {prices.map((p) => (
              <PriceAccordianItem
                key={p.id}
                id={p.id}
                productState={productState}
              ></PriceAccordianItem>
            ))}
          </Accordion>
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

export default ProductView
