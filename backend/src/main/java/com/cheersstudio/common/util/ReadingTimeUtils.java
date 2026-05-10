package com.cheersstudio.common.util;

public final class ReadingTimeUtils {

  private ReadingTimeUtils() {}

  public static String estimate(String markdown) {
    if (markdown == null || markdown.isBlank()) {
      return "1 min";
    }

    String plainText =
        markdown
            .replaceAll("[#>*`~_\\-]", " ")
            .replaceAll("\\[(.*?)\\]\\((.*?)\\)", "$1")
            .trim();
    if (plainText.isBlank()) {
      return "1 min";
    }

    int words = plainText.split("\\s+").length;
    int minutes = Math.max(1, Math.round(words / 200f));
    return minutes + " min";
  }
}
