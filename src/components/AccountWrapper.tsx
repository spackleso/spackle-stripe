import { Box, Spinner } from '@stripe/ui-extension-sdk/ui'
import useAccount from '../hooks/useAccount'
import { ReactNode, useEffect, useCallback } from 'react'
import useApi from '../hooks/useApi'
import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const AccountWrapper = ({
  context,
  children,
}: {
  context: ExtensionContextValue
  children: ReactNode
}) => {
  const { post } = useApi(context)
  const { data: account, refetch } = useAccount(
    context,
    context.userContext.account.id,
  )

  const startSync = useCallback(async () => {
    await post('api/stripe/sync_account', {})
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
    if (!account) {
      return
    }

    if (!account.initial_sync_started_at) {
      startSync()
      pollAccount()
    } else if (!account.initial_sync_complete) {
      pollAccount()
    }
  }, [account, pollAccount, startSync])

  if (account && account.initial_sync_complete) {
    return <>{children}</>
  } else {
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
        Running initial setup...
        <Spinner />
      </Box>
    )
  }
}

export default AccountWrapper
