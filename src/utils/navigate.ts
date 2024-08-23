// export const navigation = {
//   navigate: (path: string) => {},
// };

import { useNavigate } from 'react-router-dom';

const useCustomNavigate = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string, state?: Record<string, any>) => {
    navigate(path, { state });
  };

  return {
    navigateTo,
  };
};

export default useCustomNavigate;
