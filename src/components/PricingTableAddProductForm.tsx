import { Box, Button, Icon, Select } from '@stripe/ui-extension-sdk/ui'
import { stripePriceDisplay } from '../utils'
import { useCallback, useEffect, useState } from 'react'
import { PricingTable, PricingTableProduct } from '../types'
import Stripe from 'stripe'
import stripe from '../stripe'

const PricingTableAddProductForm = ({
  pricingTable,
  pricingTableProducts,
  setPricingTableProducts,
}: {
  pricingTable: PricingTable
  pricingTableProducts: PricingTableProduct[]
  setPricingTableProducts: (val: PricingTableProduct[]) => void
}) => {
  const [showForm, setShowForm] = useState(false)
  const [products, setProducts] = useState<Stripe.Product[]>([])
  const [prices, setPrices] = useState<Stripe.Price[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [selectedMonthlyPriceId, setSelectedMonthlyPriceId] =
    useState<string>('')
  const [selectedAnnualPriceId, setSelectedAnnualPriceId] = useState<string>('')

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await stripe.products.list({ limit: 100, active: true })
      setProducts(result.data)
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchPrices = async () => {
      if (!selectedProductId) {
        setPrices([])
        return
      }

      const result = await stripe.prices.list({
        limit: 100,
        active: true,
        product: selectedProductId,
      })
      setPrices(result.data)
    }

    fetchPrices()
  }, [selectedProductId])

  const resetForm = useCallback(() => {
    setSelectedProductId('')
    setSelectedMonthlyPriceId('')
    setSelectedAnnualPriceId('')
    setShowForm(false)
  }, [])

  const addProduct = useCallback(
    async (selectedProductId) => {
      const product = products.find((p) => p.id === selectedProductId)
      if (!product) {
        return
      }
      const newProduct: PricingTableProduct = {
        id: pricingTableProducts.length * -1,
        name: product.name,
        product_id: product.id,
        monthly_stripe_price: selectedMonthlyPriceId
          ? prices.find((p) => p.id === selectedMonthlyPriceId)
          : undefined,
        annual_stripe_price: selectedAnnualPriceId
          ? prices.find((p) => p.id === selectedAnnualPriceId)
          : undefined,
      }
      setPricingTableProducts([...pricingTableProducts, newProduct])
      resetForm()
    },
    [
      products,
      pricingTableProducts,
      selectedMonthlyPriceId,
      prices,
      selectedAnnualPriceId,
      setPricingTableProducts,
      resetForm,
    ],
  )

  return (
    <Box css={{ stack: 'x', alignX: 'center' }}>
      {showForm ? (
        <Box
          css={{
            stack: 'y',
            gapY: 'medium',
            width: 'fill',
            backgroundColor: 'container',
            padding: 'large',
            borderRadius: 'medium',
          }}
        >
          <Box css={{ stack: 'x', gapX: 'large' }}>
            <Select
              label="Product"
              css={{ width: '1/3' }}
              onChange={(e) => {
                setSelectedProductId(e.target.value)
              }}
            >
              <option value="">Choose an option</option>
              {products
                .filter(
                  (p) =>
                    !pricingTableProducts.find(
                      (ptp) => p.id === ptp.product_id,
                    ),
                )
                .map((product) => (
                  <option value={product.id} key={product.id}>
                    {product.name}{' '}
                  </option>
                ))}
            </Select>
            {pricingTable.monthly_enabled && selectedProductId && (
              <Select
                label="Monthly Price"
                css={{ width: '1/3' }}
                onChange={(e) => setSelectedMonthlyPriceId(e.target.value)}
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
            {pricingTable.annual_enabled && selectedProductId && (
              <Select
                label="Yearly Price"
                css={{ width: '1/3' }}
                onChange={(e) => setSelectedAnnualPriceId(e.target.value)}
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
          <Box css={{ stack: 'x', gapX: 'small', alignX: 'end' }}>
            <Button
              type="primary"
              onPress={() => {
                if (
                  selectedProductId &&
                  (!pricingTable.monthly_enabled || selectedMonthlyPriceId) &&
                  (!pricingTable.annual_enabled || selectedAnnualPriceId)
                ) {
                  addProduct(selectedProductId)
                }
              }}
            >
              Add
            </Button>
            <Button type="secondary" onPress={() => resetForm()}>
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Button type="secondary" onPress={() => setShowForm(true)}>
          <Icon name="add" />
          Add a Product
        </Button>
      )}
    </Box>
  )
}

export default PricingTableAddProductForm
