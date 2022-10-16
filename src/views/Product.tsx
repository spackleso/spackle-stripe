import {
  ContextView,
  Box,
  Link,
  Icon,
  Accordion,
} from '@stripe/ui-extension-sdk/ui'
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { useEffect, useState, useCallback } from 'react'
import BrandIcon from './brand_icon.svg'
import useApi from '../hooks/useApi'
import { Feature, ProductFeature } from '../types'
import Stripe from 'stripe'
import FeaturesForm from '../components/FeaturesForm'
import FeatureList from '../components/FeatureList'
import PriceAccordianItem from '../components/PriceAccordianItem'
import stripe from '../stripe'

interface State {
  prices: Stripe.Price[]
  accountState: Feature[]
  productFeatures: ProductFeature[]
  productState: Feature[]
}

const Product = (context: ExtensionContextValue) => {
  const productId = context.environment.objectContext?.id
  const { post } = useApi(context)
  const [prices, setPrices] = useState<Stripe.Price[]>([])
  const [accountState, setAccountState] = useState<Feature[]>([])
  const [productFeatures, setProductFeatures] = useState<ProductFeature[]>([])
  const [productState, setProductState] = useState<Feature[]>([])
  const [isShowingFeaturesForm, setIsShowingFeaturesForm] = useState(false)

  const fetch = useCallback(async () => {
    let data = await (await post(`api/stripe/get_account_state`, {})).json()
    setAccountState(data.data)

    data = await (
      await post(`api/stripe/get_product_features`, {
        product_id: productId,
      })
    ).json()
    setProductFeatures(data.data)

    data = await (
      await post(`api/stripe/get_product_state`, {
        product_id: productId,
      })
    ).json()
    setProductState(data.data)

    if (productId) {
      stripe.prices.list({ product: productId }).then((p) => {
        setPrices(p.data)
      })
    }
  }, [post, productId])

  const saveOverrides = useCallback(
    async (overrides) => {
      await post(`api/stripe/update_product_features`, {
        product_id: productId,
        product_features: overrides,
      })
      await fetch()
    },
    [post, fetch, productId],
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
            context={context}
            productState={productState}
          ></PriceAccordianItem>
        ))}
      </Accordion>
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

export default Product
