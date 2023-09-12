import { Box, Button, Icon, Select } from '@stripe/ui-extension-sdk/ui'
import { stripePriceDisplay } from '../utils'
import { useCallback, useEffect, useState } from 'react'
import {
  NewPricingTableProduct,
  PricingTable,
  PricingTableProduct,
} from '../types'
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
  const [prices, setPrices] = useState<{ [key: string]: Stripe.Price[] }>({})
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [selectedMonthlyPriceId, setSelectedMonthlyPriceId] =
    useState<string>('')
  const [selectedAnnualPriceId, setSelectedAnnualPriceId] = useState<string>('')

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await stripe.products.list({ limit: 100, active: true })
      const _products: Stripe.Product[] = []
      const _prices: { [key: string]: Stripe.Price[] } = {}
      for (const product of result.data) {
        if (pricingTableProducts.find((ptp) => product.id === ptp.product_id)) {
          continue
        }

        if (!annualEnabled && !monthlyEnabled) {
          _products.push(product)
        }

        const _pricesResult = await stripe.prices.list({
          limit: 100,
          active: true,
          product: product.id,
        })

        let monthlyPrice: Stripe.Price | null = null
        let annualPrice: Stripe.Price | null = null
        for (const price of _pricesResult.data) {
          if (
            monthlyEnabled &&
            price.recurring?.interval === 'month' &&
            price.recurring?.interval_count === 1
          ) {
            monthlyPrice = price
          }

          if (
            annualEnabled &&
            price.recurring?.interval === 'year' &&
            price.recurring?.interval_count === 1
          ) {
            annualPrice = price
          }
        }

        if (monthlyEnabled && annualEnabled) {
          if (monthlyPrice && annualPrice) {
            _products.push(product)
            _prices[product.id] = [monthlyPrice, annualPrice]
          }
        } else if (monthlyEnabled) {
          if (monthlyPrice) {
            _products.push(product)
            _prices[product.id] = [monthlyPrice]
          }
        } else if (annualEnabled) {
          if (annualPrice) {
            _products.push(product)
            _prices[product.id] = [annualPrice]
          }
        }
      }
      setProducts(_products)
      setPrices(_prices)
    }
    fetchProducts()
  }, [annualEnabled, monthlyEnabled, pricingTableProducts])

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
      const newProduct: NewPricingTableProduct = {
        name: product.name,
        product_id: product.id,
        monthly_stripe_price: selectedMonthlyPriceId
          ? prices[selectedProductId].find(
              (p) => p.id === selectedMonthlyPriceId,
            )
          : undefined,
        annual_stripe_price: selectedAnnualPriceId
          ? prices[selectedProductId].find(
              (p) => p.id === selectedAnnualPriceId,
            )
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
            {monthlyEnabled &&
              selectedProductId &&
              prices[selectedProductId] && (
                <Select
                  label="Monthly Price"
                  css={{ width: '1/3' }}
                  onChange={(e) => setSelectedMonthlyPriceId(e.target.value)}
                >
                  <option value="">Choose an option</option>
                  {prices[selectedProductId]
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
            {annualEnabled &&
              selectedProductId &&
              prices[selectedProductId] && (
                <Select
                  label="Yearly Price"
                  css={{ width: '1/3' }}
                  onChange={(e) => setSelectedAnnualPriceId(e.target.value)}
                >
                  <option value="">Choose an option</option>
                  {prices[selectedProductId]
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
