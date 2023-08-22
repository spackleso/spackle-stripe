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

  const closeWithConfirm = useCallback(() => {
    setShown(false)
  }, [setShown])

  const closeWithoutConfirm = useCallback(() => {
    setConfirmClose(false)
    setShown(false)
  }, [setShown, setConfirmClose])

  return (
    <FocusView
      confirmCloseMessages={confirmClose ? confirmCloseMessages : undefined}
      shown={shown}
      setShown={setShown}
      title={'Pricing Table'}
      primaryAction={
        <Button type="primary" onPress={closeWithoutConfirm}>
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
              onChange={(e) => {
                setUpdatedPricingTable({
                  ...updatedPricingTable,
                  monthly_enabled: e.target.checked,
                })
              }}
            />
            <Switch
              label="Annual"
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
          {updatedPricingTableProducts?.map((product) => (
            <Box key={product.id}>{product.name}</Box>
          ))}
          <AddProductForm
            pricingTableProducts={updatedPricingTableProducts}
            setPricingTableProducts={setUpdatedPricingTableProducts}
          />
        </Box>
      </Box>
    </FocusView>
  )
}

const AddProductForm = ({
  pricingTableProducts,
  setPricingTableProducts,
}: {
  pricingTableProducts: PricingTableProduct[]
  setPricingTableProducts: (val: PricingTableProduct[]) => void
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [products, setProducts] = useState<Stripe.Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await stripe.products.list({ limit: 100, active: true })
      setProducts(result.data)
    }
    fetchProducts()
  }, [])

  const addProduct = useCallback(async () => {
    const product = products.find((p) => p.id === selectedProductId)
    if (!product) {
      return
    }
    const result = await stripe.prices.list({
      limit: 100,
      active: true,
      product: product.id,
    })
    const price = result.data.find((p) => p.active && p.type === 'recurring')
    if (!price) {
      return
    }
    const newProduct: PricingTableProduct = {
      id: pricingTableProducts.length * -1,
      name: product.name,
      monthly_stripe_price: price,
      annual_stripe_price: price,
      features: [],
    }
    setPricingTableProducts([...pricingTableProducts, newProduct])
    setShowForm(false)
    setSelectedProductId('')
  }, [
    products,
    selectedProductId,
    pricingTableProducts,
    setPricingTableProducts,
  ])

  return (
    <Box css={{ stack: 'x', alignX: 'center' }}>
      {showForm ? (
        <Box css={{ stack: 'x', gapX: 'large' }}>
          <Select onChange={(e) => setSelectedProductId(e.target.value)}>
            <option value="">Choose an option</option>
            {products.map((product) => (
              <option value={product.id} key={product.id}>
                {product.name}{' '}
              </option>
            ))}
          </Select>
          <Box css={{ stack: 'x', gapX: 'small', alignX: 'end' }}>
            <Button
              type="secondary"
              onPress={() => {
                setSelectedProductId('')
                setShowForm(false)
              }}
            >
              Cancel
            </Button>
            <Button type="primary" onPress={addProduct}>
              Add
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
