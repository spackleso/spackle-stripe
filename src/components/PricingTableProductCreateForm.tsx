import { Box, Button, Icon, Inline, Select } from '@stripe/ui-extension-sdk/ui'
import { stripePriceDisplay } from '../utils'
import { useCallback, useEffect, useState } from 'react'
import { NewPricingTableProduct, PricingTableProduct } from '../types'
import Stripe from 'stripe'
import stripe from '../stripe'

const PricingTableProductCreateForm = ({
  monthlyEnabled,
  annualEnabled,
  pricingTableProducts,
  setPricingTableProducts,
}: {
  monthlyEnabled: boolean
  annualEnabled: boolean
  pricingTableProducts: (PricingTableProduct | NewPricingTableProduct)[]
  setPricingTableProducts: (
    val: (PricingTableProduct | NewPricingTableProduct)[],
  ) => void
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
      const _products = []
      for await (const product of stripe.products.list({ limit: 100 })) {
        _products.push(product)
      }
      setProducts(_products)
    }
    fetchProducts()
  }, [annualEnabled, monthlyEnabled, pricingTableProducts])

  useEffect(() => {
    const fetchPrices = async () => {
      if (!selectedProductId) {
        return
      }

      const _prices = []
      for await (const price of stripe.prices.list({
        limit: 100,
        product: selectedProductId,
        active: true,
      })) {
        _prices.push(price)
      }
      setPrices(_prices)
    }
    fetchPrices()
  }, [selectedProductId])

  const resetForm = useCallback(() => {
    setPrices([])
    setSelectedProductId('')
    setSelectedMonthlyPriceId('')
    setSelectedAnnualPriceId('')
    setShowForm(false)
  }, [])

  const addProduct = useCallback(
    async (selectedProductId: string) => {
      const product = products.find((p) => p.id === selectedProductId)
      if (!product) {
        return
      }
      const newProduct: NewPricingTableProduct = {
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

  const monthlyPrices = prices.filter(
    (p) =>
      p.recurring?.interval === 'month' && p.recurring?.interval_count === 1,
  )

  const annualPrices = prices.filter(
    (p) =>
      p.recurring?.interval === 'year' && p.recurring?.interval_count === 1,
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
                setPrices([])
                setSelectedProductId(e.target.value)
                setSelectedMonthlyPriceId('')
                setSelectedAnnualPriceId('')
              }}
            >
              <option value="">Choose an option</option>
              {products.map((product) => (
                <option value={product.id} key={product.id || Math.random()}>
                  {product.name}{' '}
                </option>
              ))}
            </Select>
            {monthlyEnabled && selectedProductId && prices && (
              <Select
                label="Monthly Price"
                css={{ width: '1/3' }}
                onChange={(e) => setSelectedMonthlyPriceId(e.target.value)}
              >
                <option value="">Choose an option</option>
                {monthlyPrices.map((price) => (
                  <option value={price.id} key={price.id}>
                    {stripePriceDisplay(price)}
                  </option>
                ))}
              </Select>
            )}
            {annualEnabled && selectedProductId && prices && (
              <Select
                label="Yearly Price"
                css={{ width: '1/3' }}
                onChange={(e) => setSelectedAnnualPriceId(e.target.value)}
              >
                <option value="">Choose an option</option>
                {annualPrices.map((price) => (
                  <option value={price.id} key={price.id}>
                    {stripePriceDisplay(price)}
                  </option>
                ))}
              </Select>
            )}
          </Box>
          {selectedProductId &&
            ((monthlyEnabled && !monthlyPrices.length) ||
              (annualEnabled && !annualPrices.length)) && (
              <Box
                css={{
                  color: 'critical',
                  stack: 'x',
                  alignX: 'center',
                  alignY: 'center',
                  gapX: 'small',
                }}
              >
                <Icon name="warning" />{' '}
                <Inline>
                  {monthlyEnabled && !monthlyPrices.length
                    ? 'No monthly prices found for this product'
                    : 'No annual prices found for this product'}
                </Inline>
              </Box>
            )}
          <Box css={{ stack: 'x', gapX: 'small', alignX: 'end' }}>
            <Button
              type="primary"
              disabled={
                !selectedProductId ||
                (monthlyEnabled && !selectedMonthlyPriceId) ||
                (annualEnabled && !selectedAnnualPriceId)
              }
              onPress={() => {
                if (
                  selectedProductId &&
                  (!monthlyEnabled || selectedMonthlyPriceId) &&
                  (!annualEnabled || selectedAnnualPriceId)
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

export default PricingTableProductCreateForm
