package com.deliverysafe.repository;

import com.deliverysafe.model.Payout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PayoutRepository extends JpaRepository<Payout, Long> {
    List<Payout> findByUserIdOrderByTimestampDesc(Long userId);
}
