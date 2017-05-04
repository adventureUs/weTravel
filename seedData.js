import faker from 'faker'

function User(email, name, homebase, tripsArr) {
  return {
    [replaceAtDot(email)]: {
      name: name,
      homebase: homebase,
      trips: tripsArr,
      email: email
    }
  }
}

function Trip(tripId, name, itemsArr, usersArr) {
  return {
    [tripId]: {
      name: name,
      items: itemsArr,
      users: usersArr
    }
  }
}

function tripUser(email, availStart, availEnd, status, homebase) {
  return {
    [replaceAtDot(email)]: {
      availStart: availStart,
      availEnd: availEnd,
      status: status,
      homebase: homebase,
      email: email
    }
  }
}

// Necessary Global Variables
const statusArr = ['Invited', 'Going', 'Can\'t make it']
let tripIdCounter = 0
var trips = []
var users = []

// returns a trip
function createTrip() {
  return new Trip(tripIdCounter++, faker.commerce.productAdjective(), ['MoMath Museum', 'Grand Canyon', 'White Water Rafting', 'Hot Air Ballooning', 'Shark Cave Diving'], createTripUsers(4))
}

// creates an array of trips
for (var i = 0; i < 10; i++) {
  trips.push(createTrip())
}

// Creates a userArray to be used inside a trip object
function createTripUsers(num) {
  var tripUsers = []
  for (var i = 0; i < num; i++) {
    const rand = Math.floor(Math.random() * 2)
    const card = faker.helpers.createCard()
    users.push(new User(card.email, card.name, card.address.city, [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]))
    tripUsers.push(new tripUser(card.email, faker.date.between('2017-06-01', '2017-06-30'), faker.date.between('2017-07-01', '2017-08-31'), statusArr[rand], card.address.city))
  }
  return tripUsers
}


function replaceAtDot(email) {
  email = email.replace('@', 'At')
  return email.replace(/\./g, 'Dot')
}
users.push(new User('tina@email.com', '', '', ''))
export { users, trips }

