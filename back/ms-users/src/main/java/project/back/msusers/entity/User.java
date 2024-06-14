package project.back.msusers.entity;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;

import org.hibernate.annotations.ColumnDefault;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import project.back.msusers.service.StorageService;

@Entity
@Table(name = "users")
@Data 
@AllArgsConstructor
@NoArgsConstructor
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true, length = 30)
    private String first_name;

    @Column(nullable = true, length = 30)
    private String last_name;

    @Column(nullable = false, unique = true, length = 30)
    private String email;

    @Column(nullable = false, length = 255)
    @JsonIgnore
    private String password;

    @Column(nullable = true, length = 60)
    private String address;

    @Column(nullable = true, length = 20)
    private String phone;

    @Column(nullable= true, length = 100)
    private String profile_picture;

    @Temporal(TemporalType.DATE)
    @Column(nullable = true)
    private Date birth_date;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column
    @ColumnDefault("false")
    private boolean verified;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = true)
    private String organization_id;

    @Column(nullable = false, name = "completed")
    @ColumnDefault("true")
    private boolean completed;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Collection<Token> tokens;

    @Transient
    public String getProfile_picture() {
        if(this.profile_picture == null) {
            return null;
        }
        return StorageService.BASE_URL + this.profile_picture;
    }

    @CreationTimestamp
    private Date created_at;

    @UpdateTimestamp
    private Date updated_at;
}
