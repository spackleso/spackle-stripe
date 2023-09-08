import fetchStripeSignature from '@stripe/ui-extension-sdk/signature'
import { Box, Button, Icon, Inline } from '@stripe/ui-extension-sdk/ui'
import useStripeContext from '../hooks/useStripeContext'
import { useEffect, useState } from 'react'
import { getDashboardUserEmail } from '@stripe/ui-extension-sdk/utils'
import useApi from '../hooks/useApi'

const PricingTablesPaywall = () => {
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
        marginY: 'large',
        gapY: 'large',
      }}
    >
      <Box css={{ stack: 'y', gapY: 'small' }}>
        <Box
          css={{ font: 'heading', gapX: 'small', stack: 'x', alignY: 'center' }}
        >
          <Icon name="lock" />
          <Box>Upgrade to continue</Box>
        </Box>
        <Box>
          <Box css={{ font: 'caption' }}>
            Spackle Pro is free to get started. Add a payment method to enable
            pricing tables in live mode.
          </Box>
        </Box>
      </Box>
      <Box css={{ stack: 'x', width: 'fill', gapX: 'small' }}>
        {sig && email ? (
          <Button
            type="primary"
            href={`${host}/stripe/checkout_redirect?user_id=${userContext.id}&account_id=${userContext.account.id}&email=${email}&sig=${sig}`}
          >
            Enable
            <Icon name="external" />
          </Button>
        ) : (
          <Button type="primary" disabled={true}>
            Enable
            <Icon name="external" />
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

export default PricingTablesPaywall
