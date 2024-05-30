/** @jsxImportSource @emotion/react */
import {
  CartItemContainerStyle,
  CartItemDetailControlsStyle,
  CartItemQuantityContainerStyle,
  CartItemQuantityStyle,
} from "./CartItem.style";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useCallback } from "react";
import { cartState, cartItemCheckedState, cartItemIdListState } from "../../../store/atom/atoms";
import { changeProductAmount, deleteProduct } from "../../../store/api";
import { deleteCartItemCheckedStateInStorage } from "../../../store/utils";
import Divider from "../Divider/Divider";
import Checkbox from "../Buttons/Checkbox/Checkbox";
import DeleteButton from "../Buttons/DeleteButton/DeleteButton";
import QuantityButton from "../Buttons/QuantityButton/QuantityButton";
import BasicCartItem from "./BasicCartItem";

interface CartItemProps {
  CartItemInfo: CartItemInfo;
}

const CartItem = ({ CartItemInfo }: CartItemProps) => {
  const { id } = CartItemInfo;
  const [isCheck, setIsCheck] = useRecoilState(cartItemCheckedState(id));
  const setItemIdList = useSetRecoilState(cartItemIdListState);
  const setCartState = useSetRecoilState(cartState);

  const handleCheckBoxClick = () => {
    setIsCheck(!isCheck);
  };

  const deleteCartItemIdFromState = useCallback(() => {
    setItemIdList((prev) => {
      const index = prev.findIndex((value) => value === id);
      const arr = [...prev];
      return [...arr.slice(0, index), ...arr.slice(index + 1)];
    });
  }, [id, setItemIdList]);

  const executeDeleteProduct = () => {
    deleteCartItemIdFromState();
    deleteProduct(id);
    deleteCartItemCheckedStateInStorage(id);
    setCartState((prev) => {
      const temp = JSON.parse(JSON.stringify(prev));
      return temp.filter((item: CartItemInfo) => item.id !== id);
    });
  };

  const handleDeleteButtonClick = () => {
    executeDeleteProduct();
  };

  const handleMinusButtonClick = () => {
    if (CartItemInfo.quantity === 1) {
      if (confirm("정말 삭제하시겠습니까?")) {
        executeDeleteProduct();
      } else {
        return;
      }
      return;
    }

    changeProductAmount({ quantity: CartItemInfo.quantity - 1, id });
    setCartState((prev) => {
      return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item));
    });
  };

  const handlePlusButtonClick = () => {
    changeProductAmount({ quantity: CartItemInfo.quantity + 1, id });
    setCartState((prev) => {
      return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
    });
  };

  return (
    <div css={CartItemContainerStyle}>
      <Divider />
      <div css={CartItemDetailControlsStyle}>
        <Checkbox isCheck={isCheck} onClick={handleCheckBoxClick} />
        <DeleteButton onClick={handleDeleteButtonClick} />
      </div>

      <BasicCartItem CartItemInfo={CartItemInfo}>
        <div css={CartItemQuantityContainerStyle}>
          <QuantityButton onClick={handleMinusButtonClick} type={CartItemInfo.quantity === 1 ? "canDelete" : "minus"} />
          <div css={CartItemQuantityStyle}>{CartItemInfo.quantity}</div>
          <QuantityButton onClick={handlePlusButtonClick} type={"plus"} />
        </div>
      </BasicCartItem>
    </div>
  );
};

export default CartItem;