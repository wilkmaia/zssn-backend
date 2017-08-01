# zssn-backend
The Zombie Survival Social Network Backend.

The world is in chaos because of a lethal virus that infects both humans and
animals, making them flesh hungry beasts.
This service is the only thing you can use to keep track of the survivors of
this apocalypse.

### Installing

Download the application and run:

    make build

### Setup

Set the MongoDB address and the port the server will listen to with environment
variables:

On bash:

    export ZSSN_PORT=1234
    export ZSSN_MONGODB_ADDR=localhost
    
On fish:

    set -x ZSSN_PORT 1234
    set -x ZSSN_MONGODB_ADDR localhost

The values used on the example are the default values. To use them, no setup
is needed.

### Running

There are two ways you can run the application:

1. Locally

       make local
    
2. Docker Container

       make docker

### API Routes

#### GET /_health_check

Should return an empty response with a `200` response code if the application
started with no issues.

#### GET /survivors

Retrieves a list of all known survivors with their IDs and names.

#### GET /survivors/:id

Retrieves information on the specified survivor.

#### POST /survivors

Registers a new survivor. Sample payload can be found at `samples/survivor.json`.

A survivor needs an inventory which can contain four kinds of items:

* `Water` - 4 points
* `Food` - 3 points
* `Medication` - 2 points
* `Ammunition` - 1 point

#### PUT /survivors/:id/location

Updates the specified survivor's location. Sample payload can be found at 
`samples/location.json`.

#### PUT /survivors/:id/infected

Flags the specified survivor as infected. Sample payload can be found at 
`samples/infected.json`

If you want to flag a survivor as infected (including yourself), send your `id` 
on the payload of the request and the survivor's `id` as the request param.

#### POST /trade

Trades items between two survivors. Sample payload can be found at 
`samples/trade.json`.

The payload is an array containing two objects, which describe the survivors.
Each object must contain two entries:

* `id` - The ID of the survivor
* `items` - An array with the items to be traded. Each item is an object itself
with a name and an amount.

The sum of the points of each survivor's items on the trade must be the same.

#### GET /reports

Retrieves a report on the human situation.
