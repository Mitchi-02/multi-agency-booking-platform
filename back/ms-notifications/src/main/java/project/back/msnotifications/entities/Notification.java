package project.back.msnotifications.entities;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.mongodb.lang.NonNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import project.back.msnotifications.serializers.ObjectIdSerializer;

import java.util.Date;

@Document(collection = "notifications")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;

    @NonNull
    private NotificationType type;

    @NonNull
    private Long userId;

    @NonNull
    private UserType userType;

    @NonNull
    private String data;

    @NonNull
    private DataType dataType;

    @NonNull
    private Date createdAt;
}
