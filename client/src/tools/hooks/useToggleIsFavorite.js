import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { changeFavorites } from "../../actions/users";
import * as api from "../../apis";

const useToggleIsFavorite = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const switchFavorites = async (id, e) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      await api.toggleFavorite({ tourId: id });

      dispatch(changeFavorites(id));
      console.log("favorite is toggling");
    } catch (error) {
      console.log(error);
      navigate("/users/login");
    }
  };

  return { switchFavorites };
};

export default useToggleIsFavorite;
