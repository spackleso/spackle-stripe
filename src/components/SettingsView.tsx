import { Box, Button, Icon, Link, TextField } from '@stripe/ui-extension-sdk/ui'
import { clipboardWriteText, showToast } from '@stripe/ui-extension-sdk/utils'
import useStripeContext from '../hooks/useStripeContext'
import useToken from '../hooks/useToken'

const SettingsView = () => {
  const { userContext } = useStripeContext()
  const { data } = useToken(userContext?.account.id)

  return (
    <Box
      css={{
        height: 'fill',
        width: 'fill',
      }}
    >
      <Box>
        Use the access token below to request feature access flags via the
        Spackle API.
      </Box>
      <Box>For more information:</Box>
      <Box css={{ stack: 'x', alignX: 'center', marginY: 'medium' }}>
        <Link href="https://www.spackle.so/docs" type="primary">
          Read the Docs
          <Icon name="arrowUpRight" size="xsmall" />
        </Link>
      </Box>
      <Box
        css={{
          stack: 'x',
          gap: 'small',
          alignY: 'bottom',
          marginTop: 'large',
        }}
      >
        <TextField disabled value={data?.token || ''} label="Access Token" />
        <Button
          onPress={async () => {
            if (data?.token) {
              await clipboardWriteText(data.token)
              showToast('Copied!', { type: 'success' })
            }
          }}
        >
          <Icon name="clipboard" />
        </Button>
      </Box>
    </Box>
  )
}

export default SettingsView
