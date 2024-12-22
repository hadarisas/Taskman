package com.taskman.project_service.dao.impl;

import com.taskman.project_service.dao.interfaces.BaseDao;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
public abstract class BaseDaoImpl<T, ID> implements BaseDao<T, ID> {

    @PersistenceContext
    protected EntityManager entityManager;

    private final Class<T> entityClass;

    protected BaseDaoImpl(Class<T> entityClass) {
        this.entityClass = entityClass;
    }

    @Override
    public T save(T entity) {
        entityManager.persist(entity);
        return entity;
    }

    @Override
    public Optional<T> findById(ID id) {
        return Optional.ofNullable(entityManager.find(entityClass, id));
    }

    @Override
    public List<T> findAll() {
        var cb = entityManager.getCriteriaBuilder();
        var cq = cb.createQuery(entityClass);
        var rootEntry = cq.from(entityClass);
        var all = cq.select(rootEntry);
        return entityManager.createQuery(all).getResultList();
    }

    @Override
    public void delete(T entity) {
        entityManager.remove(entity);
    }

    @Override
    public void deleteById(ID id) {
        findById(id).ifPresent(this::delete);
    }

    @Override
    public boolean existsById(ID id) {
        return findById(id).isPresent();
    }

    @Override
    public T saveAndFlush(T entity) {
        T managedEntity = entityManager.merge(entity);
        entityManager.flush();
        return managedEntity;
    }

}