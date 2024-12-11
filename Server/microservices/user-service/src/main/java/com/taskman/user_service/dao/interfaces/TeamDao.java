package com.taskman.user_service.dao.interfaces;

import com.taskman.user_service.entity.Team;

public interface TeamDao extends BaseDao<Team, Long> {
    boolean existsByName(String name);
}