import * as winston from "winston";
import { utilities as nestWinstonModuleUtilities } from 'nest-winston'; 

export const winstonConfig= {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.label({ label: "Api-Geteway" }),
        nestWinstonModuleUtilities.format.nestLike("Api-Geteway") 
      )
    }),
    new winston.transports.File({
      filename:"logs/combine.log",
      level:"info",
      format:winston.format.combine(
        winston.format.label({label:"Api-Geteway"}),
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename:"logs/error.log",
      level:"error",
      format:winston.format.combine(
        winston.format.label({label:"Api-Geteway"}),
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  ]
};
