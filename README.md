# Room booking system

## Introduction

### Business problem

Two companies, COKE and PEPSI, are sharing an office building. Tomorrow is COLA
day (for one day), that the two companies are celebrating. They are gathering a number
of business partners in the building. In order to optimize space utilization, they have
decided to set-up a joint booking system where any user can book one of the 20
meeting rooms available, 10 from each company (C01, C02, ..., C10 and P01, P02, ....,
P10).
The two companies would prefer that they do not have to use a central booking system
for this (as they do not trust each other or anyone else to not take advantage of the
situation) - but it’s up to you to decide if you want to implement this functionality or not,
and how.
The booking system has the following functionalities:

- Users can see hourly meeting room availability of any of the 20 meeting rooms
on COLA day (8:00-9:00, 9:00-10:00, etc.)
- Users can book meeting rooms by the hour (first come first served)
- Users can cancel their own reservations

### Requirements

#### Functional requirements

- Each company provides a set of meeting rooms to the booking platform
- Every company employee is authorized to book a meeting room, if it is available
- Every company employee is authorized to cancel a reservation over a meeting room
- Everyone, included guest users, can see every room availability and reservation

#### Non-functional requirements

- There must not be single authority or administrator role
- System must be resilient and reservation process as transparent as possible
- Reservation collision must be prevented

### Reasoning the taken approach

Derived from the requirements above, we concluded that there is a significant lack of trust in between both companies taking part
 in the event therefore we must design a application where there must be non-authority or in case of being it must be both
companies at the same level. Also the transparency and security are two very relevant requirements in this application.

Therefore, out of the available technologies and options currently available for this project,
we deemed that using distributed technologies such as a blockchain seems to be a the best approach. Another consideration to make is that
we need to force the application business logic using smart-contracts due, and out of the multiple alternatives
for it such as NEO, EOS and others we are going to take `Ethereum` + `Solidity` to implement this project.

To interact with an ethereum blockchain we have two main alternatives:

- Client side application
- Server side application

IMO a pure client side distributed app is a better fit in this case but
aiming to showcase my NodeJS skills I am implementing an http API in using `express` which will interact with the blockchain
using web3js.

**Caveats**

The usage of a blockchain technologies, such as Ethereum, brings along an additional complexity we need to be aware of and evaluate too.
Ethereum, as other blockchains, has limitation due to its reduced storage and its low performance. But reading over the project
requirements there is not specification about maximum time responses, neither on the necessity of storing historical booking data,
therefore we could still be confident that ethereum seems to be a good solution.

## Development

This is a NodeJS project

### Pre-requirements

- Node >= v10.0
- Ganache-cli

### How to install

```
npm install
```

### Setup

**Step 0: Init Ganache and sync your environment**

First, we have to launch `ganache-cli`.

Then we have to update `.env` with the corresponding ganache RPC endpoint.
```
$> vim .env

RPC_HOST='http://127.0.0.1'
RPC_PORT='7545'
NETWORK_ID='577'
```

**Step 1: Compile smart contracts**

Compile latest varsion of the application contracts
```
$> npm run truffle:compile
```

**Step 2: Deploying and initializing application data**

To initialize your the roomBooking platform we have a couple json files
including companies information:
- [./setup/companyOne.json](./setup/companyOne.json)
- [./setup/companyTwo.json](./setup/companyTwo.json)

As we are using `ganache` as blockchain network we will need to update the
company owner address and the employee addresses with the ones provided by ganache:

```
$> vim ./setup/companyOne.json
...
"companyOwner": "<ACCOUNT_1>",
  "employees": [
    {
      "username": "employee_1",
      "address": "<ACCOUNT_2>"
    },
...
```

and repeat same process for `./setup/companyTwo.json`

Once our company json files are updated we have to launch the setup script as follow
```
$> npm run server:setup
...
  app:setup REMEMBER: Update your ".env":
  app:setup 	...
  app:setup 	ROOM_BOOKING_CONTRACT_ADDR = "0x0d95Cc1752078e439d78720C98262598cd2f0DE8"
  app:setup 	... +0ms
  app:setup Finished successfully +1ms

```

Once the script is completed we will have a `roomBooking` smart contract deployed and initialize with
the two companies.

**Step 3: Update ROOM_BOOKING_CONTRACT_ADDR**

We have to copu the address of the `roomBooking` contract deployed in the step before into `.env`:
```
$> vim .env
...
ROOM_BOOKING_CONTRACT_ADDR = "0x0d95Cc1752078e439d78720C98262598cd2f0DE8"
...
```

### Running HTTP Api

Once our environment is ready we can launch our HTTP API server running following command:
```
$> npm run server:dev
```

### Testing

**1. Smart contracts test**

```bash
npm run truffle:test
```

**Manual api testing (curl)**

Check room availability
```bash
$> curl --request GET 'localhost:3000/isRoomAvailable?roomId=C01&companyId=COLA&bookingDateHour=2019-10-10T18:00'
```

Create a new reservation
```bash
$> curl --request POST 'localhost:3000/reservation' \
--header 'Content-Type: application/json' \
-u 0x2eF8fF21Dc389eB470a616ddF2D3535bdCa7e2b9:password \
--data-raw '{
"roomId":"C01",
"companyId":"COLA",
"bookingDateHour":"2019-10-10T18:00"
}'
```

Fetch reservation information
```bash
$> curl --request GET 'localhost:3000/reservation/0x6016776d8e9c88fe645b1bd84d60fb9be3c68757a43126292cab9cd157525580'
```

Delete reservation
```bash
$> curl --request DELETE 'localhost:3000/reservation/0x6016776d8e9c88fe645b1bd84d60fb9be3c68757a43126292cab9cd157525580' \
-u 0x2eF8fF21Dc389eB470a616ddF2D3535bdCa7e2b9:password
```

**Integration Api testing**

@TODO Implement JTest+Supertest test suite

