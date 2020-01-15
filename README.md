# Room booking system

## Introduction

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

### Functional requirements

- Both companies provide a set of meeting rooms to the booking platform
- Both company's employees are authorized to book a meeting room within both companies
- Only reservation owners can cancel their own reservation
- Meeting room availability and reservation are public information
- Both company's employees have unique credential

### Non-functional requirements

- Both company's administrator has the same rights
- Meeting room can be booked only once (first come first served)
- Each company can run its own instance of the booking platform
- Reservation process must be transparent

### Reasoning the taken approach

Considering above requirements, I deem that, the best approach to overcome them is
the usage of distributed technologies such as a blockchain network + smart-contracts. Out of the multiple alternatives
for it such as NEO, EOS and others we are going to use `Ethereum` + `Solidity` for this project along the toolkit of web3: web3js, truffle...

To interact with an ethereum blockchain we have two alternatives:

- Client side application: Private-keys hold by the employee
- Server side application: Private-keys hold by the company side

For the sake of simplicity I am going to implement a `server-side` application where each company is going to run its own instance of a NodeJS server
connected to it own local instance of Ethereum blockchain holding the encrypted wallets of its own employees. The application will consist on a express HTTP API to interact with the deployed smart-contracts, where the employee provides the passphrase to
decrypt its wallet and trust on its own company server to send the transaction to book/cancel a room reservation and also to query the status of the meeting rooms.

## Setup

### Pre-requirements

- Node >= v10.0
- Ganache-cli: We are going to use ganache to simulate a ethereum network for development

### Install project deps

Install project NodeJS deps by the following command
```
npm install
```

### Install ganache globally

We need to have `ganache-cli` installed globally, if you don't having it yet,
run the next command:

```
npm install -g ganache-cli
```

## Development

### Running ganache-cli service

We have to run `ganache-cli` in a separate terminal and keep it running
during the next of the steps
```
$> bash ./scripts/ganache-cli.sh
```

Ganache is being launched using deterministic account creation:

```
Available Accounts
==================
(0) 0xA3e9673227000F4738827c4baB6913ef34b469bc (1000 ETH)
(1) 0xAD1292f481aDcaa52e01913259a99486E156d09E (1000 ETH)
(2) 0xda8AfC03d445E960c95c04299cf835025d92E235 (1000 ETH)
(3) 0x9279d8679F8Ed3a4a2c6f5101C2CF675F228E9F1 (1000 ETH)
(4) 0x3E0E01002FC8e23579b4DaB7A5c25FaD49a1425f (1000 ETH)
(5) 0xc311C525fa9afe1E332aBCB41F73AC3329231cA4 (1000 ETH)
(6) 0x5448Fa095dd0cC1E180FeFD621f0E7F9f4fC6187 (1000 ETH)
(7) 0x81f8D4098b7d39DBD95827ed224D9357c22C5352 (1000 ETH)
(8) 0x6D8bEA5cda361a443EaeaEAf914184c182D9A8Dc (1000 ETH)
(9) 0xE2282c5ED20bb21832eCc6EA7fac087CDC815A4E (1000 ETH)

```

### Project setup

**Step 0: Copy .env.sample**

```bash
$> cp .env.sample .env
```

By default the sample env file contains the default `ganache-cli`
RPC connection:
```
RPC_HOST='http://127.0.0.1'
RPC_PORT='7545'
NETWORK_ID='577'
```

**Step 1: Compile smart contracts**

Compile latest version of the application smart-contracts
```
$> npm run truffle:compile
```

**Step 2: Update companyOne and companyTwo information**

To initialize your the `roomBooking.sol` smart-contract, we need to
insert the information about the companies which are going to take part in the
platform:
- [./setup/companyOne.json](./setup/companyOne.json)
- [./setup/companyTwo.json](./setup/companyTwo.json)

On above files we will need to update the information referring to the
`companyOwner` and `*[employee].address` using the accounts generate by ganache-cli:
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

**Step 3: Deploying and initializing application contracts**

Once our company json files are updated we have to launch the setup script to deploy
our application smart-contracts:
- [`Company.sol`](./contracts/Company.sol): Company's information and administration business logic for employees and meeting rooms
- [`RoomBooking.sol`](./contracts/RoomBooking.sol): Booking meeting room impl


```
$> npm run server:setup
...
> node ./bin/setup.js
...
  app:setup REMEMBER: Update your ".env":
  app:setup 	...
  app:setup 	ROOM_BOOKING_CONTRACT_ADDR = "<CONTRACT_ADDRESS>"
  app:setup 	... +0ms
  app:setup Finished successfully +1ms

```

Once the script is completed we will have a `roomBooking.sol` smart-contract deployed and initialize with
companyOne and companyTwo.

**Step 3: Update .env**

At last, we have to copy the `.env.sample` to `.env` to
with the recently deployed `roomBooking.sol` smart-contract address:

```
$> vim .env
...
ROOM_BOOKING_CONTRACT_ADDR = "<CONTRACT_ADDRESS>"
...
```

### HTTP API Server

Once our environment is ready we can finally spawn our HTTP API server by executing following command:
```
$> npm run server:dev
> cross-env NODE_ENV=development node ./bin/www

  app:www Server listening on 127.0.0.1:3000 +0ms
```

By default HTTP API will be running on `127.0.0.1:3000`, if you want to use a different PORT or listening host,
update `.env`:

```
HTTP_PORT=3000
HTTP_HOST=127.0.0.1
```

## Testing

### Smart contracts test

```bash
npm run truffle:test
```

### Manual api testing (curl)

Check room availability
```bash
$> curl --request GET 'localhost:3000/isRoomAvailable?roomId=C01&companyId=COLA&bookingDateHour=2019-10-10T18:00'
```

Create a new reservation
```bash
$> curl --request POST 'localhost:3000/reservation' \
--header 'Content-Type: application/json' \
-u 0xAD1292f481aDcaa52e01913259a99486E156d09E:password \
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
-u 0xAD1292f481aDcaa52e01913259a99486E156d09E:password
```

### Integration Api testing

@TODO Implement JTest+Supertest test suite

## Docker

### Pre-installation
In case you need to install docker, follow [this instructions](https://docs.docker.com/v17.12/install/)

### Create container
First, we need to build a new docker image

```bash
$> npm run docker:build
```

### Run container
Then, we can run a new docker container using the command above:
```bash
$> npm run docker:run
```

