package com.taskman.user_service.dao.interfaces;

import com.taskman.user_service.entity.User;
import java.util.Optional;

public interface UserDao extends BaseDao<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id); 

}