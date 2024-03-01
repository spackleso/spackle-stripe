import {
  Box,
  Button,
  Icon,
  Inline,
  Link,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeaderCell,
  TableRow,
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
import useApi from '../hooks/useApi'
import usePublishableToken from '../hooks/usePublishableToken'

const ConfigurationSettings = () => {
  const { userContext } = useStripeContext()
  const { data: secretToken } = useToken(userContext?.account.id)
  const { data: publishableToken } = usePublishableToken(
    userContext?.account.id,
  )
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
          minWidth: '1/2',
          maxWidth: '1/2',
          marginTop: 'small',
        }}
      >
        <TextField
          disabled
          value={secretToken?.token || ''}
          label="Secret Key"
          description="Your secret key is used when adding one of Spackle's SDKs to your project. Keep this secret!"
        />
        <Button
          onPress={async () => {
            await clipboardWriteText(secretToken.token)
            showToast('Copied!', { type: 'success' })
          }}
        >
          <Icon name="clipboard" />
        </Button>
      </Box>
      <Box
        css={{
          stack: 'x',
          alignY: 'bottom',
          gapX: 'small',
          width: 'fit',
          minWidth: '1/2',
          maxWidth: '1/2',
          marginTop: 'small',
        }}
      >
        <TextField
          disabled
          value={publishableToken?.token || ''}
          label="Publishable Key"
          description="Your publishable key can be used to fetch pricing tables for embedding in your website."
        />
        <Button
          onPress={async () => {
            await clipboardWriteText(publishableToken.token)
            showToast('Copied!', { type: 'success' })
          }}
        >
          <Icon name="clipboard" />
        </Button>
      </Box>
    </Box>
  )
}

interface MTR {
  freeTierDollars: number
  grossUsageDollars: number
  netUsageDollars: number
  mtr: number
}

const CurrentPlan = ({ entitlements }: { entitlements: Entitlements }) => {
  const { environment, userContext } = useStripeContext()
  const [mtr, setMtr] = useState<MTR | null>(null)
  const host = environment.constants?.API_HOST ?? ''
  const { post } = useApi()
  const item = entitlements.subscriptions[0].items.data[0]
  const price = item.price as any
  const [sig, setSig] = useState('')

  useEffect(() => {
    const fetchParams = async () => {
      setSig(await fetchStripeSignature())
    }

    fetchParams()
  }, [])

  useEffect(() => {
    const fetchMtr = async () => {
      const response = await post('/stripe/get_mtr', {})
      const { mtr } = await response.json()
      setMtr(mtr)
    }

    fetchMtr()
  }, [post])

  return (
    <Box css={{ stack: 'y', gapY: 'small' }}>
      <Box>
        <Inline css={{ font: 'bodyEmphasized' }}>Current Plan:</Inline>{' '}
        <Inline>
          ${price.unit_amount / 100} per {price.product.unit_label} (first
          $1,000 free)
        </Inline>
      </Box>
      <Box>
        <Inline css={{ font: 'bodyEmphasized' }}>Current MTR:</Inline>{' '}
        <Inline>${mtr ? mtr.grossUsageDollars : 0}</Inline>
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
  const { post } = useApi()
  const [email, setEmail] = useState('')
  const [sig, setSig] = useState('')
  const [mtr, setMtr] = useState<number | null>(null)

  useEffect(() => {
    const fetchParams = async () => {
      setSig(await fetchStripeSignature())
      setEmail((await getDashboardUserEmail()).email)
    }

    fetchParams()
  }, [])

  useEffect(() => {
    const fetchMtr = async () => {
      const response = await post('/stripe/get_mtr_estimate', {})
      const { mtr } = await response.json()
      setMtr(mtr)
    }

    fetchMtr()
  }, [post])

  return (
    <Box css={{ stack: 'y', gapY: 'medium' }}>
      <Box
        css={{
          stack: 'y',
          keyline: 'neutral',
          padding: 'large',
          width: 'fit',
          borderRadius: 'medium',
          gapY: 'medium',
        }}
      >
        <Box css={{ font: 'bodyEmphasized' }}>
          Add a Payment Method to enable Spackle in live mode
        </Box>
        <Box
          css={{
            stack: 'y',
            alignX: 'center',
            alignY: 'center',
            gapY: 'small',
          }}
        >
          <Button
            type="primary"
            href={`${host}/stripe/checkout_redirect?user_id=${userContext.id}&account_id=${userContext.account.id}&email=${email}&sig=${sig}`}
            disabled={!sig || !email}
          >
            Add Payment Method
            <Icon name="external" />
          </Button>
          <Link external target="_blank" href="https://spackle.so/pricing">
            View Pricing
          </Link>
        </Box>
      </Box>
      <Box>
        <Box>
          <Inline css={{ font: 'bodyEmphasized' }}>Current Plan:</Inline>{' '}
          <Inline>Trialing - Test mode only</Inline>
        </Box>
        <Box css={{ font: 'caption' }}>
          Spackle is free to use in test mode as you get set up. Add a billing
          method to access all of Spackle&apos;s features in live mode. The
          first $1,000 of MTR is always free.{' '}
        </Box>
      </Box>
      <Box css={{ stack: 'y', gapY: 'medium' }}>
        <Box css={{ width: 'fit' }}>
          <Box css={{ stack: 'y' }}>
            <Inline css={{ font: 'bodyEmphasized' }}>Estimated Cost</Inline>
            <Inline css={{ font: 'caption' }}>
              Based on last month&apos;s usage
            </Inline>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Charge type</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Inline css={{ font: 'caption' }}>MTR Subtotal</Inline>
                </TableCell>
                <TableCell>
                  <Inline css={{ font: 'caption' }}>${mtr}</Inline>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Inline css={{ font: 'caption' }}>
                    First $1,000 MTR Free
                  </Inline>
                </TableCell>
                <TableCell>
                  <Inline css={{ font: 'caption' }}>-$1,000</Inline>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Inline css={{ font: 'caption' }}>MTR</Inline>
                </TableCell>
                <TableCell>
                  <Inline css={{ font: 'caption' }}>
                    ${Math.max((mtr || 0) - 1000, 0)}
                  </Inline>
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>
                  <Inline css={{ font: 'caption', fontWeight: 'bold' }}>
                    Total ($3 per $1,000 MTR)
                  </Inline>
                </TableCell>
                <TableCell>
                  <Inline css={{ font: 'caption', fontWeight: 'bold' }}>
                    ${Math.ceil(Math.max((mtr || 0) - 1000, 0) / 1000) * 3}
                  </Inline>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
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
  const { post } = useApi()

  useEffect(() => {
    const track = async () => {
      await post('/stripe/identify', {
        path: `/settings`,
      })
      await post('/stripe/track', {
        event: '$pageview',
        properties: {
          $current_url: `https://stripe.spackle.so/settings`,
        },
      })
    }
    track()
  }, [])

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
