from fastapi import APIRouter

router = APIRouter()

products = {}

@router.get("/products")
def get_products():
    return products


@router.get("/products/{product_id}")
def get_product(product_id: int):
    product = products.get(product_id)
    if product is None:
        return {"error": "Product not found"}
    return {"id": product_id, "product": product}