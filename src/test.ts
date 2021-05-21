import nodeFetch from "node-fetch";
import { Client, createClient, WithDefaultsT } from "../generated/bs-utils-checkiban-api/client";
import {AccountHolderRequestModel} from "../generated/bs-utils-checkiban-api/AccountHolderRequestModel"
import {ValueTypeEnum} from "../generated/bs-utils-checkiban-api/AccountRequestModel"
import {TypeEnum} from "../generated/bs-utils-checkiban-api/AccountHolderRequestModel"
import { ValidateAccountHolderResponseModel } from "../generated/bs-utils-checkiban-api/ValidateAccountHolderResponseModel";

// Without withDefaults
const simpleClient: Client = createClient({
    baseUrl: `https://bankingservices-sandbox.pagopa.it`,
    fetchApi: (nodeFetch as any) as typeof fetch
});


// myOperation is defined to accept { id: string; Bearer: string; }


async function sendData() {
    console.log("start")
    let result  =   await simpleClient.validateAccountHolderUsingPOST({
        "Auth-Schema": "S2S",
        "Api-Key": "U8IOTYBODUNRBHUN81FZ8TPRJKZ74KSWD2",
        inputModel:{
            account:{
                value: "IT31O0000012345511353693576",
                valueType: ValueTypeEnum.IBAN
            },
            accountHolder:{
                fiscalCode: "DKLIEK38D57H836G",
                type: TypeEnum.PERSON_NATURAL
            }
        }
    }
    ) as ValidateAccountHolderResponseModel
    
    console.log("result:")
    console.log(result)
    console.log()
}

console.log("running sample client")
var output= sendData()