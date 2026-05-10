package com.cheersstudio.common.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.cheersstudio.common.exception.BadRequestException;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class JsonUtils {

  private final ObjectMapper objectMapper;

  public JsonUtils(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  public String toJson(Object value) {
    try {
      return objectMapper.writeValueAsString(value);
    } catch (JsonProcessingException exception) {
      throw new BadRequestException("JSON 序列化失败");
    }
  }

  public <T> T fromJson(String value, TypeReference<T> typeReference) {
    if (!StringUtils.hasText(value)) {
      return null;
    }
    try {
      return objectMapper.readValue(value, typeReference);
    } catch (JsonProcessingException exception) {
      throw new BadRequestException("JSON 反序列化失败");
    }
  }

  public List<String> readStringList(String value) {
    List<String> list = fromJson(value, new TypeReference<List<String>>() {});
    return list == null ? Collections.emptyList() : list;
  }
}
