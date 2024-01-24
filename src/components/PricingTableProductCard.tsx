import { Box, Divider, Link, Select } from '@stripe/ui-extension-sdk/ui'
import {
  NewPricingTableProduct,
  PricingTable,
  PricingTableProduct,
} from '../types'
import PricingTableProductCardFeatures from './PricingTableProductCardFeatures'
import { stripePriceDisplay } from '../utils'
import { useEffect, useState } from 'react'
import Stripe from 'stripe'
import stripe from '../stripe'

const PricingTableProductCard = ({
  pricingTable,
  product,
  onDelete,
  onUpdate,
}: {
  pricingTable: PricingTable
  product: PricingTableProduct | NewPricingTableProduct
  onDelete?: () => void
  onUpdate?: (ptp: PricingTableProduct | NewPricingTableProduct) => void
}) => {
  const [prices, setPrices] = useState<Stripe.Price[]>([])

  useEffect(() => {
    const fetchPrices = async () => {
      if (!onUpdate) {
        setPrices([])
        return
      }

      const result = await stripe.prices.list({
        limit: 100,
        active: true,
        product: product.product_id,
      })
      setPrices(result.data)
    }

    fetchPrices()
  }, [onUpdate, product.product_id])

  return (
    <Box
      key={
        Object.hasOwn(product, 'id')
          ? (product as PricingTableProduct).id
          : Math.random()
      }
      css={{
        stack: 'y',
        distribute: 'space-between',
        padding: 'large',
        marginY: 'small',
        alignY: 'center',
        gapY: 'small',
        background: 'container',
        borderRadius: 'medium',
      }}
    >
      <Box
        css={{
          stack: onUpdate ? 'x' : 'y',
          gapX: 'small',
          alignY: 'center',
        }}
      >
        <Box css={{ fontWeight: 'bold' }}>{product.name}</Box>
        {onUpdate ? (
          <Box css={{ stack: 'x', alignX: 'end', gapX: 'medium' }}>
            {pricingTable.monthly_enabled && (
              <Select
                defaultValue={product.monthly_stripe_price?.id}
                onChange={(e) =>
                  onUpdate({
                    ...product,
                    monthly_stripe_price: prices.find(
                      (p) => p.id === e.target.value,
                    ),
                  })
                }
              >
                <option value="">Choose an option</option>
                {prices
                  .filter(
                    (p) =>
                      p.recurring?.interval === 'month' &&
                      p.recurring?.interval_count === 1,
                  )
                  .map((price) => (
                    <option value={price.id} key={price.id}>
                      {stripePriceDisplay(price)}
                    </option>
                  ))}
              </Select>
            )}
            {pricingTable.annual_enabled && (
              <Select
                defaultValue={product.annual_stripe_price?.id}
                onChange={(e) =>
                  onUpdate({
                    ...product,
                    annual_stripe_price: prices.find(
                      (p) => p.id === e.target.value,
                    ),
                  })
                }
              >
                <option value="">Choose an option</option>
                {prices
                  .filter(
                    (p) =>
                      p.recurring?.interval === 'year' &&
                      p.recurring?.interval_count === 1,
                  )
                  .map((price) => (
                    <option value={price.id} key={price.id}>
                      {stripePriceDisplay(price)}
                    </option>
                  ))}
              </Select>
            )}
          </Box>
        ) : (
          <Box css={{ stack: 'x', gapX: 'small', alignX: 'start' }}>
            {pricingTable.monthly_enabled && product.monthly_stripe_price && (
              <Box>{stripePriceDisplay(product.monthly_stripe_price)}</Box>
            )}
            {pricingTable.annual_enabled && product.annual_stripe_price && (
              <Box>{stripePriceDisplay(product.annual_stripe_price)}</Box>
            )}
          </Box>
        )}
      </Box>
      <Divider />
      <PricingTableProductCardFeatures product={product} />
      {onDelete && (
        <Box css={{ stack: 'x', gapX: 'small', alignX: 'end' }}>
          <Link type="secondary" onPress={() => onDelete()}>
            Delete
          </Link>
        </Box>
      )}
    </Box>
  )
}

export default PricingTableProductCard
