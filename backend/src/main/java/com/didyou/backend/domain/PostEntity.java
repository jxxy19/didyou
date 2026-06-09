package com.didyou.backend.domain;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Time;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Entity
@Table( name = "posts", indexes = {
        @Index(name = "idx_room_category", columnList = "room_id,category_id")
})
public class PostEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private RoomEntity room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false, length = 500)
    private String photoUrl;

//    text
    @Lob
    @Column(nullable = true)
    private String memo;

//    인증한 정확한 시각 (HH:MM:SS)
    @Column(name = "timeStamp", nullable = false)
    private Time timeStamp;

}
