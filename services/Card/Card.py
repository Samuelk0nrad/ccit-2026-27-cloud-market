from fastapi import APIRouter, FastAPI

router = APIRouter()

cards = {}

@router.get("/cards")
def get_cards():
    return cards


@router.get("/cards/{card_id}")
def get_card(card_id: int):
    card = cards.get(card_id)
    if card is None:
        return {"error": "Card not found"}
    return {"id": card_id, "card": card}


app = FastAPI()
app.include_router(router)