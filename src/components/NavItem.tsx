import { Box, Icon, Link } from '@stripe/ui-extension-sdk/ui'

const NavItem = ({
  label,
  description,
  href,
  external,
  onPress,
}: {
  label: string
  description?: string
  href?: string
  external?: boolean
  onPress?: () => void
}) => {
  return (
    <Link
      type="secondary"
      css={{
        width: 'fill',
      }}
      href={href}
      onPress={onPress}
      target={external ? '_blank' : undefined}
    >
      <Box
        css={{
          width: 'fill',
          stack: 'x',
          alignY: 'center',
          keyline: 'neutral',
          padding: 'medium',
          borderRadius: 'medium',
          distribute: 'space-between',
          gapX: 'medium',
        }}
      >
        <Box css={{ stack: 'y', gapY: 'xsmall' }}>
          <Box css={{ font: 'subheading', fontWeight: 'bold' }}>{label}</Box>
          {description && <Box css={{ font: 'caption' }}>{description}</Box>}
        </Box>
        <Box>
          {external ? (
            <Icon name="external" size="xsmall" />
          ) : (
            <Icon name="arrowRight" size="xsmall" />
          )}
        </Box>
      </Box>
    </Link>
  )
}

export default NavItem
