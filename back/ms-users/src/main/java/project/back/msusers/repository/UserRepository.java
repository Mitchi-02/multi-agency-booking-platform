package project.back.msusers.repository;

import java.util.Optional;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


import org.springframework.data.jpa.repository.Query;
import project.back.msusers.entity.Role;
import project.back.msusers.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

  @Cacheable(value ="USER_EMAIL", key = "#email")
  Optional<User> findByEmail(String email);

  @Cacheable(value ="USER_ID", key = "#id")
  Optional<User> findById(Long id);

  @Caching(
          evict = {
                  @CacheEvict(value = "USERS_FIND_ALL", allEntries = true),
                  @CacheEvict(value = "USERS_FIND_SEARCH_ROLE", allEntries = true),
                  @CacheEvict(value = "USERS_FIND_ROLE", allEntries = true),
                  @CacheEvict(value = "USERS_FIND_SEARCH", allEntries = true)
          },
          put = {
                  @CachePut(value = "USER_EMAIL", key = "#user.email"),
                  @CachePut(value = "USER_ID", key = "#user.id")
          }
  )
  User save(User user);

  @Cacheable(value = "USERS_FIND_ALL", key = "#pageable.pageNumber + '_' + #pageable.pageSize")
  Page<User> findAll(Pageable pageable);

  @Cacheable(value = "USERS_FIND_SEARCH_ROLE", key = "#keyword + '_' + #role + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
  @Query("SELECT u FROM User u WHERE (u.email ILIKE %?1% OR u.first_name ILIKE %?1% OR u.last_name ILIKE %?1%) AND u.role = ?2")
  Page<User> search(String keyword, Role role, Pageable pageable);

  @Cacheable(value = "USERS_FIND_SEARCH", key = "#keyword + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
  @Query("SELECT u FROM User u WHERE u.email ILIKE %?1% OR u.first_name ILIKE %?1% OR u.last_name ILIKE %?1%")
  Page<User> search(String keyword, Pageable pageable);

  @Cacheable(value = "USERS_FIND_ROLE", key = "#role + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
  Page<User> findByRole(Role role, Pageable pageable);

    @Caching(
            evict = {
                    @CacheEvict(value = "USER_EMAIL", key = "#user.email"),
                    @CacheEvict(value = "USER_ID", key = "#user.id"),
                    @CacheEvict(value = "USERS_FIND_ALL", allEntries = true),
                    @CacheEvict(value = "USERS_FIND_SEARCH_ROLE", allEntries = true),
                    @CacheEvict(value = "USERS_FIND_ROLE", allEntries = true),
                    @CacheEvict(value = "USERS_FIND_SEARCH", allEntries = true)
            }
    )
  void delete(User user);
}
