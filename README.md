# bs-utils
modified to run actions 1
- [bs-utils](#bs-utils)
  - [Overview](#overview)
    - [Check-Iban](#check-iban)
    - [Search Payment Instruments ( SPI service)](#search-payment-instruments--spi-service)
    - [Developer guidelines](#developer-guidelines)

A collective list of APIs for PSP Added Value Services for Banking Services Platform.
Official Product documentation is available [here](https://bankingservices.pagopa.it/docs/platform/apis/pagopa-banking-v4.0)

## Overview
Banking Services platform ( named `BS` ) is connected to many value added value services ( `VAS` ) provided by Payment Services Providers in order to provides a common API interfaces to Public Administration Clients.


<!-- 

NOTE : after every change to uml diagram typing 👍

```
plantuml -tsvg README.md
```

-->

<!-- 
@startuml docs/media/img1

autonumber 
participant bs as "Banking Services"
participant psp1 as "PSP 1 VAS A" 
participant psp2 as "PSP 2 VAS A"
participant client as "Client"

client -> bs : Message1
bs -> psp1 : Message2
bs -> psp2 : Message3

@enduml 
-->

![](docs/media/img1.svg)

The platform provides the following services  :

- CheckIban
- Payment Instruments

### Check-Iban

This service lets the client retrieve the account holder validation for a specific fiscal code.

for North API , see documentation [here](north-api/checkIban_north_api.yaml)
for South API, see documentation [here](south-api/checkIban_south_default_api.yaml)

for complete description , see [here](https://bankingservices.pagopa.it/docs/platform/apis/pagopa-banking-v4.0)

### Search Payment Instruments ( SPI service)

This service lets the client retrieve the payment instruments for a specific fiscal code.
It has two operations :

- [POST] _searchPaymentInstrumentsUsingPOST_ : this operation search payment instruments for a specific fiscal code, it returns a complete list or a _request-id_
- [GET] _searchPaymentInstrumentsUsingGET_ : this operations retrieve a search results by its _request-id_

for North API, see documentation [here](north-api/spi_north_api.yaml)

for South API, see documentation [here](south-api/spi_south_default_api.yaml)

### Developer guidelines

To create an api client starting from specifications typing : 

``` console
yarn install && yarn generate
```

if all right under `generated/bs-utils-api/` you'll see auto-generated client and models.
