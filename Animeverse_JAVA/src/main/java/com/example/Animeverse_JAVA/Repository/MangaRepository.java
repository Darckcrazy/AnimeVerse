package com.example.Animeverse_JAVA.Repository;

import com.example.Animeverse_JAVA.Entities.Manga;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MangaRepository extends JpaRepository<Manga, Long> {
    Optional<Manga> findByJikanId(Long jikanId);

    @Query("SELECT m FROM Manga m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Manga> searchByTitle(@Param("keyword") String keyword, Pageable pageable);
}
