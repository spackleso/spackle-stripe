import { Box, Button, Divider, Inline, Link } from '@stripe/ui-extension-sdk/ui'
import {
  NewPricingTableProduct,
  PricingTable,
  PricingTableProduct,
} from '../types'
import PricingTableProductCardFeatures from './PricingTableProductCardFeatures'
import { stripePriceDisplay } from '../utils'
import { useState } from 'react'

const PricingTableProductCard = ({
  pricingTable,
  product,
  onDelete,
  onUpdate,
}: {
  pricingTable: PricingTable
  product: PricingTableProduct | NewPricingTableProduct
  onDelete?: () => void
  onUpdate?: () => void
}) => {
  const [showForm, setShowForm] = useState(false)

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
      <Box css={{ stack: 'x', gapX: 'small' }}>
        <Box css={{ fontWeight: 'bold' }}>{product.name}</Box>
        <Box css={{ stack: 'x', alignX: 'end', gapX: 'medium' }}>
          {pricingTable.monthly_enabled && product.monthly_stripe_price && (
            <Inline>{stripePriceDisplay(product.monthly_stripe_price)}</Inline>
          )}
          {pricingTable.annual_enabled && product.annual_stripe_price && (
            <Inline>{stripePriceDisplay(product.annual_stripe_price)}</Inline>
          )}
        </Box>
      </Box>
      <Divider />
      <PricingTableProductCardFeatures product={product} />
      {(onDelete || onUpdate) && (
        <Box css={{ stack: 'x', gapX: 'small', alignX: 'end' }}>
          {onUpdate && (
            <Link type="primary" onPress={() => setShowForm(true)}>
              Edit
            </Link>
          )}
          {onDelete && (
            <Link type="secondary" onPress={() => onDelete()}>
              Delete
            </Link>
          )}
        </Box>
      )}
    </Box>
  )
}

export default PricingTableProductCard
