import { fetchRequest } from "../lib/fetchAPI";

const initialState = {
  basketData: [],
  totalAmount: 0,
  amount: 0,
};

export const basketActionTypes = {
  GET_BASKET: "GET_BASKET",
  INCREMENT_BASKET_ITEM: "INCREMENT_BASKET_ITEM",
  DECREMENT_BASKET_ITEM: "DECREMENT_BASKET_ITEM",
  DEELETE_BASKET_ITEM: "DELETE_BASKET_ITEM",
  UPDATE_TOTAL_PRICE: "UPDATE_TOTAL_PRICE"
};

export const basketReducer = (state = initialState, action) => {
  switch (action.type) {
    case basketActionTypes.GET_BASKET:
      return {
        ...state,
        basketData: action.payload,
      };

    case basketActionTypes.INCREMENT_BASKET_ITEM:
      return {
        ...state,
        basketData: action.payload,
      };
    case basketActionTypes.DECREMENT_BASKET_ITEM:
      return {
        ...state,
        basketData: action.payload,
      };
      case basketActionTypes.UPDATE_TOTAL_PRICE:
        return{
          ...state,
          totalPrice:action.payload
        }
    default:
      return state;
  }
};

export function getBasket() {
  return async (dispatch) => {
    try {
      const responce = await fetchRequest("/basket");
      dispatch({ type: basketActionTypes.GET_BASKET, payload: responce.items });
    } catch (err) {
      console.log(err);
    }
  };
}
export function putBasket(id, amount) {
  return async (dispatch) => {
    try {
      const responce = await fetchRequest(`/basketItem/${id}/update`, {
        method: "PUT",
        body: {
          amount: amount + 1,
        },
      });
      dispatch({
        type: basketActionTypes.INCREMENT_BASKET_ITEM,
        payload: responce.items,
      });
      getBasket();
    } catch (error) {
      console.log("error");
    }
  };
}
export function deleteBasket(id, amount) {
  return async (dispatch) => {
    if (amount !== 0) {
      try {
        const responce = await fetchRequest(`/basketItem/${id}/update`, {
          method: "PUT",
          body: {
            amount: amount ,
          },
        });
        dispatch({
          type: basketActionTypes.DECREMENT_BASKET_ITEM,
          payload: responce.items,
        });
        getBasket();
      } catch (error) {
        console.log("error");
      }
    } else {
      const responce = await fetchRequest(`/basketItem/${id}/delete`, {
        method: "DELETE",
      });
      dispatch({
        type: basketActionTypes.DECREMENT_BASKET_ITEM,
        payload: responce.items,
      });
    }
  };
}
// const totalPrice = cartState.items?.reduce(
//   (prev, current) => prev + current.amount * current.price,
//   0
// );

// const orderAmount = cartState.items?.reduce(
//   (prev, current) => prev + current.amount,
//   0
// );
// const cartValue = {
//   items: cartState.items,
//   totalAmount: orderAmount,
//   amount: cartState.amount,
//   totalPrice: totalPrice,
// };