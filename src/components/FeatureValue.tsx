import { Box, Icon, Link, Switch, TextField } from '@stripe/ui-extension-sdk/ui'
import { Feature, FeatureType, NewOverride, Override } from '../types'

const FeatureValue = ({
  feature,
  override,
  setOverride,
}: {
  feature: Feature
  override: Override | NewOverride | undefined
  setOverride: (override: Override | NewOverride | undefined) => void
}) => {
  if (override) {
    return (
      <Box css={{ stack: 'x', gapX: 'small', alignY: 'center' }}>
        {feature.type === FeatureType.Flag ? (
          <Switch
            checked={!!override.value_flag}
            onChange={(e) =>
              setOverride({
                ...override,
                value_flag: e.target.checked,
              })
            }
          ></Switch>
        ) : feature.type === FeatureType.Limit ? (
          <TextField
            type="number"
            defaultValue={override.value_limit || 0}
            onChange={(e) =>
              setOverride({
                ...override,
                value_limit: parseInt(e.target.value),
              })
            }
          ></TextField>
        ) : (
          <></>
        )}

        <Link type="secondary" onPress={() => setOverride(undefined)}>
          <Icon name="cancel" size="xsmall" />
        </Link>
      </Box>
    )
  } else {
    return (
      <Box css={{ stack: 'x', gapX: 'small', alignY: 'center' }}>
        {feature.type === FeatureType.Flag ? (
          <>{feature.value_flag ? <Box>Enabled</Box> : <Box>Disabled</Box>}</>
        ) : feature.type === FeatureType.Limit ? (
          <Box>{feature.value_limit}</Box>
        ) : (
          <></>
        )}
        <Link
          type="secondary"
          onPress={() =>
            setOverride({
              feature_id: feature.id,
              value_flag:
                feature.type === FeatureType.Flag ? feature.value_flag : null,
              value_limit:
                feature.type === FeatureType.Limit ? feature.value_limit : null,
            })
          }
        >
          <Icon name="edit" size="xsmall" />
        </Link>
      </Box>
    )
  }
}

export default FeatureValue
