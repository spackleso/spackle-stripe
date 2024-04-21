import { Box, Button, Spinner } from '@stripe/ui-extension-sdk/ui'
import useAccount from '../hooks/useAccount'
import { ReactNode, useEffect } from 'react'
import useApi from '../hooks/useApi'
import useStripeContext from '../hooks/useStripeContext'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../query'

const LoadingSpinner = ({ children }: { children?: ReactNode }) => {
  return (
    <Box
      css={{
        stack: 'y',
        alignX: 'center',
        alignY: 'center',
        width: 'fill',
        height: 'fill',
        gap: 'small',
      }}
    >
      {children}
      <Spinner />
    </Box>
  )
}

const SetupInterstitial = ({ account }: { account: any }) => {
  const { post } = useApi()

  const acknowledgeSetup = useMutation({
    mutationFn: async () => {
      const response = await post('/stripe/acknowledge_setup', {})

      if (response.status !== 200) {
        const error = (await response.json()).error
        throw new Error(error)
      }

      queryClient.invalidateQueries({
        queryKey: ['account', account.stripe_id],
      })
      return response
    },
  })

  useEffect(() => {
    const track = async () => {
      await post('/stripe/identify', {
        path: `/setup`,
      })
      await post('/stripe/track', {
        event: '$pageview',
        properties: {
          $current_url: `https://stripe.spackle.so/setup`,
        },
      })
    }
    track()
  }, [])

  return (
    <Box
      css={{
        width: 'fill',
        height: 'fill',
        gap: 'small',
      }}
    >
      <Box css={{ paddingX: 'large', font: 'heading', marginTop: 'xxlarge' }}>
        Setup
      </Box>
      <Box css={{ paddingX: 'large', marginY: 'small' }}>
        Before we begin, Spackle will need to sync all of your current products,
        subscriptions, and customers. This can take a few minutes.
      </Box>
      <Box css={{ stack: 'x', alignX: 'center', marginY: 'medium' }}>
        <Button
          type="primary"
          onPress={() => acknowledgeSetup.mutate()}
          disabled={acknowledgeSetup.isLoading}
        >
          Continue
        </Button>
      </Box>
    </Box>
  )
}

const AccountWrapper = ({ children }: { children: ReactNode }) => {
  const { userContext } = useStripeContext()
  const { data: account, isLoading } = useAccount(userContext.account.id)

  if (isLoading) {
    return <LoadingSpinner />
  } else if (!account.has_acknowledged_setup) {
    return <SetupInterstitial account={account} />
  } else {
    return <>{children}</>
  }
}

export default AccountWrapper
