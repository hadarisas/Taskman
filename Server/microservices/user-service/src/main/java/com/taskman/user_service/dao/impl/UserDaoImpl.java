package com.taskman.user_service.dao.impl;

import com.taskman.user_service.dao.interfaces.UserDao;
import com.taskman.user_service.entity.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserDaoImpl extends BaseDaoImpl<User, Long> implements UserDao {

    public UserDaoImpl() {
        super(User.class);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        try {
            User user = entityManager.createQuery(
                            "SELECT u FROM User u WHERE u.email = :email", User.class)
                    .setParameter("email", email)
                    .getSingleResult();
            return Optional.of(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        try {
            entityManager.createQuery(
                            "SELECT 1 FROM User u WHERE u.email = :email", Integer.class)
                    .setParameter("email", email)
                    .getSingleResult();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}