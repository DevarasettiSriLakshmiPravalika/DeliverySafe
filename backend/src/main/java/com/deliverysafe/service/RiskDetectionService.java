package com.deliverysafe.service;

import com.deliverysafe.dto.WeatherRequest;
import com.deliverysafe.model.Payout;
import com.deliverysafe.model.User;
import com.deliverysafe.repository.PayoutRepository;
import com.deliverysafe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class RiskDetectionService {

    @Autowired
    private PayoutRepository payoutRepository;

    @Autowired
    private UserRepository userRepository;

    private static final double TEMP_THRESHOLD = 45.0;
    private static final double RAINFALL_THRESHOLD = 50.0;
    private static final double AQI_THRESHOLD = 300.0;

    public Optional<Payout> processWeather(Long userId, WeatherRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        String reason = null;
        if (request.getTemperature() > TEMP_THRESHOLD) {
            reason = "Extreme Heat (>45°C)";
        } else if (request.getRainfall() > RAINFALL_THRESHOLD) {
            reason = "Heavy Rainfall (>50mm)";
        } else if (request.getAqi() > AQI_THRESHOLD) {
            reason = "High AQI (>300)";
        }

        if (reason != null) {
            double payoutAmount = user.getWorkingHoursPerDay() * user.getHourlyEarnings();
            Payout payout = new Payout();
            payout.setUserId(userId);
            payout.setAmount(payoutAmount);
            payout.setReason(reason);
            payout.setTimestamp(LocalDateTime.now());
            return Optional.of(payoutRepository.save(payout));
        }

        return Optional.empty();
    }
}
