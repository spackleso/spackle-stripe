import { AccordionItem } from '@stripe/ui-extension-sdk/ui'
import FeatureList from './FeatureList'
import { useEffect, useState, useCallback } from 'react'
import { Feature, PriceFeature } from '../types'
import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import Stripe from 'stripe'
import useApi from '../hooks/useApi'
import stripe from '../stripe'

const priceDisplay = (price: Stripe.Price): string => {
  if (price.nickname) {
    return price.nickname
  } else if (price.currency !== 'usd') {
    return price.id
  } else if (price.unit_amount && price.recurring) {
    return `$${price.unit_amount / 100} / ${price.recurring.interval}`
  } else if (price.unit_amount) {
    return `$${price.unit_amount / 100}`
  } else {
    return price.id
  }
}

const PriceAccordianItem = ({
  id,
  productState,
  context,
}: {
  id: string
  productState: Feature[]
  context: ExtensionContextValue
}) => {
  const [price, setPrice] = useState<Stripe.Price | null>(null)
  const [priceFeatures, setPriceFeatures] = useState<PriceFeature[]>([])
  const { post } = useApi(context)

  const fetch = useCallback(async () => {
    const data = await (
      await post(`api/stripe/get_price_features`, {
        price_id: id,
      })
    ).json()
    setPriceFeatures(data.data)
  }, [setPriceFeatures, id, post])

  const saveOverrides = useCallback(
    async (overrides) => {
      await post(`api/stripe/update_price_features`, {
        price_id: id,
        price_features: overrides,
      })
      await fetch()
    },
    [post, fetch, id],
  )

  useEffect(() => {
    if (id) {
      stripe.prices.retrieve(id).then((p) => {
        setPrice(p)
      })
    }
  }, [id])

  useEffect(() => {
    fetch()
  }, [fetch])

  return (
    <AccordionItem title={price ? priceDisplay(price) : id}>
      <FeatureList
        features={productState}
        overrides={priceFeatures}
        saveOverrides={(overrides) => saveOverrides(overrides)}
      />
    </AccordionItem>
  )
}

export default PriceAccordianItem
