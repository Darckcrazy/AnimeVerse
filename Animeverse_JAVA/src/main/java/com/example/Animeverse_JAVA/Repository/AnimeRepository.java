package com.example.Animeverse_JAVA.Repository;

import com.example.Animeverse_JAVA.Entities.Anime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnimeRepository extends JpaRepository<Anime, Long> {
    Optional<Anime> findByJikanId(Long jikanId);

    @Query("SELECT a FROM Anime a WHERE LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Anime> searchByTitle(@Param("keyword") String keyword, Pageable pageable);
}
