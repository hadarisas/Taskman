import { useSelector, useDispatch } from 'react-redux';
import { selectUsersByIds, selectUsersLoading, fetchUsers } from '../store/slices/usersSlice';

export const useUsers = (userIds) => {
  const dispatch = useDispatch();
  const users = useSelector(state => selectUsersByIds(state, userIds));
  const isLoading = useSelector(selectUsersLoading);

  const loadUsers = () => {
    dispatch(fetchUsers());
  };

  return {
    users,
    isLoading,
    loadUsers
  };
}; 