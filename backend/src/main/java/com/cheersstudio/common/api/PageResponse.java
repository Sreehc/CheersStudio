package com.cheersstudio.common.api;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.Collections;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {

  private List<T> records;
  private long total;
  private long current;
  private long size;

  public static <T> PageResponse<T> empty(PageRequest request) {
    return PageResponse.<T>builder()
        .records(Collections.emptyList())
        .total(0)
        .current(request.getCurrent())
        .size(request.getSize())
        .build();
  }

  public static <T> PageResponse<T> fromPage(IPage<T> page) {
    return PageResponse.<T>builder()
        .records(page.getRecords())
        .total(page.getTotal())
        .current(page.getCurrent())
        .size(page.getSize())
        .build();
  }
}
