import { Box, Icon } from '@stripe/ui-extension-sdk/ui'
import { FeatureType } from '../types'

const EntitlementItem = ({ entitlement }: { entitlement: any }) => {
  return (
    <Box
      css={{
        background: 'container',
        padding: 'medium',
        borderRadius: 'medium',
        stack: 'x',
        distribute: 'space-between',
        alignY: 'center',
      }}
      key={entitlement.key}
    >
      <Box css={{ stack: 'y' }}>
        <Box css={{ font: 'bodyEmphasized' }}>{entitlement.name}</Box>
        <Box css={{ font: 'caption' }}>{entitlement.key}</Box>
      </Box>
      {entitlement.type === FeatureType.Flag && (
        <Box>
          {entitlement.value_flag ? (
            <Icon name="check" size="xsmall" css={{ fill: 'success' }} />
          ) : (
            <Icon name="delete" size="xsmall" css={{ fill: 'critical' }} />
          )}
        </Box>
      )}

      {entitlement.type === FeatureType.Limit && (
        <Box css={{ fontWeight: 'bold' }}>
          {entitlement.value_limit === null
            ? '∞'
            : entitlement.value_limit.toString()}
        </Box>
      )}
    </Box>
  )
}

export default EntitlementItem
