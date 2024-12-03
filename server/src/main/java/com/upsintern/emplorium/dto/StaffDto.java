package com.upsintern.emplorium.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffDto {
    String staffName;
    String staffEmail;
    String staffPass;
}
