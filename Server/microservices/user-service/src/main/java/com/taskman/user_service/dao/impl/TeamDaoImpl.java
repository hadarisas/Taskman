package com.taskman.user_service.dao.impl;

import com.taskman.user_service.dao.interfaces.TeamDao;
import com.taskman.user_service.entity.Team;
import jakarta.persistence.NoResultException;
import org.springframework.stereotype.Repository;

@Repository
public class TeamDaoImpl extends BaseDaoImpl<Team, Long> implements TeamDao {

    public TeamDaoImpl() {
        super(Team.class);
    }

    @Override
    public boolean existsByName(String name) {
        try {
            entityManager.createQuery("SELECT 1 FROM Team t WHERE t.name = :name", Integer.class)
                    .setParameter("name", name)
                    .getSingleResult();
            return true;
        } catch (NoResultException e) {
            return false;
        }
    }
}