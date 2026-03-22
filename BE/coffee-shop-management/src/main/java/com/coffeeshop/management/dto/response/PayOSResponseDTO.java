package com.coffeeshop.management.dto.response;


import lombok.Data;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PayOSResponseDTO {

    private String code;
    private String desc;
    private DataResponse data;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DataResponse {
        private String checkoutUrl;
        private String qrCode;
        private Long orderCode;
        private String status;
        private String paymentLinkId;
        private Integer amount;
    }
}