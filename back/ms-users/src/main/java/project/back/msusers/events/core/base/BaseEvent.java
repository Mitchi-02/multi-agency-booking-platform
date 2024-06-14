package project.back.msusers.events.core.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class BaseEvent<T, D> {
        private T type;
        private D data;
}
