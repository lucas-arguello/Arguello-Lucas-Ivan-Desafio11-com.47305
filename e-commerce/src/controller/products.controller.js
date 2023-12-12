import { ProductsService} from '../service/products.service.js'
import { CustomError } from '../service/errors/customErrors.js';
import { generateProductErrorInfo } from '../service/errors/infoDictionary.js';
import { EError } from '../service/errors/enums.js';


export class ProductsController {

    static createProduct = async (req, res, next) => {
        try {
            console.log('paso por createProduct controller');
            const { title, description, code, price, status, stock, category, thumbnails } = req.body;
            if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
                CustomError.createError({
                    name: "Error al crear el producto",
                    cause: generateProductErrorInfo(req.body),
                    message: "Campos incompletos",
                    code: EError.INVALID_TYPES_ERROR
                })
            }
            const product = req.body;
            const newProduct = await ProductsService.createProduct(product);
            res.json({ status: 'success', message: "Producto creado", data: newProduct });
        } catch (error) {
            next(error);
        }
    }

    static getProducts = async (req, res) => {
        try {
            const products = await ProductsService.getProducts()
            const limit = req.query.limit;//creamos el query param "limit". ej: localhost:8080/api/products?limit=2
                
        if(limit){
            const limitNum = parseInt(limit);//convertimos a "limit" de string a numero

            //utilizamos el metodo "slice" para obtener una parte del arreglo segun el numero limite que elija el cliente.
            const productsLimit = products.slice(0,limitNum);
            res.json(productsLimit);
            
           }else{
               //respondemos la peticion enviando el contenido guardado en prodcuts
               res.json(products)
               console.log("Listado de productos: ", products) 
           }
                
    }catch(error){
        console.log("getProducts",error.message);
        //respuesta para que el cliente sepa que la peticion no fue resuelta correctamente
        res.status(500).json({ status: "error", message: error.message }); 
    };
    }

    static getProductsId = async (req, res) => {
        try{
            //parseamos el valor recibido (como string) de la peticion, a valor numerico, para poder compararlo.
            const productId = req.params.pid;
            //con el "productService", llamamos el metodo "getProductById" y le pasamos el Id que habiamos parseado. 
            const product = await ProductsService.getProductById(productId);
    
            res.json({message:"El producto seleccionado es: ", data:product});
            
        }catch(error){
            //respuesta para que el cliente sepa que la peticion no fue resuelta correctamente
            res.json({status:"error",message: error.message}) 
        };
    }

    static updateProduct = async (req, res) => {
        try {
            const productId = req.params.pid;
            const updatedFields = req.body;
            const product= await ProductsService.updateProduct(productId, updatedFields);
            res.json({ message: "Producto actualizado correctamente", data: product});
            console.log("El producto modificado es: ", product);
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    }
    
    static deleteProduct = async (req, res) => {
        try {
            const productId = req.params.pid;
            const product = await ProductsService.deleteProduct(productId);
            if (product === null) {
                res.json({ status: "error", message: "No se encontró el producto a eliminar" });
                return;
            } else {
                res.json({ message: "Producto eliminado correctamente", data: product });
                console.log("El producto eliminado es: ", product);
                return;
            }
        } catch (error) {
            res.json({ status: "error", message: error.message });
            return;
        }
    }
}