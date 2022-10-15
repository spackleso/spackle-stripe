import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client'
import {
  ContextView,
  List,
  ListItem,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  TableHead,
  TableHeaderCell,
  Box,
  Button,
  TextField,
} from '@stripe/ui-extension-sdk/ui'
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { useEffect, useState } from 'react'
import BrandIcon from './brand_icon.svg'
import useApi from '../hooks/useApi'
import { Feature, FeatureType } from '../types'
import Stripe from 'stripe'

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2022-08-01',
})

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

const Product = (context: ExtensionContextValue) => {
  const productId = context.environment.objectContext?.id
  const [prices, setPrices] = useState<Stripe.Price[]>([])
  const [priceId, setPriceId] = useState<string | null>(null)

  useEffect(() => {
    if (productId) {
      stripe.prices.list({ product: productId }).then((p) => {
        setPrices(p.data)
      })
    }
  }, [productId])

  if (priceId) {
    return <Price id={priceId} context={context} />
  }

  return (
    <ContextView
      title="Select Price to Edit Features"
      brandColor="#F6F8FA"
      brandIcon={BrandIcon}
    >
      <List
        onAction={(id: string | number) => setPriceId(id.toString())}
        aria-label="Select Price to Edit Features"
      >
        {prices.map((p) => (
          <ListItem
            id={p.id}
            title={<Box>{priceDisplay(p)}</Box>}
            secondaryTitle={p.id}
          />
        ))}
      </List>
    </ContextView>
  )
}

const Price = ({
  id,
  context,
}: {
  id: string
  context: ExtensionContextValue
}) => {
  const [price, setPrice] = useState<Stripe.Price | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const { post } = useApi(context)

  useEffect(() => {
    if (id) {
      stripe.prices.retrieve(id).then((p) => {
        setPrice(p)
      })
    }
  }, [id])

  useEffect(() => {
    post(`api/stripe/get_product_features`, {
      price_id: id,
    }).then((res) => res.json().then((data) => setFeatures(data.data)))
  }, [post, id])

  return (
    <ContextView
      title={price ? priceDisplay(price) : id}
      brandColor="#F6F8FA"
      brandIcon={BrandIcon}
      primaryAction={
        <>
          <Button type="primary">Save</Button>
        </>
      }
      secondaryAction={
        <>
          <Button>Cancel</Button>
        </>
      }
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Value</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {features.map((f) => (
            <TableRow key={f.id}>
              <TableCell>
                <Box>{f.name}</Box>
              </TableCell>
              <TableCell>
                <Box css={{ alignX: 'end' }}>
                  {f.type === FeatureType.Flag ? (
                    <Switch value={f.value_flag!.toString()}></Switch>
                  ) : f.type === FeatureType.Limit ? (
                    <TextField value={f.value_limit!.toString()}></TextField>
                  ) : (
                    <></>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ContextView>
  )
}

export default Product
