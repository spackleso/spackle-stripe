import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { QueryClientProvider } from '@tanstack/react-query'
import CustomerView from '../components/CustomerView'
import { queryClient } from '../query'

const View = (context: ExtensionContextValue) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomerView context={context} />
    </QueryClientProvider>
  )
}

export default View
