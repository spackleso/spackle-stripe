import { render, getMockContextProps } from '@stripe/ui-extension-sdk/testing'
import { Box, TextField } from '@stripe/ui-extension-sdk/ui'

import AppSettings from './AppSettings'

jest.mock('../hooks/useToken', () => ({
  __esmodule: true,
  default: () => ({
    data: {
      token: 'abc123',
    },
  }),
}))

describe('AppSettings', () => {
  it('renders SettingsView', async () => {
    const { wrapper } = render(<AppSettings {...getMockContextProps()} />)

    expect(wrapper.find(Box)).toContainText(
      'Use the access token below to request feature access flags via the Spackle API.',
    )

    expect(wrapper.find(TextField)).toHaveProps({
      value: 'abc123',
    })
  })
})
