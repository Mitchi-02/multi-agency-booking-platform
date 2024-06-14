package project.back.msusers.response.user;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import project.back.msusers.entity.User;

@Data
@AllArgsConstructor
public class FindUsersResponseDTO {
  private int page;
  private int page_size;
  private Long count;
  private List<User> results;
}
