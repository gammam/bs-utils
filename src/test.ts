import nodeFetch from "node-fetch";
import { Client, createClient, WithDefaultsT } from "../generated/bs-utils-checkiban-api/client";
import {AccountHolderRequestModel} from "../generated/bs-utils-checkiban-api/AccountHolderRequestModel"
import {ValueTypeEnum} from "../generated/bs-utils-checkiban-api/AccountRequestModel"
import {TypeEnum} from "../generated/bs-utils-checkiban-api/AccountHolderRequestModel"
import { ResponseModelValidateAccountHolderResponseModel } from "../generated/bs-utils-checkiban-api/ResponseModelValidateAccountHolderResponseModel";
import { ValidateAccountHolderResponseModel } from "../generated/bs-utils-checkiban-api/ValidateAccountHolderResponseModel";
import { identity } from "fp-ts/lib/function";
import { RateLimit} from "async-sema"
import * as csv from "csvtojson";
import * as commandLineArgs from "command-line-args";
import * as fs from "fs"
import { boolean, string } from "io-ts";
import * as dotenv from "dotenv";
import * as winston from "winston"


// Client withDefaults
const simpleClient: Client = createClient({
    basePath:`/api/pagopa/banking/v4.0/utils`,
    baseUrl: `https://bankingservices-sandbox.pagopa.it`,
    fetchApi: (nodeFetch as any) as typeof fetch
});




// logger configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'index' },
    transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

// Import Parameters 

// Type to check if the input csv exist
class FileDetails {
    filename: string;
    exists: boolean;
    constructor ( filename:string) {
      this.filename = filename
      this.exists = fs.existsSync(filename)
    }
  }

const optionDefinitions = [
    { name: 'csvFilePath', type: (filename: string) => new FileDetails(filename)},
    { name: "help", type: Boolean }
  ]

const options = commandLineArgs(optionDefinitions)

// valid checks that the required parameters has been passed
const valid =
  options.help ||
  (
    /* all supplied files should exist */
    options.csvFilePath.exists
  )

// 
class CheckIbanRequestInputCsvModel {
    account:string;
    accountHolder:string
    constructor(account:string,fiscalCode:string){
        this.account = account,
        this.accountHolder = fiscalCode
    }
}

async function sendData(requestInput:CheckIbanRequestInputCsvModel) {
    await lim(); 
    const requestDate = new Date(Date.now());
    logger.debug("starting request at ", {message: requestDate.toUTCString() }  )
    const response  =  (await simpleClient.validateAccountHolderUsingPOST({
        "Auth-Schema": process.env.AUTH_SCHEMA,
        "Api-Key": process.env.API_KEY,
        inputModel:{
                account: {
                  value: requestInput.account ,
                  valueType: ValueTypeEnum.IBAN,
                  bicCode: null
                },
            accountHolder: {
                  type: TypeEnum.PERSON_NATURAL,
                  fiscalCode: requestInput.accountHolder,
                  vatCode: null,
                  taxCode: null
                }
        }
    }
    ))
    .fold(
        () => undefined,
        (res) =>  ValidateAccountHolderResponseModel.decode(res.value).fold(
            ()=>undefined,
            (result1) => logger.info("value: ",result1) ) 
                
    )
}




// SETUP
const r  = dotenv.config()
if (process.env.NODE_ENV !== "production") {
    logger.add( new winston.transports.Console({
        format: winston.format.simple(),
    }))
}
logger.info("running sample client")

// RateLimiter 
const lim = RateLimit(10); 

if (valid) {
    csv()
    .fromFile(options.csvFilePath.filename)
    .subscribe( (jsonData) => {
        sendData( new CheckIbanRequestInputCsvModel(jsonData.account,jsonData.accountholder))
    })
}
else {
    logger.error("File not exists, unable to process input data")
}