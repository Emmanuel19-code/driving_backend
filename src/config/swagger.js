import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";


const options ={
    definition:{
         openapi:"3.0.0",
         info:{
            title:"driving backend Docs",
            version:1
         },
         components:{
             securitySchemes:{
                 bearerAuth:{
                     type:"http",
                     scheme:"bearer",
                     bearerFormat:"JWT"
                 }
             }
         },
         security:[
            {
                bearerAuth:[]
            }
         ]
    },
    apis:["src/config/swagger.yaml"]
}

const swaggerSpec = swaggerJSDoc(options)

export const swaggerDocs = (app,port)=>{
    app.use("/docs",swaggerUI.serve,swaggerUI.setup(swaggerSpec))
    console.log(`Swagger Docs available at http://localhost:${port}/docs`);
}