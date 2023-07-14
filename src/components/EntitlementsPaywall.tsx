import fetchStripeSignature from '@stripe/ui-extension-sdk/signature'
import { Box, Button, Icon, Inline } from '@stripe/ui-extension-sdk/ui'
import useStripeContext from '../hooks/useStripeContext'
import { useEffect, useState } from 'react'
import { getDashboardUserEmail } from '@stripe/ui-extension-sdk/utils'
import useApi from '../hooks/useApi'

const EntitlementsPaywall = () => {
  const { environment, userContext } = useStripeContext()
  const { post } = useApi()
  const [sig, setSig] = useState('')
  const [email, setEmail] = useState('')
  const host = environment.constants?.API_HOST ?? ''

  useEffect(() => {
    const fetchParams = async () => {
      setSig(await fetchStripeSignature())
      setEmail((await getDashboardUserEmail()).email)
    }

    fetchParams()
  }, [])

  useEffect(() => {
    const track = async () => {
      await post('/stripe/track', {
        event: 'Viewed paywall',
      })
    }
    track()
  }, [])

  return (
    <Box
      css={{
        stack: 'y',
        width: 'fill',
        keyline: 'neutral',
        borderRadius: 'small',
        padding: 'large',
        gapY: 'large',
      }}
    >
      <Box css={{ stack: 'y', gapY: 'small' }}>
        <Box
          css={{ font: 'heading', gapX: 'small', stack: 'x', alignY: 'center' }}
        >
          <Icon name="lock" />
          <Inline>Enable Live Mode</Inline>
        </Box>
        <Box>
          <Inline css={{ font: 'caption' }}>
            Add a payment method to enable entitlements in live mode.
          </Inline>
        </Box>
      </Box>
      <Box css={{ stack: 'x', width: 'fill', gapX: 'small' }}>
        {sig && email ? (
          <Button
            type="primary"
            href={`${host}/stripe/billing_checkout?product=entitlements&user_id=${userContext.id}&account_id=${userContext.account.id}&email=${email}&sig=${sig}`}
          >
            Enable
          </Button>
        ) : (
          <Button type="primary" disabled={true}>
            Enable
          </Button>
        )}
        <Button href="https://spackle.so/" target="_blank">
          View Pricing
          <Icon name="external" />
        </Button>
      </Box>
    </Box>
  )
}

export default EntitlementsPaywall
