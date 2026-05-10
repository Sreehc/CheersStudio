package com.cheersstudio.common.util;

public final class SlugUtils {

  private SlugUtils() {}

  public static String normalize(String value) {
    if (value == null) {
      return "";
    }

    return value
        .trim()
        .toLowerCase()
        .replaceAll("[\\s_]+", "-")
        .replaceAll("[^a-z0-9-\\u4e00-\\u9fa5]", "")
        .replaceAll("-{2,}", "-");
  }
}
