import {Router} from "express";//importamos "routes" desde la libreria de express, para poder realizar el ruteo de los metodos.
import { ProductsController } from '../controller/products.controller.js'; 
import { authorization, jwtAuth } from '../middlewares/auth.js';//importacion del middleware de autorizacion de roles y validacion de usuario
import { logger } from "../helpers/logger.js";

const router = Router();

//RUTA PARA PROBAR LOGGERS SEGUN ENTORNO DE TRABAJO
//http://localhost:8080/loggerTest
router.get("/loggerTest", (req, res) => {
  logger.debug("Soy un mensaje DEBUG");
  logger.verbose("Soy un mensaje VERBOSE");
  logger.http("Soy un mensaje HTTP");
  logger.info("Soy un mensaje INFO");
  logger.warn("Soy un mensaje WARN");
  logger.error("Error fatal")
  res.json({ status: "success", message: "Petición recibida" });
});

//Usamos el metodo GET para crear una ruta que nos permita obtener el listado de todos los productos.
router.get("/", ProductsController.getProducts);

//Usamos el metodo GET para crear una ruta que nos permita obtener un solo producto.
router.get("/:pid", ProductsController.getProductsId);

//A las siguientes rutas se les aplico la validacion del usuario y el tipo de rol "admin", para que solo el administrador,
//pueda crear, atualizar y borrar productos.
//Usamos el metodo POST para crear una ruta que nos permita crear un producto.
router.post("/", jwtAuth, authorization(['admin']), ProductsController.createProduct); 

//Usamos el metodo PUT para crear una ruta que nos permita modificar un producto.
router.put("/:pid", jwtAuth, authorization(['admin']), ProductsController.updateProduct);

//Usamos el metodo DELETE para crear una ruta que nos permita eliminar un producto.
router.delete("/:pid", jwtAuth, authorization(['admin']), ProductsController.deleteProduct);




export {router as productsRouter}; //exportamos la ruta hacia la "app.js".