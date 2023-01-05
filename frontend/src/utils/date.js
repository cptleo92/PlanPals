/**
 *  https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
 *
 *  due to timezone differences in production, the date must be normalized
 */

export const parseDate = (date) => {
  const dateObject = new Date(date)

  const offsetDate = new Date(dateObject.getTime() - dateObject.getTimezoneOffset() * -60000 )

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return offsetDate.toLocaleDateString('en-US', options)
}

export const daysAgo = (date) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  const dateObject = new Date(date)

  const seconds = Math.floor((dateObject - new Date()) / 1000)
  const days = seconds / 864000

  return rtf.format(Math.trunc(days), 'day')
}