import {
  Box,
  Button,
  Icon,
  Inline,
  Link,
  Spinner,
  TextField,
} from '@stripe/ui-extension-sdk/ui'
import {
  clipboardWriteText,
  fetchStripeSignature,
  getDashboardUserEmail,
  showToast,
} from '@stripe/ui-extension-sdk/utils'
import useStripeContext from '../hooks/useStripeContext'
import useToken from '../hooks/useToken'
import { SettingsView as StripeSettingsView } from '@stripe/ui-extension-sdk/ui'
import { Entitlements, useEntitlements } from '../hooks/useEntitlements'
import { useState, useEffect } from 'react'

const ConfigurationSettings = () => {
  const { userContext } = useStripeContext()
  const { data } = useToken(userContext?.account.id)
  return (
    <Box css={{ stack: 'y', gapY: 'small', maxWidth: '1/2' }}>
      <Box css={{ stack: 'x', distribute: 'space-between' }}>
        <Box css={{ font: 'subtitle' }}>Configuration</Box>
        <Link
          href="https://docs.spackle.so"
          type="primary"
          target="_blank"
          external
        >
          Documentation
        </Link>
      </Box>
      <Box
        css={{
          stack: 'x',
          alignY: 'bottom',
          gapX: 'small',
          width: 'fit',
          minWidth: '1/3',
          marginTop: 'small',
        }}
      >
        <TextField
          disabled
          value={data?.token || ''}
          label="Access Token"
          description="Your access token is used when adding one of Spackle's SDKs to your project"
        />
        <Button
          onPress={async () => {
            await clipboardWriteText(data.token)
            showToast('Copied!', { type: 'success' })
          }}
        >
          <Icon name="clipboard" />
        </Button>
      </Box>
    </Box>
  )
}

const CurrentPlan = ({ entitlements }: { entitlements: Entitlements }) => {
  const { environment, userContext } = useStripeContext()
  const item = entitlements.subscriptions[0].items.data[0]
  const price = item.price as any
  const host = environment.constants?.API_HOST ?? ''
  const [sig, setSig] = useState('')

  useEffect(() => {
    const fetchParams = async () => {
      setSig(await fetchStripeSignature())
    }

    fetchParams()
  }, [])

  return (
    <Box css={{ stack: 'y', gapY: 'small' }}>
      <Box>
        <Inline css={{ font: 'bodyEmphasized' }}>Current Plan:</Inline>{' '}
        <Inline>
          ${price.unit_amount / 100} / {price.product.unit_label}
        </Inline>
      </Box>
      <Box>
        <Inline css={{ font: 'bodyEmphasized' }}>Current MTR:</Inline>{' '}
        <Inline>$0</Inline>
      </Box>
      <Button
        type="primary"
        href={`${host}/stripe/billing_portal?user_id=${userContext.id}&account_id=${userContext.account.id}&sig=${sig}`}
        disabled={!sig}
      >
        Manage
      </Button>
    </Box>
  )
}

const NewPlan = () => {
  const { environment, userContext } = useStripeContext()
  const host = environment.constants?.API_HOST ?? ''
  const [email, setEmail] = useState('')
  const [sig, setSig] = useState('')

  useEffect(() => {
    const fetchParams = async () => {
      setSig(await fetchStripeSignature())
      setEmail((await getDashboardUserEmail()).email)
    }

    fetchParams()
  }, [])

  return (
    <Box css={{ stack: 'y', gapY: 'small' }}>
      <Box>
        <Inline css={{ font: 'bodyEmphasized' }}>Current Plan:</Inline>{' '}
        <Inline>Free - Test mode only</Inline>
      </Box>
      <Box>
        <Inline css={{ font: 'bodyEmphasized' }}>Current MTR:</Inline>{' '}
        <Inline>$0</Inline>
      </Box>
      <Box css={{ stack: 'y', gapY: 'small' }}>
        <Box css={{ stack: 'y' }}>
          <Inline css={{ font: 'bodyEmphasized' }}>Add Payment Method</Inline>
          <Inline css={{ font: 'caption' }}>
            Add a payment method to enable Spackle in live mode. Your first
            $1,000 MTR is always free.
          </Inline>
        </Box>
        <Box css={{ stack: 'x', alignY: 'center', gapX: 'small' }}>
          <Button
            type="primary"
            href={`${host}/stripe/billing_checkout?product=entitlements&user_id=${userContext.id}&account_id=${userContext.account.id}&email=${email}&sig=${sig}`}
            disabled={!sig || !email}
          >
            Add Payment Method
          </Button>
          <Link external href="https://spackle.so">
            View Pricing
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

const BillingSettings = () => {
  const { userContext } = useStripeContext()
  const entitlements = useEntitlements(userContext?.account.id)

  return (
    <Box css={{ stack: 'y', gapY: 'small', maxWidth: '1/2' }}>
      <Box css={{ font: 'subtitle' }}>Billing</Box>
      <Box
        css={{
          stack: 'x',
          alignY: 'bottom',
          gapX: 'small',
          width: 'fit',
          minWidth: '1/3',
          marginTop: 'small',
        }}
      >
        {entitlements.isLoading ? (
          <Spinner />
        ) : entitlements.data?.entitlements.subscriptions.length ? (
          <CurrentPlan
            entitlements={entitlements.data.entitlements as Entitlements}
          />
        ) : (
          <NewPlan />
        )}
      </Box>
    </Box>
  )
}

const SettingsView = () => {
  return (
    <StripeSettingsView>
      <Box css={{ stack: 'y', gapY: 'xxlarge' }}>
        <ConfigurationSettings />
        <BillingSettings />
      </Box>
    </StripeSettingsView>
  )
}

export default SettingsView
