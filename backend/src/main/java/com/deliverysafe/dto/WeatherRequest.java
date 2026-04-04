package com.deliverysafe.dto;

import lombok.Data;

@Data
public class WeatherRequest {
    private Double temperature;
    private Double rainfall;
    private Double aqi;
}
