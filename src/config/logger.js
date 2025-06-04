import winston from "winston"

const {combine,timestamp,printf,colorize,simple} = winston.format;

const logger = winston.createLogger({
    level:'debug',
    format:combine(
        timestamp(),
        printf((info)=>`${info.timestamp} ${info.level} ${info.message}`)
    ),
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({filename:"src/logs/application.log"})
    ]
})

if(process.env.NODE_ENV !== "production")
{
    logger.add(
        new winston.transports.Console({
            format:combine(colorize(),simple())
        })
    )
}

export default logger;