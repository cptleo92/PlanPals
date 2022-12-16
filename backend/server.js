const app = require('./app')
const CronJob = require('cron').CronJob
const Hangout = require('./models/hangoutModel')

/**
 * CronJob for hangouts
 *
 * Every day at midnight (EST), check all hangouts that are not yet finalized
 * If a pending hangout's earliest date option is the following day, finalize the hangout
 *
 */

new CronJob('00 00 00 * * *', async function() {
  const hangouts = await Hangout.find({ finalized: false })

  for (let hout of hangouts) {
    const dateOptions = Array.from(hout.dateOptions.keys())

    // get earliest date
    dateOptions.sort((a, b) => {
      let optionA = new Date(a)
      let optionB = new Date(b)
      return optionA - optionB
    })

    const earliestDate = new Date(dateOptions[0])

    // get date with most votes
    dateOptions.sort((a, b) => {
      return hout.dateOptions.get(b).length - hout.dateOptions.get(a).length
    })

    const dateWithMostVotes = new Date(dateOptions[0])

    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))

    // if earliestDate is tomorrow, finalize the hangout
    if (earliestDate.toDateString() === tomorrow.toDateString()) {
      hout.finalized = true
      hout.finalDate = dateWithMostVotes

      try {
        hout.save()
        console.log('Finalized hangout: ', hout)
      } catch (error) {
        console.log(error)
      }
    }
  }
},
console.log('Cron job instantialized'),
true
)

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`))


