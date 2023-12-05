package ru.util;

import lombok.AllArgsConstructor;
import lombok.Data;
@AllArgsConstructor
@Data
public class SearchCriteria {

private String key;
private String operation;
private Object value;

}
