import { Box, Button, Spinner } from '@stripe/ui-extension-sdk/ui'
import { Feature, NewOverride, Override } from '../types'
import FeatureItem from './FeatureItem'
import { useState, useEffect } from 'react'
import { QueryObserverResult, UseMutationResult } from '@tanstack/react-query'
import { sortFeatures } from '../utils'

const FeatureList = ({
  features,
  overrides,
  saveOverrides,
}: {
  features: QueryObserverResult<Feature[]>
  overrides: QueryObserverResult<Override[] | NewOverride[]>
  saveOverrides: UseMutationResult<any, unknown, Override[] | NewOverride[]>
}) => {
  const [overrideMap, setOverrideMap] = useState<{
    [key: number]: Override | NewOverride
  }>({})

  const isLoading =
    features.isRefetching || overrides.isRefetching || saveOverrides.isLoading

  // compares the value_limit and value_flag values of overrides.data and overrideMap
  const isModified = !(
    overrides.data &&
    Object.values(overrideMap).length === overrides.data.length &&
    overrides.data.every((o) => {
      const override = overrideMap[o.feature_id]
      return (
        override.value_limit === o.value_limit &&
        override.value_flag === o.value_flag
      )
    })
  )

  useEffect(() => {
    if (overrides.data) {
      setOverrideMap(
        Object.assign(
          {},
          ...overrides.data.map((o) => ({ [o.feature_id]: o })),
        ),
      )
    }
  }, [overrides.data])

  if (!features.data || !overrides.data) {
    return <></>
  }

  return (
    <>
      <Box css={{ stack: 'y' }}>
        {features.data.sort(sortFeatures).map((f) => (
          <>
            <FeatureItem
              key={f.key}
              feature={f}
              overrideMap={overrideMap}
              setOverrideMap={setOverrideMap}
            />
          </>
        ))}
      </Box>
      <Box css={{ stack: 'x', marginY: 'large', gap: 'small' }}>
        <Button
          type="primary"
          css={{ width: 'fill' }}
          disabled={!isModified || isLoading}
          onPress={() => saveOverrides.mutate(Object.values(overrideMap))}
        >
          {saveOverrides.isLoading ? <Spinner /> : <>Save</>}
        </Button>

        {!saveOverrides.isLoading && (
          <Button
            type="secondary"
            css={{ width: 'fill' }}
            disabled={!isModified || isLoading}
            onPress={() => {
              setOverrideMap(
                Object.assign(
                  {},
                  ...overrides.data.map((o) => ({ [o.feature_id]: o })),
                ),
              )
            }}
          >
            Cancel
          </Button>
        )}
      </Box>
    </>
  )
}

export default FeatureList
