import { productController } from "../controllers/product.controller";
import { router } from "../utils/import-router";

export const productRouter = router;

router.get("/", productController.getProducts);
router.get("/:uid", productController.getProductsByUserId);
router.get("/:pid", productController.getProductById);
router.put("/:pid", productController.updateProductById);
router.delete("/:pid", productController.deleteProductById);
