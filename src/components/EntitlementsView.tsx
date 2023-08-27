import { Box, Divider, Icon, Link, List } from '@stripe/ui-extension-sdk/ui'
import { useEffect, useState } from 'react'
import Stripe from 'stripe'
import stripe from '../stripe'
import useStripeContext from '../hooks/useStripeContext'

const EntitlementsView = () => {
  const { environment } = useStripeContext()
  const [customers, setCustomers] = useState<Stripe.Customer[]>([])
  const [products, setProducts] = useState<Stripe.Product[]>([])

  const customerBase =
    environment.mode === 'test' ? '/test/customers' : '/customers'
  const productBase =
    environment.mode === 'test' ? '/test/products' : '/products'

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await stripe.customers.list({ limit: 5 })
      setCustomers(response.data)
    }

    const fetchProducts = async () => {
      const response = await stripe.products.list({ limit: 5, active: true })
      setProducts(response.data)
    }

    fetchCustomers()
    fetchProducts()
  }, [])

  return (
    <Box
      css={{
        stack: 'y',
        gapY: 'large',
        marginTop: 'large',
      }}
    >
      <Box
        css={{
          background: 'container',
          padding: 'large',
          borderRadius: 'large',
          stack: 'x',
          gapX: 'medium',
          alignY: 'center',
        }}
      >
        <Box>
          <Icon name="info" size="xsmall" css={{ fill: 'info' }} />
        </Box>
        <Box>
          Visit a <Link href={customerBase}>customer</Link> or a{' '}
          <Link href={productBase}>product</Link> to manage entitlements for
          your users.
        </Box>
      </Box>

      <Box css={{ stack: 'y', gapY: 'small' }}>
        <Box css={{ font: 'heading' }}>Customers</Box>
        <Box css={{ stack: 'y', gapY: 'small' }}>
          {customers.map((customer) => (
            <Box key={customer.id}>
              <Box css={{ padding: 'small' }}>
                <Link href={`${customerBase}/${customer.id}`}>
                  <Box css={{ stack: 'x', alignY: 'center', gapX: 'small' }}>
                    <Box>{customer.email}</Box>
                    <Icon name="arrowRight" size="xsmall" />
                  </Box>
                </Link>
              </Box>
              <Divider />
            </Box>
          ))}
        </Box>
        <Box css={{ stack: 'x', alignX: 'center' }}>
          <Link href={customerBase}>
            <Box css={{ stack: 'x', alignY: 'center', gapX: 'small' }}>
              See all <Icon name="arrowRight" size="xsmall" />
            </Box>
          </Link>
        </Box>
      </Box>

      <Box css={{ stack: 'y', gapY: 'small' }}>
        <Box css={{ font: 'heading' }}>Products</Box>
        <List onAction={(e) => console.log(e)}>
          {products.map((product) => (
            <Box key={product.id}>
              <Box css={{ padding: 'small' }}>
                <Link href={`${productBase}/${product.id}`}>
                  <Box css={{ stack: 'x', alignY: 'center', gapX: 'small' }}>
                    <Box>{product.name}</Box>
                    <Icon name="arrowRight" size="xsmall" />
                  </Box>
                </Link>
              </Box>
              <Divider />
            </Box>
          ))}
        </List>
        <Box css={{ stack: 'x', alignX: 'center' }}>
          <Link href={productBase}>
            <Box css={{ stack: 'x', alignY: 'center', gapX: 'small' }}>
              See all <Icon name="arrowRight" size="xsmall" />
            </Box>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default EntitlementsView
