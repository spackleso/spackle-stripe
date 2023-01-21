import { Box, Divider } from "@stripe/ui-extension-sdk/ui"
import { Feature, NewOverride, Override } from "../types"
import FeatureValue from "./FeatureValue"

const FeatureItem = ({
  feature,
  overrideMap,
  setOverrideMap,
}: {
  feature: Feature
  overrideMap: { [key: number]: Override | NewOverride }
  setOverrideMap: (map: { [key: number]: Override | NewOverride }) => void
}) => {
  return (
    <Box
      css={{
        stack: 'y',
        distribute: 'space-between',
        padding: 'medium',
        marginY: 'small',
        alignY: 'center',
        gap: 'medium',
        background: 'container',
        borderRadius: 'medium',
      }}
    >
      <Box css={{ stack: 'y' }}>
        <Box css={{ fontWeight: 'bold' }}>{feature.name}</Box>
        {/* TODO: click to copy */}
        <Box css={{ font: 'caption', color: 'secondary' }}>{feature.key}</Box>
      </Box>
      <Divider />
      <Box css={{ stack: 'x' }}>
        <FeatureValue
          feature={feature}
          override={overrideMap[feature.id]}
          setOverride={(o) => {
            if (o) {
              setOverrideMap({ ...overrideMap, [feature.id]: o })
            } else {
              const oMap = { ...overrideMap }
              delete oMap[feature.id]
              setOverrideMap(oMap)
            }
          }}
        />
      </Box>
    </Box>
  )
}

export default FeatureItem