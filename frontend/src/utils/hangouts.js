export const splitHangouts = (hangouts) => {
  const pastHangouts = []
  const currentHangouts = []

  for (let hout of hangouts) {
    if (hout.finalDate) {
      let date = new Date(hout.finalDate)
      let now = new Date(Date.now())
      if (date < now) {
        pastHangouts.push(hout)
      } else {
        currentHangouts.push(hout)
      }
    } else {
      currentHangouts.push(hout)
    }
  }

  // sort pastHangouts by most recent first
  pastHangouts.sort((a, b) => {
    let dateOptionA = Object.keys(a.dateOptions)[0]
    let dateOptionB = Object.keys(b.dateOptions)[0]
    return new Date(dateOptionB) - new Date(dateOptionA)
  })

  // sort these hangouts by earliest dateOption or finalDate
  const pendingHangouts = currentHangouts.filter(hout => !hout.finalized).sort((a, b) => {
    let dateOptionA = Object.keys(a.dateOptions)[0]
    let dateOptionB = Object.keys(b.dateOptions)[0]
    return new Date(dateOptionA) - new Date(dateOptionB)
  })

  const upcomingHangouts = currentHangouts.filter(hout => hout.finalized).sort((a, b) => {
    return new Date(a.finalDate) - new Date(b.finalDate)
  })

  return { pastHangouts, currentHangouts, pendingHangouts, upcomingHangouts }
}