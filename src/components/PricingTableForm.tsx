import {
  Box,
  Button,
  FocusView,
  FormFieldGroup,
  Icon,
  Select,
  Switch,
} from '@stripe/ui-extension-sdk/ui'
import { PricingTable, PricingTableProduct } from '../types'
import { useCallback, useEffect, useState } from 'react'
import Stripe from 'stripe'
import stripe from '../stripe'
import PricingTablesProductList from './PricingTablesProductList'
import { stripePriceDisplay } from '../utils'

const confirmCloseMessages = {
  title: 'Your pricing table will not be saved',
  description: 'Are you sure you want to exit?',
  cancelAction: 'Cancel',
  exitAction: 'Exit',
}

const PricingTableForm = ({
  pricingTable,
  pricingTableProducts,
  shown,
  setShown,
}: {
  pricingTable: PricingTable
  pricingTableProducts: PricingTableProduct[]
  shown: boolean
  setShown: (val: boolean) => void
}) => {
  const [updatedPricingTable, setUpdatedPricingTable] =
    useState<PricingTable>(pricingTable)
  const [updatedPricingTableProducts, setUpdatedPricingTableProducts] =
    useState<PricingTableProduct[]>(pricingTableProducts)
  const [confirmClose, setConfirmClose] = useState<boolean>(true)

  const resetForm = useCallback(() => {
    setUpdatedPricingTable(pricingTable)
    setUpdatedPricingTableProducts(pricingTableProducts)
  }, [pricingTable, pricingTableProducts])

  const closeWithConfirm = useCallback(() => {
    setShown(false)
  }, [setShown])

  const closeWithoutConfirm = useCallback(() => {
    setConfirmClose(false)
    setShown(false)
    resetForm()
  }, [setShown, setConfirmClose, resetForm])

  const isModified = !(
    updatedPricingTable.monthly_enabled === pricingTable.monthly_enabled &&
    updatedPricingTable.annual_enabled === pricingTable.annual_enabled &&
    updatedPricingTableProducts.length === pricingTableProducts.length &&
    updatedPricingTableProducts.every((p) => {
      const pricingTableProduct = pricingTableProducts.find(
        (ptp) => ptp.id === p.id,
      )
      return (
        pricingTableProduct &&
        p.annual_stripe_price?.id ===
          pricingTableProduct.annual_stripe_price?.id &&
        p.monthly_stripe_price?.id ===
          pricingTableProduct.monthly_stripe_price?.id
      )
    })
  )

  return (
    <FocusView
      confirmCloseMessages={
        confirmClose && isModified ? confirmCloseMessages : undefined
      }
      shown={shown}
      setShown={(val) => {
        if (!val) {
          resetForm()
        }
        setShown(val)
      }}
      title={'Pricing Table'}
      primaryAction={
        <Button
          type="primary"
          onPress={closeWithoutConfirm}
          disabled={!isModified}
        >
          Save
        </Button>
      }
      secondaryAction={<Button onPress={closeWithConfirm}>Cancel</Button>}
    >
      <Box css={{ stack: 'y', gapY: 'large' }}>
        <Box>
          <Box css={{ font: 'heading', marginBottom: 'medium' }}>Settings</Box>
          <FormFieldGroup
            legend="Intervals"
            description="Choose the billing intervals customers can select from your pricing table. Only monthly and annual intervals are supported at this time."
            layout="column"
          >
            <Switch
              label="Monthly"
              defaultChecked={updatedPricingTable.monthly_enabled}
              onChange={(e) => {
                setUpdatedPricingTable({
                  ...updatedPricingTable,
                  monthly_enabled: e.target.checked,
                })
              }}
            />
            <Switch
              label="Annual"
              defaultChecked={updatedPricingTable.annual_enabled}
              onChange={(e) => {
                setUpdatedPricingTable({
                  ...updatedPricingTable,
                  annual_enabled: e.target.checked,
                })
              }}
            />
          </FormFieldGroup>
        </Box>

        <Box>
          <Box css={{ font: 'heading' }}>Products</Box>
          <Box
            css={{
              font: 'caption',
              color: 'secondary',
              marginBottom: 'medium',
            }}
          >
            These are the products that will be displayed in your pricing table
            with their associated features.
          </Box>
          <PricingTablesProductList
            pricingTable={updatedPricingTable}
            pricingTableProducts={updatedPricingTableProducts}
          />
          <AddProductForm
            pricingTable={updatedPricingTable}
            pricingTableProducts={updatedPricingTableProducts}
            setPricingTableProducts={setUpdatedPricingTableProducts}
          />
        </Box>
      </Box>
    </FocusView>
  )
}

const AddProductForm = ({
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

export default PricingTableForm
