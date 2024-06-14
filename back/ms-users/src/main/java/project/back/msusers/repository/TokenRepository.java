package project.back.msusers.repository;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import project.back.msusers.entity.Token;
import project.back.msusers.entity.TokenType;
import project.back.msusers.entity.User;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {

  @Cacheable(value = "TOKEN_USER_TYPE", key = "#user.id + '_' + #type")
  Optional<Token> getFirstByUserAndType(User user, TokenType type);

  @Caching(
          evict = {
                    @CacheEvict(value="TOKEN_USER_TYPE", key="#token.user.id + '_' + #token.type"),
          }
  )
  void delete(Token token);

  @Caching(
            put = {
                    @CachePut(value="TOKEN_USER_TYPE", key="#token.user.id + '_' + #token.type")
            }
  )
  Token save(Token token);

  @Caching(
          evict = {
                    @CacheEvict(value="TOKEN_USER_TYPE", key="#userId + '_' + #type")
          }
  )
  @Modifying
  void deleteByUser_idAndType(Long userId, TokenType tokenType);
}
