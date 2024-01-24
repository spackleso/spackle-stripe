import { Box, Button, FocusView, Spinner } from '@stripe/ui-extension-sdk/ui'
import { Feature, NewOverride, Override } from '../types'
import EntitlementFormItem from './EntitlementFormItem'
import { useState, useEffect, useCallback } from 'react'
import { QueryObserverResult, UseMutationResult } from '@tanstack/react-query'
import { sortFeatures } from '../utils'

const confirmCloseMessages = {
  title: 'Your entitlements will not be saved',
  description: 'Are you sure you want to exit?',
  cancelAction: 'Cancel',
  exitAction: 'Exit',
}

const EntitlementsForm = ({
  name,
  features,
  overrides,
  saveOverrides,
  shown,
  setShown,
}: {
  name: string | undefined
  features: QueryObserverResult<Feature[]>
  overrides: QueryObserverResult<Override[] | NewOverride[]>
  saveOverrides: UseMutationResult<unknown, unknown, Override[] | NewOverride[]>
  shown: boolean
  setShown: (val: boolean) => void
}) => {
  const [confirmClose, setConfirmClose] = useState<boolean>(true)
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
        override &&
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

  const resetForm = useCallback(() => {
    if (overrides.data) {
      setOverrideMap(
        Object.assign(
          {},
          ...overrides.data.map((o) => ({ [o.feature_id]: o })),
        ),
      )
    }
  }, [overrides.data, setOverrideMap])

  const closeWithConfirm = useCallback(() => {
    setShown(false)
  }, [setShown])

  if (!features.data || !overrides.data) {
    return <></>
  }

  return (
    <FocusView
      title={name ? 'Entitlements for ' + name : 'Entitlements'}
      shown={shown}
      setShown={(val) => {
        if (!val) {
          resetForm()
        }
        setShown(val)
      }}
      confirmCloseMessages={
        confirmClose && isModified ? confirmCloseMessages : undefined
      }
      primaryAction={
        <Button
          type="primary"
          disabled={!isModified || isLoading}
          onPress={() => {
            setConfirmClose(false)
            saveOverrides.mutate(Object.values(overrideMap))
          }}
        >
          {saveOverrides.isLoading ? <Spinner /> : <>Save</>}
        </Button>
      }
      secondaryAction={
        <Button
          type="secondary"
          css={{ width: 'fill' }}
          disabled={isLoading}
          onPress={closeWithConfirm}
        >
          Cancel
        </Button>
      }
    >
      <Box css={{ stack: 'y', gapY: 'small' }}>
        {features.data.sort(sortFeatures).map((f) => (
          <>
            <EntitlementFormItem
              key={f.key}
              feature={f}
              overrideMap={overrideMap}
              setOverrideMap={setOverrideMap}
            />
          </>
        ))}
      </Box>
    </FocusView>
  )
}

export default EntitlementsForm
