const Date = {
  _clockTime: 0,
  now() {
    return (this._clockTime += 1)
  },
}

class KeyStore {
  constructor() {
    this._values = new Map() // <key, Value[]>
  }
  _findValueInList(values, targetValue) {
    // Abstract this searching logic for an easier refactor to binary search later on if required
    // Travel backward in the array, since we are looking for the first element that is smaller than the target.
    for (let i = values.length - 1; i >= 0; i--) {
      if (values[i].time <= targetValue) {
        return values[i].value
      }
    }
  }
  get(key, timestamp) {
    const values = this._values.get(key)
    if (!values) return undefined

    // No timestamp was provided, provide the most recent
    if (timestamp === undefined) {
      return values[values.length - 1].value
    }

    return this._findValueInList(values, timestamp)
  }
  set(key, value) {
    const time = Date.now()
    const currentValues = this._values.get(key) || []
    const newValue = { value, time }
    this._values.set(key, [...currentValues, newValue])
    return time
  }
}

let keyStore = new KeyStore()
console.log(typeof keyStore.get === "function", "it has a get method")
console.log(typeof keyStore.get === "function", "it has a set method")
console.log(
  keyStore.get("keydoesnotexist") === undefined,
  "it return undefined when key doesn't exist"
)

const timeGuyWasInserted = keyStore.set("name", "Guy")
console.log(
  keyStore._values.get("name").length === 1,
  "it sets a key on the internal values"
)

console.log(
  keyStore.get("name") === "Guy",
  "it gets the only value when just one has been inserted"
)

const timeJamesWasInserted = keyStore.set("name", "James")

console.log(
  keyStore._values.get("name").length === 2,
  "it will not remove older values when adding new ones"
)
console.log(
  keyStore.get("name") === "James",
  "it gets the most recent value that has been set"
)

console.log(
  keyStore.get("name", timeGuyWasInserted) === "Guy",
  "it will get the stored value for an exact match of a time"
)

console.log(
  keyStore.get("name", timeGuyWasInserted + 0.5) === "Guy",
  "it will get the stored value for a fuzzy match of a time"
)

console.log(
  keyStore.get("name", timeJamesWasInserted + 0.5) === "James",
  "it will get the most recent value when the target time is more recent than any stored value"
)
