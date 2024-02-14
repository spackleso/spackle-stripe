import { Box, Spinner, Inline, Button, Icon } from '@stripe/ui-extension-sdk/ui'
import useAccountState from '../hooks/useAccountState'
import useProductFeatures from '../hooks/useProductFeatures'
import useProductState from '../hooks/useProductState'
import useApi from '../hooks/useApi'
import { useEffect, useState } from 'react'
import { queryClient } from '../query'
import useStripeContext from '../hooks/useStripeContext'
import { NewOverride, Override } from '../types'
import { useMutation } from '@tanstack/react-query'
import { useEntitlements } from '../hooks/useEntitlements'
import EntitlementsPaywall from './EntitlementsPaywall'
import { sortFeatures } from '../utils'
import EntitlementItem from './EntitlementItem'
import EntitlementsForm from './EntitlementsForm'
import stripe from '../stripe'

const ProductEntitlementsView = () => {
  const { post } = useApi()
  const { environment, userContext } = useStripeContext()
  const entitlements = useEntitlements(userContext.account.id)
  const accountState = useAccountState(userContext.account.id)
  const [isShowingForm, setIsShowingForm] = useState(false)
  const [stripeProduct, setStripeProduct] = useState<any>(null)

  const productId = environment.objectContext?.id
  const productFeatures = useProductFeatures(productId, environment.mode)
  const productState = useProductState(productId, environment.mode)

  const saveOverrides = useMutation({
    mutationFn: async (overrides: Override[] | NewOverride[]) => {
      const response = await post(`/stripe/update_product_features`, {
        product_id: productId,
        product_features: overrides,
        mode: environment.mode,
      })
      queryClient.invalidateQueries({
        queryKey: ['productFeatures', productId],
      })
      queryClient.invalidateQueries({ queryKey: ['productState', productId] })
      setIsShowingForm(false)
      return response
    },
  })

  const isLoading =
    accountState.isLoading ||
    entitlements.isLoading ||
    productFeatures.isLoading ||
    productState.isLoading ||
    productState.isRefetching ||
    !stripeProduct

  const entitled =
    entitlements.data?.flag('entitlements') || environment.mode === 'test'

  useEffect(() => {
    const track = async () => {
      await post('/stripe/identify', {
        path: `/products/${productId}`,
      })
      await post('/stripe/track', {
        event: '$pageview',
        properties: {
          $current_url: `https://stripe.spackle.so/products/${productId}`,
        },
      })
    }
    track()
  }, [])

  useEffect(() => {
    const fetchStripeProduct = async () => {
      if (!productId) return
      const response = await stripe.products.retrieve(productId)
      setStripeProduct(response)
    }

    fetchStripeProduct()
  }, [productId])

  if (isLoading) {
    return (
      <Box
        css={{
          stack: 'x',
          alignX: 'center',
          alignY: 'center',
          width: 'fill',
          height: 'fill',
          marginTop: 'xlarge',
        }}
      >
        <Spinner />
      </Box>
    )
  } else if (entitled) {
    return (
      <Box>
        {accountState.data.length ? (
          <Box css={{ stack: 'y', gapY: 'medium' }}>
            <Box
              css={{
                stack: 'x',
                distribute: 'space-between',
                alignY: 'center',
              }}
            >
              <Box css={{ stack: 'y' }}>
                <Box
                  css={{
                    font: 'heading',
                    fontWeight: 'bold',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Entitlements
                </Box>
                <Box css={{ font: 'subheading' }}>
                  {stripeProduct?.name && `for ${stripeProduct.name}`}
                </Box>
              </Box>
              <Button
                type="primary"
                size="small"
                onPress={() => setIsShowingForm(true)}
              >
                <Box
                  css={{
                    width: 'fill',
                    stack: 'x',
                    gapX: 'small',
                    alignY: 'center',
                  }}
                >
                  <Icon name="edit"></Icon>
                  Edit
                </Box>
              </Button>
            </Box>
            <Box css={{ stack: 'y', gapY: 'small' }}>
              {productState.data.sort(sortFeatures).map((f: any) => (
                <EntitlementItem key={f.key} entitlement={f} />
              ))}
            </Box>
          </Box>
        ) : (
          <Box
            css={{
              keyline: 'neutral',
              padding: 'medium',
              font: 'caption',
              borderRadius: 'small',
              margin: 'medium',
              textAlign: 'center',
            }}
          >
            You don&apos;t have any features yet. Create a new feature by
            clicking{' '}
            <Inline css={{ fontWeight: 'bold' }}>
              &quot;Manage Features&quot;
            </Inline>{' '}
            above
            {/* TODO: add a link to documentation/getting started */}
          </Box>
        )}
        <EntitlementsForm
          name={stripeProduct?.name}
          features={accountState}
          overrides={productFeatures}
          saveOverrides={saveOverrides}
          shown={isShowingForm}
          setShown={setIsShowingForm}
        />
      </Box>
    )
  } else {
    return <EntitlementsPaywall />
  }
}

export default ProductEntitlementsView
