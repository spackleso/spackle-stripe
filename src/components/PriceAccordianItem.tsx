import { AccordionItem, Box, Spinner } from '@stripe/ui-extension-sdk/ui'
import FeatureList from './FeatureList'
import { useEffect, useState, useCallback } from 'react'
import { Feature, PriceFeature } from '../types'
import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import Stripe from 'stripe'
import useApi from '../hooks/useApi'
import stripe from '../stripe'
import usePriceFeatures from '../hooks/usePriceFeatures'
import { queryClient } from '../query'

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
  const { post } = useApi(context)
  const [price, setPrice] = useState<Stripe.Price | null>(null)
  const { data: priceFeatures } = usePriceFeatures(context, id)

  const saveOverrides = useCallback(
    async (overrides) => {
      await post(`api/stripe/update_price_features`, {
        price_id: id,
        price_features: overrides,
        mode: context.environment.mode,
      })
      queryClient.invalidateQueries(['priceFeatures', id])
    },
    [post, id, context.environment.mode],
  )

  useEffect(() => {
    if (id) {
      stripe.prices.retrieve(id).then((p) => {
        setPrice(p)
      })
    }
  }, [id])

  return (
    <AccordionItem title={price ? priceDisplay(price) : id}>
      {priceFeatures ? (
        <FeatureList
          features={productState}
          overrides={priceFeatures as any}
          saveOverrides={(overrides) => saveOverrides(overrides)}
        />
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
    </AccordionItem>
  )
}

export default PriceAccordianItem
