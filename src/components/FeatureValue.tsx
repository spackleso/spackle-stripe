import { Box, Checkbox, Link, Switch, TextField, Tooltip } from '@stripe/ui-extension-sdk/ui'
import { useEffect } from 'react'
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
      <Box
        css={{
          stack: 'x',
          alignY: 'center',
          alignX: 'stretch',
        }}
      >
        <Box css={{ width: '1/2' }}>
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
            <Box css={{ stack: 'x', gapX: 'small', alignY: 'center' }}>
              <TextField
                type={override.value_limit === null ? "text" : "number"}
                size="small"
                value={override.value_limit === null ? '∞' : override.value_limit}
                disabled={override.value_limit === null}
                onChange={(e) =>
                  setOverride({
                    ...override,
                    value_limit: parseInt(e.target.value),
                  })
                }
              ></TextField>
              <Tooltip
                type="label"
                placement="top"
                trigger={
                  <Checkbox
                    label="∞"
                    defaultChecked={feature.value_limit === null}
                    onChange={(e) => {
                      const val = e.target.checked ? null : feature.value_limit || 0
                      setOverride({
                        ...override,
                        value_limit: val,
                      })
                    }}
                  ></Checkbox>
                }
              >
                Unlimited
              </Tooltip>
            </Box>
          ) : (
            <></>
          )}
        </Box>

        <Box css={{ font: 'caption', stack: 'x', alignX: 'end' }}>
          <Link type="secondary" onPress={() => setOverride(undefined)}>
            Reset to Default
          </Link>
        </Box>
      </Box>
    )
  } else {
    return (
      <Box
        css={{
          stack: 'x',
          alignY: 'center',
          alignX: 'stretch',
        }}
      >
        <Box css={{ width: '1/4' }}>
          {feature.type === FeatureType.Flag ? (
            <Switch
              checked={!!feature.value_flag}
              disabled={true}
            ></Switch>
          ) : feature.type === FeatureType.Limit ? (
            <TextField
              type={feature.value_limit === null ? "text" : "number"}
              size="small"
              value={feature.value_limit === null ? '∞' : feature.value_limit}
              disabled={true}
            ></TextField>
          ) : (
            <></>
          )}
        </Box>
        <Box css={{ font: 'caption', stack: 'x', alignX: 'end' }}>
          <Link
            type="primary"
            onPress={() =>
              setOverride({
                feature_id: feature.id,
                value_flag:
                  feature.type === FeatureType.Flag ? feature.value_flag : null,
                value_limit:
                  feature.type === FeatureType.Limit
                    ? feature.value_limit
                    : null,
              })
            }
          >
            Override
          </Link>
        </Box>
      </Box>
    )
  }
}

export default FeatureValue
