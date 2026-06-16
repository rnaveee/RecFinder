package com.recfinder.recfinder.repository;

import com.recfinder.recfinder.entity.Scrimmage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ScrimmageRepository extends JpaRepository<Scrimmage, Long> {

    @Query("SELECT s FROM Scrimmage s WHERE (:sport IS NULL OR s.sport = :sport) AND (:city IS NULL OR s.city = :city)")
    List<Scrimmage> search(@Param("sport") String sport, @Param("city") String city);

}
