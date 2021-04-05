export function fail(str) {
  alert(str + "\nUnable to access the camera Please ensure you are on HTTPS and using Firefox or Chrome.")
  window.open("http://mozilla.org/firefox")
}
export const humanReadableDuration = milliseconds => {
  const hours = `0${new Date(milliseconds).getHours() - 1}`.slice(-2)
  const minutes = `0${new Date(milliseconds).getMinutes()}`.slice(-2)
  const seconds = `0${new Date(milliseconds).getSeconds()}`.slice(-2)

  const time = `${hours}:${minutes}:${seconds}`
  console.log(time)
  return time;
}

// function humanReadableDuration(msDuration: int): string {
//   const h = Math.floor(msDuration / 1000 / 60 / 60)
//   const m = Math.floor((msDuration / 1000 / 60 / 60 - h) * 60)
//   const s = Math.floor(((msDuration / 1000 / 60 / 60 - h) * 60 - m) * 60)

//   // To get time format 00:00:00
//   const seconds: string = s < 10 ? `0${s}` : `${s}`
//   const minutes: string = m < 10 ? `0${m}` : `${m}`
//   const hours: string = h < 10 ? `0${h}` : `${h}`

//   return `${hours}h ${minutes}m ${seconds}s`
// }
