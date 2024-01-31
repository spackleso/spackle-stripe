import {
  Box,
  TextField,
  FormFieldGroup,
  Switch,
} from '@stripe/ui-extension-sdk/ui'
import { PricingTable } from '../types'
import { useCallback } from 'react'

type PricingTableFormSettingsProps = {
  pricingTable: PricingTable
  setUpdatedPricingTable: (pricingTable: PricingTable) => void
}

const PricingTableFormSettings = ({
  pricingTable,
  setUpdatedPricingTable,
}: PricingTableFormSettingsProps) => {
  const handleNameChange = useCallback(
    (e) => {
      setUpdatedPricingTable({
        ...pricingTable,
        name: e.target.value,
      })
    },
    [pricingTable, setUpdatedPricingTable],
  )

  const handleMonthlyEnabledChange = useCallback(
    (e) => {
      setUpdatedPricingTable({
        ...pricingTable,
        monthly_enabled: e.target.checked,
      })
    },
    [pricingTable, setUpdatedPricingTable],
  )

  const handleAnnualEnabledChange = useCallback(
    (e) => {
      setUpdatedPricingTable({
        ...pricingTable,
        annual_enabled: e.target.checked,
      })
    },
    [pricingTable, setUpdatedPricingTable],
  )

  return (
    <Box>
      <Box css={{ font: 'heading', marginBottom: 'medium' }}>Settings</Box>
      <Box css={{ stack: 'y', gapY: 'medium' }}>
        <TextField
          defaultValue={pricingTable.name}
          label="Name"
          size="small"
          onChange={handleNameChange}
        />

        <FormFieldGroup
          legend="Intervals"
          description="Choose the billing intervals customers can select from your pricing table. Only monthly and annual intervals are supported at this time."
          layout="column"
        >
          <Switch
            label="Monthly"
            defaultChecked={pricingTable.monthly_enabled}
            onChange={handleMonthlyEnabledChange}
          />
          <Switch
            label="Annual"
            defaultChecked={pricingTable.annual_enabled}
            onChange={handleAnnualEnabledChange}
          />
        </FormFieldGroup>
      </Box>
    </Box>
  )
}

export default PricingTableFormSettings
