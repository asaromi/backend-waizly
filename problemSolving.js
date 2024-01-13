console.group('minMaxSum')
const minMaxSum = (arr) => {
  let min = arr[0]
  let max = arr[0]
  let sum = 0

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i]
    if (arr[i] > max) max = arr[i]

    sum += arr[i]
  }

  return `${sum - max} ${sum - min}`
}
console.log(minMaxSum([1, 2, 3, 4, 5]))
console.groupEnd()

console.group('plusMinus')
const plusMinus = (arr) => {
  let positive = 0
  let negative = 0
  let zero = 0

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 0) positive++
    if (arr[i] < 0) negative++
    if (arr[i] === 0) zero++
  }

  return `${(positive / arr.length).toFixed(6)}\n${(negative / arr.length).toFixed(6)}\n${(zero / arr.length).toFixed(6)}`
}

console.log(plusMinus([-4, 3, -9, 0, 4, 1]))
console.groupEnd()

console.group('timeConversion')
const timeConversion = (s) => {
  // Write your code here
  let [hours, minutes, seconds] = s.split(':')

  if (seconds.includes('PM')) {
    hours = hours !== '12' && `${parseInt(hours) + 12}` || hours
    seconds = seconds.replace('PM', '')
  } else {
    hours = `0${parseInt(hours) % 12}`
    seconds = seconds.replace('AM', '')
  }

  return `${hours}:${minutes}:${seconds}`
}

console.log(timeConversion('12:45:54PM'))
console.groupEnd()
