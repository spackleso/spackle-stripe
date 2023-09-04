const host = process.env.POSTHOG_HOST ?? 'https://app.posthog.com'
const key = process.env.POSTHOG_API_KEY ?? ''

export const identify = (userId: string, properties: any, path = '/') => {
  return fetch(`${host}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: key,
      distinct_id: userId,
      event: '$identify',
      $set: properties,
      $set_once: {
        $initial_current_url: `https://stripe.archer.so${path}`,
      },
    }),
  })
}

const track = (distinctId: string, event: string, properties: any) => {
  return fetch(`${host}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: key,
      distinct_id: distinctId,
      event,
      properties,
    }),
  })
}
