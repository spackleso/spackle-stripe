import {
  Box,
  Button,
  Divider,
  Icon,
  Spinner,
  TextField,
} from '@stripe/ui-extension-sdk/ui'
import useAccount from '../hooks/useAccount'
import { ReactNode, useEffect, useCallback, useState } from 'react'
import useApi from '../hooks/useApi'
import useStripeContext from '../hooks/useStripeContext'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../query'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

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

  const acknowledgeSetup = useMutation(async () => {
    const response = await post('/stripe/acknowledge_setup', {})

    if (response.status !== 200) {
      const error = (await response.json()).error
      throw new Error(error)
    }

    queryClient.invalidateQueries(['account', account.stripe_id])
    return response
  })

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
  const { post } = useApi()
  const { userContext } = useStripeContext()
  const {
    data: account,
    refetch,
    isLoading,
  } = useAccount(userContext.account.id)

  const startSync = useCallback(async () => {
    await post('/stripe/sync_account', {})
  }, [post])

  const pollAccount = useCallback(async (): Promise<boolean> => {
    await delay(3000)
    const { data } = await refetch()

    if (data.initial_sync_complete) {
      return true
    } else if (!data.initial_sync_started_at) {
      await startSync()
    } else {
      const diff =
        (new Date() as unknown as number) -
        (new Date(data.initial_sync_started_at) as unknown as number)
      if (diff > 15 * 60 * 1000) {
        await startSync()
      }
    }

    return await pollAccount()
  }, [refetch, startSync])

  useEffect(() => {
    if (!account || !account.has_acknowledged_setup) {
      return
    }

    if (!account.initial_sync_started_at) {
      startSync()
      pollAccount()
    } else if (!account.initial_sync_complete) {
      pollAccount()
    }
  }, [account, pollAccount, startSync])

  if (isLoading) {
    return <LoadingSpinner />
  } else if (!account.has_acknowledged_setup) {
    return <SetupInterstitial account={account} />
  } else if (!account.initial_sync_complete) {
    return <LoadingSpinner>Running initial setup...</LoadingSpinner>
  } else {
    return <>{children}</>
  }
}

export default AccountWrapper
