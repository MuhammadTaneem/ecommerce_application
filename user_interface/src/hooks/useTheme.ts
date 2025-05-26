import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleTheme } from '../store/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { isDark } = useSelector((state: RootState) => state.theme);

  const toggle = () => {
    dispatch(toggleTheme());
  };

  return { isDark, toggle };
};